import "./assets/NavBar.css";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const NavBar = () => {
	const navigate = useNavigate();
	const location = useLocation();

	const navLinkClickEvent = (location) => {
		navigate(location);
	};

	const selectorStyles = {
		"/": {
			marginLeft: "1em",
			width: "7.17em"
		},
		"/members": {
			marginLeft: "10.17em",
			width: "9.85em"
		},
		"/contact": {
			marginLeft: "22em",
			width: "11.15em"
		}
	}



	return (
		<div className="navbar">
			<div className="navlogo">
				<img src="" alt="" />
			</div>
	
			<div className="nav-links">
			<motion.div className="selector" style={selectorStyles[location.pathname]} animate={{ ...selectorStyles[location.pathname] }} transition={{ duration: 0.1, type: "spring", stiffness: 60, damping: 15 }} initial={false} />
				<ul>
					<li onClick={() => navLinkClickEvent("/")} className={location.pathname === "/" ? "selected" : ""}>
						<img src="" alt="" />
						<p>Home</p>
					</li>
					<li onClick={() => navLinkClickEvent("/members")} className={location.pathname === "/members" ? "selected" : ""}>
						<img src="" alt="" />
						<p>Members</p>
					</li>
					<li onClick={() => navLinkClickEvent("/contact")} className={location.pathname === "/contact" ? "selected" : ""}>
						<img src="" alt="" />
						<p>Contact Us</p>
					</li>
				</ul>
			</div>
		</div>
	);
};

export default NavBar;
