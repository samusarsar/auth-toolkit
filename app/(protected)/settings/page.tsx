'use client';

import { useTransition, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserRole } from '@prisma/client';

import { settings } from '@/actions/settings';
import { SettingsSchema } from '@/schemas';
import { TAlert } from '@/common/types';
import { useCurrentUser } from '@/hooks/use-current-user';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import {
	Form,
	FormField,
	FormControl,
	FormItem,
	FormLabel,
	FormDescription,
	FormMessage,
} from '@/components/ui/form';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { FormAlert } from '@/components/form-alert';

const SettingsPage = () => {
	const [updateResponse, setUpdateResponse] = useState<TAlert | undefined>(
		{}
	);

	const user = useCurrentUser();

	const { update } = useSession();
	const [isPending, startTransition] = useTransition();

	const form = useForm<z.infer<typeof SettingsSchema>>({
		resolver: zodResolver(SettingsSchema),
		defaultValues: {
			name: user?.name || undefined,
			email: user?.email || undefined,
			password: undefined,
			newPassword: undefined,
			role: user?.role || undefined,
			isTwoFactorEnabled: user?.isTwoFactorEnabled || undefined,
		},
	});

	const onSubmit = (values: z.infer<typeof SettingsSchema>) => {
		startTransition(() => {
			settings(values)
				.then((data) => {
					if (!data.error) {
						update();
					}

					setUpdateResponse(data);
				})
				.catch(() =>
					setUpdateResponse({
						error: true,
						message: 'Something went wrong!',
					})
				);
		});
	};

	return (
		<Card className='w-[600px]'>
			<CardHeader>
				<p className='text-2xl font-semibold text-center'>
					⚙️ Settings
				</p>
			</CardHeader>
			<CardContent>
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
												placeholder='John Doe'
												disabled={isPending}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							{!user?.isOAuth && (
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
														placeholder='john.doe@example.com'
														type='email'
														disabled={isPending}
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
														disabled={isPending}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name='newPassword'
										render={({ field }) => (
											<FormItem>
												<FormLabel>
													New Password
												</FormLabel>
												<FormControl>
													<Input
														{...field}
														placeholder='******'
														type='password'
														disabled={isPending}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</>
							)}
							<FormField
								control={form.control}
								name='role'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Role</FormLabel>
										<Select
											disabled={isPending}
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder='Select a role' />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem
													value={UserRole.ADMIN}
												>
													Admin
												</SelectItem>
												<SelectItem
													value={UserRole.USER}
												>
													User
												</SelectItem>
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
							{!user?.isOAuth && (
								<FormField
									control={form.control}
									name='isTwoFactorEnabled'
									render={({ field }) => (
										<FormItem className='flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm'>
											<div className='space-y-0.5'>
												<FormLabel>
													Two Factor Authentication
												</FormLabel>
												<FormDescription>
													Enable two factor
													authentication for your
													account
												</FormDescription>
											</div>
											<FormControl>
												<Switch
													disabled={isPending}
													checked={field.value}
													onCheckedChange={
														field.onChange
													}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							)}
						</div>
						<FormAlert
							isError={updateResponse?.error}
							message={updateResponse?.message}
						/>
						<Button type='submit'>Save</Button>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
};

export default SettingsPage;
