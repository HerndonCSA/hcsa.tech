import './assets/Waves.scss';

import { useLocation } from 'react-router-dom';

const Waves = () => {
	const location = useLocation();
	// Ternary operator syntax: condition ? true : false
	// Ternary turns className to "waves high" if on the members or contact page
	return (
		<div
			className={
				'waves ' +
				(location.pathname === '/members' ||
				location.pathname === '/contact'
					? 'high'
					: '')
			}
		/>
	);
};

export default Waves;
