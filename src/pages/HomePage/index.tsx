import "./assets/HomePage.scss";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { Button } from "@mui/material";

const HomePage = () => {
	return (
		<motion.div
			className="homepage"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 0.25 }}
		>
			<div className="welcome-message">
				<h1 className="wm-1">
					We are the
					<span> Herndon</span>
				</h1>
				<h2 className="wm-2">Computer Science Association - HCSA</h2>
				<h3 className="wm-3">
					A place for students to explore the countless fields of
					computer science.
				</h3>
			</div>

			<div className="interactive-content">
				<div className="view-or-join">
					<Button className="view">View Our Ongoing Projects</Button>

					<div className="or">
						<div className="line"></div>
						<p>or</p>
						<div className="line"></div>
					</div>

					<Button className="join">Join Us</Button>
				</div>
			</div>
		</motion.div>
	);
};

export default HomePage;
