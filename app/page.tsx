'use client';

import { Poppins } from 'next/font/google';

import { cn } from '@/lib/utils';
import { useCurrentUser } from '@/hooks/use-current-user';
import { Button } from '@/components/ui/button';
import { LoginButton } from '@/components/auth/login-button';

const font = Poppins({
	subsets: ['latin'],
	weight: ['600'],
});

const Home = () => {
	const user = useCurrentUser();

	return (
		<main className='flex h-full flex-col items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400 to-blue-800'>
			<div className='space-y-6 text-center'>
				<h1
					className={cn(
						'text-6xl font-semibold text-white drop-shadow-md',
						font.className
					)}
				>
					🔐 Auth
				</h1>
				<p className='text-white'>
					A comprehensive authentication toolkit.
				</p>
				<div>
					<LoginButton
						mode={user ? 'redirect' : 'modal'}
						asChild={!user}
					>
						<Button
							variant='secondary'
							size='lg'
						>
							Sign in
						</Button>
					</LoginButton>
				</div>
			</div>
		</main>
	);
};

export default Home;
