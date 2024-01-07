import {
	ExclamationTriangleIcon,
	CheckCircledIcon,
} from '@radix-ui/react-icons';

import { cn } from '@/lib/utils';

interface FormAlertProps {
	isError?: boolean;
	message?: string;
}

export const FormAlert = ({ isError, message }: FormAlertProps) => {
	if (!message) {
		return null;
	}

	return (
		<div
			className={cn(
				'p-3 rounded-md flex items-center gap-x-2 text-sm',
				isError
					? 'bg-destructive/15 text-destructive'
					: 'bg-emerald-500/15 text-emerald-500'
			)}
		>
			{isError ? (
				<ExclamationTriangleIcon className='h-4 w-4' />
			) : (
				<CheckCircledIcon className='h-4 w-4' />
			)}
			<p>{message}</p>
		</div>
	);
};
