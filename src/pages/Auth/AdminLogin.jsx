
import Login from './Login';

const AdminLogin = () => (
	<Login
		loginApiUrl='api/users/admin/login/'
		heading='ADMIN LOGIN'
		pageTitle='Admin Login'
		showSignup={false}
	/>
);

export default AdminLogin;
