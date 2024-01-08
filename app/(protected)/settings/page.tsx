import { logout } from '@/actions/logout';

const SettingsPage = async () => {
	return (
		<div>
			<form action={logout}>
				<button type='submit'>Sign out</button>
			</form>
		</div>
	);
};

export default SettingsPage;
