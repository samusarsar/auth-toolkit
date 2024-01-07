'use client';

import * as z from 'zod';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { LoginSchema } from '@/schemas';
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
	const form = useForm<z.infer<typeof LoginSchema>>({
		resolver: zodResolver(LoginSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	});

	const onSubmit = (values: z.infer<typeof LoginSchema>) => {
		console.log(values);
	};

	return (
		<CardWrapper
			headerLabel='Welcome back'
			backButtonLabel="Don'ot have an account"
			backButtonHref='/auth/register'
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
							name='email'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input
											{...field}
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
											placeholder='******'
											type='password'
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<FormAlert message='' />
					<Button
						type='submit'
						className='w-full'
					>
						Log in
					</Button>
				</form>
			</Form>
		</CardWrapper>
	);
};
