'use server';

import * as z from 'zod';
import { AuthError } from 'next-auth';

import { signIn } from '@/auth';
import { LoginSchema } from '@/schemas';
import { DEFAULT_LOGIN_REDIRECT } from '@/routes';
import { getUserByEmail } from '@/data/user';
import { getTwoFactorTokenByEmail } from '@/data/two-factor-token';
import { getTwoFactorConfirmationByUserId } from '@/data/two-factor-confirmation';
import { db } from '@/lib/db';
import { sendVerificationEmail, sendTwoFactorTokenEmail } from '@/lib/mail';
import {
	generateVerificationToken,
	generateTwoFactorToken,
} from '@/lib/tokens';

export const login = async (values: z.infer<typeof LoginSchema>) => {
	const validatedFields = LoginSchema.safeParse(values);

	if (!validatedFields.success) {
		return {
			error: true,
			message: 'Invalid fields!',
		};
	}

	const { email, password, code } = validatedFields.data;

	const existingUser = await getUserByEmail(email);

	if (!existingUser || !existingUser.email || !existingUser.password) {
		return { error: true, message: 'Email does not exist!' };
	}

	if (!existingUser.emailVerified) {
		const verificationToken = await generateVerificationToken(
			existingUser.email
		);

		await sendVerificationEmail(
			verificationToken.email,
			verificationToken.token
		);

		return { message: 'Confirmation email sent!' };
	}

	if (existingUser.isTwoFactorEnabled && existingUser.email) {
		if (code) {
			const twoFactorToken = await getTwoFactorTokenByEmail(
				existingUser.email
			);

			if (!twoFactorToken) {
				return { error: true, message: 'Invalid code!' };
			}

			if (twoFactorToken.token !== code) {
				return { error: true, message: 'Invalid code!' };
			}

			const hasExpired = new Date(twoFactorToken.expires) < new Date();

			if (hasExpired) {
				return { error: true, message: 'Code expired!' };
			}

			await db.twoFactorToken.delete({
				where: { id: twoFactorToken.id },
			});

			const existingConfirmation = await getTwoFactorConfirmationByUserId(
				existingUser.id
			);

			if (existingConfirmation) {
				await db.twoFactorConfirmation.delete({
					where: { id: existingConfirmation.id },
				});
			}

			await db.twoFactorConfirmation.create({
				data: {
					userId: existingUser.id,
				},
			});
		} else {
			const twoFactorToken = await generateTwoFactorToken(
				existingUser.email
			);

			await sendTwoFactorTokenEmail(
				twoFactorToken.email,
				twoFactorToken.token
			);

			return { twoFactor: true };
		}
	}

	try {
		await signIn('credentials', {
			email,
			password,
			redirectTo: DEFAULT_LOGIN_REDIRECT,
		});
	} catch (error) {
		if (error instanceof AuthError) {
			switch (error.type) {
				case 'CredentialsSignin':
					return { error: true, message: 'Invalid credentials!' };
				default:
					return { error: true, message: 'Something went wrong!' };
			}
		}

		throw error;
	}
};
