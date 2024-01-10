import type { Metadata } from 'next';
import { SessionProvider } from 'next-auth/react';
import { Inter } from 'next/font/google';

import './globals.css';
import { auth } from '@/auth';
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'Auth-Toolkit',
	description:
		'This is a complete Authentication Toolkit built using Auth.js v5.',
};

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
	const session = await auth();

	return (
		<html lang='en'>
			<body className={inter.className}>
				<SessionProvider session={session}>
					<Toaster />
					{children}
				</SessionProvider>
			</body>
		</html>
	);
};

export default RootLayout;
