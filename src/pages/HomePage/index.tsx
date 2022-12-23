import "./assets/HomePage.css";
import { motion } from "framer-motion";
import { useEffect } from "react";

const HomePage = () => {
	// useEffect(() => {
	// 	const elementArray = [
	// 		".homepage",
	// 		".welcome-message",
	// 		".wm-1",
	// 		".wm-2",
	// 		".wm-3",
	// 		".interactive-content",
	// 		".view-or-join",
	// 		".view",
	// 		".join",
	// 	];
	// 	let a = 0.25;
	// 	for (let i = 0; i < elementArray.length; i++) {
	// 		a += 0.05;
	// 		let element = document.querySelector(
	// 			elementArray[i]
	// 		) as HTMLElement;
	// 		element.style.backgroundColor = `rgba(0,0,0,${a})`;
	// 	}
	// }, []);

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
				<h2 className="wm-2">
					Computer Science Assocation - HCSA
				</h2>
				<h3 className="wm-3">
					A place for students to explore the countless fields of
					computer science.
				</h3>
			</div>

			<div className="interactive-content">
				<div className="view-or-join">
					<button className="view">View Our Ongoing Projects</button>

					<div className="or">
						<div className="line"></div>
						<p>or</p>
						<div className="line"></div>
					</div>

					<button className="join">Join Us</button>
				</div>
			</div>
		</motion.div>
	);
};

export default HomePage;
