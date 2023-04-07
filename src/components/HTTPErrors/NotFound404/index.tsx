import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';

const NotFound404 = () => {
	const navigate = useNavigate();
	return (
		<>
			<h1>404 - Page Not Found</h1>
			<p>Sorry, the page you are looking for does not exist.</p>
			<p style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
				Go Home
			</p>
		</>
	);
};

export default NotFound404;
