'use client';

import * as z from 'zod';

import { useState, useTransition } from 'react';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { NewPasswordSchema } from '@/schemas';
import { newPassword } from '@/actions/new-password';
import { TAlert } from '@/common/types';

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { CardWrapper } from '@/components/auth/card-wrapper';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FormAlert } from '@/components/form-alert';

export const NewPasswordForm = () => {
	const searchParams = useSearchParams();
	const token = searchParams.get('token');

	const [loginResponse, setLoginResponse] = useState<TAlert | undefined>({
		error: false,
		message: '',
	});
	const [isPending, startTransition] = useTransition();

	const form = useForm<z.infer<typeof NewPasswordSchema>>({
		resolver: zodResolver(NewPasswordSchema),
		defaultValues: {
			password: '',
		},
	});

	const onSubmit = (values: z.infer<typeof NewPasswordSchema>) => {
		setLoginResponse({
			error: false,
			message: '',
		});

		startTransition(() => {
			newPassword(values, token).then((data) => {
				setLoginResponse(data);
			});
		});
	};

	return (
		<CardWrapper
			headerLabel='Enter a new password'
			backButtonLabel='Back to login'
			backButtonHref='/auth/login'
		>
			<Form {...form}>
				<form
					className='space-y-6'
					onSubmit={form.handleSubmit(onSubmit)}
				>
					<div className='space-y-4'>
						<FormField
							control={form.control}
							name='password'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Password</FormLabel>
									<FormControl>
										<Input
											{...field}
											disabled={isPending}
											placeholder='******'
											type='password'
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<FormAlert
						isError={loginResponse?.error}
						message={loginResponse?.message}
					/>
					<Button
						type='submit'
						disabled={isPending}
						className='w-full'
					>
						Reset password
					</Button>
				</form>
			</Form>
		</CardWrapper>
	);
};
