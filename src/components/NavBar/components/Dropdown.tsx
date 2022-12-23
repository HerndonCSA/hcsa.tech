import { motion } from "framer-motion";
import { useState } from "react";



const Dropdown = ({ setUserData }: any) => {
	return (
		<motion.div
			key="userMenu"
			className="userMenu"
			animate={{ maxHeight: "10em" }}
			transition={{
				duration: 0.1,
				type: "spring",
				stiffness: 60,
				damping: 15,
			}}
			initial={{ maxHeight: "0em" }}
			exit={{ maxHeight: "0em" }}
		>
			<ul className="userMenuList">
				<li className="userMenuListItem">Dashboard</li>
				<li className="userMenuListItem">Account Settings</li>
				<hr />
				<li
					onClick={() => {
						let session = localStorage.getItem("session");
						fetch(
							"http://localhost:8000/logout?session=" + session,
							{ method: "POST" }
						);
						localStorage.removeItem("session");
						// refresh the page
						window.location.reload();
					}}
					className="userMenuListItem"
					id="sign out"
				>
					Sign Out
				</li>
			</ul>
		</motion.div>
	);
};

export default Dropdown;
