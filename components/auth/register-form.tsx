'use client';

import * as z from 'zod';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { RegisterSchema } from '@/schemas';
import { register } from '@/actions/register';
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

export const RegisterForm = () => {
	const [registerResponse, setRegisterResponse] = useState<TAlert>({});
	const [isPending, startTransition] = useTransition();

	const form = useForm<z.infer<typeof RegisterSchema>>({
		resolver: zodResolver(RegisterSchema),
		defaultValues: {
			email: '',
			password: '',
			name: '',
		},
	});

	const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
		setRegisterResponse({});

		startTransition(() => {
			register(values).then((data) => {
				if (!data?.error) {
					form.reset();
				}

				setRegisterResponse(data);
			});
		});
	};

	return (
		<CardWrapper
			headerLabel='Create an account'
			backButtonLabel='Already have an account?'
			backButtonHref='/auth/login'
			showSocial
		>
			<Form {...form}>
				<form
					className='space-y-6'
					onSubmit={form.handleSubmit(onSubmit)}
				>
					<div className='space-y-4'>
						<FormField
							control={form.control}
							name='name'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Name</FormLabel>
									<FormControl>
										<Input
											{...field}
											disabled={isPending}
											placeholder='John Doe'
											type='text'
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
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
											placeholder='john.doe@example.com'
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
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<FormAlert
						isError={registerResponse?.error}
						message={registerResponse?.message}
					/>
					<Button
						type='submit'
						disabled={isPending}
						className='w-full'
					>
						Create an account
					</Button>
				</form>
			</Form>
		</CardWrapper>
	);
};
