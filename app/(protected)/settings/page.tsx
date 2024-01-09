import { logout } from '@/actions/logout';
import { auth } from '@/auth';

const SettingsPage = async () => {
	const session = await auth();

	return (
		<div>
			{JSON.stringify(session)}
			<form action={logout}>
				<button type='submit'>Sign out</button>
			</form>
		</div>
	);
};

export default SettingsPage;
