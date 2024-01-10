'use server';

import * as z from 'zod';
import bcrypt from 'bcryptjs';

import { db } from '@/lib/db';
import { NewPasswordSchema } from '@/schemas';
import { getPasswordResetTokenByToken } from '@/data/password-reset-token';
import { getUserByEmail } from '@/data/user';

export const newPassword = async (
	values: z.infer<typeof NewPasswordSchema>,
	token?: string | null
) => {
	if (!token) {
		return { error: true, message: 'Missing token!' };
	}

	const validatedFields = NewPasswordSchema.safeParse(values);

	if (!validatedFields.success) {
		return { error: true, message: 'Invalid fields!' };
	}

	const { password } = validatedFields.data;

	const existingToken = await getPasswordResetTokenByToken(token);

	if (!existingToken) {
		return { error: true, message: 'Invalid token!' };
	}

	const hasExpired = new Date(existingToken.expires) < new Date();

	if (hasExpired) {
		return { error: true, message: 'Token has expired!' };
	}

	const existingUser = await getUserByEmail(existingToken.email);

	if (!existingUser) {
		return { error: true, message: 'Email does not exist!' };
	}

	const hashedPassword = await bcrypt.hash(password, 10);

	await db.user.update({
		where: { id: existingUser.id },
		data: { password: hashedPassword },
	});

	return { message: 'Password updated!' };
};
