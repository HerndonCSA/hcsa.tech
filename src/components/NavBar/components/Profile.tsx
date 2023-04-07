import ArrowIcon from '../assets/images/arrow-down.svg';
import { motion } from 'framer-motion';

const Profile = ({
	userData,
	dropdownOpen,
	setDropdownOpen,
	profileRef,
	dropdownRef,
}: {
	userData: any;
	dropdownOpen: boolean;
	setDropdownOpen: any;
	profileRef: any;
	dropdownRef: any;
}) => {
	return (
		<div
			className="profile"
			onClick={() => {
				setDropdownOpen(!dropdownOpen);
			}}
			ref={profileRef}
		>
			<img
				src={userData.picture}
				alt="profile"
				referrerPolicy="no-referrer"
			/>
			<p>{userData.first_name}</p>
			<motion.img
				src={ArrowIcon}
				alt="arrow icon"
				animate={{ rotate: dropdownOpen ? 180 : 0 }}
				transition={{ type: 'tween' }}
			/>
		</div>
	);
};

export default Profile;
