'use client';

import * as z from 'zod';

import { useState, useTransition } from 'react';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';

import { LoginSchema } from '@/schemas';
import { login } from '@/actions/login';
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

export const LoginForm = () => {
	const searchParams = useSearchParams();
	const urlError =
		searchParams.get('error') === 'OAuthAccountNotLinked'
			? 'Email already in use with a different provider!'
			: '';

	const [showTwoFactor, setShowTwoFactor] = useState(false);
	const [loginResponse, setLoginResponse] = useState<TAlert | undefined>({});
	const [isPending, startTransition] = useTransition();

	const form = useForm<z.infer<typeof LoginSchema>>({
		resolver: zodResolver(LoginSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	});

	const onSubmit = (values: z.infer<typeof LoginSchema>) => {
		setLoginResponse({});

		startTransition(() => {
			login(values)
				.then((data) => {
					if (data?.message) {
						form.reset();
						setLoginResponse(data);
					}

					if (data?.twoFactor) {
						setShowTwoFactor(true);
					}
				})
				.catch(() =>
					setLoginResponse({
						message: 'Something went wrong',
					})
				);
		});
	};

	return (
		<CardWrapper
			headerLabel='Welcome back'
			backButtonLabel="Don't have an account?"
			backButtonHref='/auth/register'
			showSocial
		>
			<Form {...form}>
				<form
					className='space-y-6'
					onSubmit={form.handleSubmit(onSubmit)}
				>
					<div className='space-y-4'>
						{!showTwoFactor && (
							<>
								<FormField
									control={form.control}
									name='email'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Email</FormLabel>
											<FormControl>
												<Input
													{...field}
													disabled={isPending}
													placeholder='john.doe@exmaple.com'
													type='email'
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
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
											<Button
												size='sm'
												variant='link'
												asChild
												className='px-0 font-normal'
											>
												<Link href='/auth/reset'>
													Forgot password?
												</Link>
											</Button>
											<FormMessage />
										</FormItem>
									)}
								/>
							</>
						)}
						{showTwoFactor && (
							<FormField
								control={form.control}
								name='code'
								render={({ field }) => (
									<FormItem>
										<FormLabel>2FA Code</FormLabel>
										<FormControl>
											<Input
												{...field}
												disabled={isPending}
												placeholder='123456'
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						)}
					</div>
					<FormAlert
						isError={loginResponse?.error || !!urlError}
						message={loginResponse?.message || urlError}
					/>
					<Button
						type='submit'
						disabled={isPending}
						className='w-full'
					>
						{showTwoFactor ? 'Confirm' : 'Log in'}
					</Button>
				</form>
			</Form>
		</CardWrapper>
	);
};
