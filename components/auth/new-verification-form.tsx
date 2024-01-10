'use client';

import { useCallback, useEffect, useState } from 'react';
import { BeatLoader } from 'react-spinners';
import { useSearchParams } from 'next/navigation';

import { newVerification } from '@/actions/new-verification';
import { TAlert } from '@/common/types';
import { CardWrapper } from '@/components/auth/card-wrapper';
import { FormAlert } from '@/components/form-alert';

export const NewVerificationForm = () => {
	const [verificationResponse, setVerificationResponse] = useState<
		TAlert | undefined
	>({});

	const searchParams = useSearchParams();

	const token = searchParams.get('token');

	const onSubmit = useCallback(() => {
		if (!token) {
			setVerificationResponse({ error: true, message: 'Missing token!' });
			return;
		}

		newVerification(token)
			.then((data) => {
				setVerificationResponse(data);
			})
			.catch(() =>
				setVerificationResponse({
					error: true,
					message: 'Something went wrong!',
				})
			);
	}, [token]);

	useEffect(() => {
		onSubmit();
	}, [onSubmit]);

	return (
		<CardWrapper
			headerLabel='Confirming your verification'
			backButtonLabel='Back to login'
			backButtonHref='/auth/login'
		>
			<div className='flex items-center w-full justify-center'>
				{!verificationResponse?.message && <BeatLoader />}
				<FormAlert
					isError={verificationResponse?.error}
					message={verificationResponse?.message}
				/>
			</div>
		</CardWrapper>
	);
};
