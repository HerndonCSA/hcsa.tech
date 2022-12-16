import { motion, AnimatePresence } from "framer-motion";
import loginClose from "../assets/images/loginClose.svg";
import "./assets/style.css";
export default function LoginModal({ loginShown, setLoginShown }) {
	console.log(loginShown);
	return (
		<AnimatePresence key="loginPrompt">
			{loginShown ? (
				<motion.div
					key="loginPrompt"
					className="login-modal"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1, scale: 1 }}
					exit={{ opacity: 0, duration: 1 }}
					transition={{ delay: 0.1, type: "spring", duration: 0.5 }}
				>
					<div class="login-container">
						<h2>
							Students & Teachers Only <br />
						</h2>
						<div className="signin">
							<h3>
							</h3>
							<div class="google-btn">
								<div class="google-icon-wrapper">
									<img
										class="google-icon"
										src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
									/>
								</div>
								<p class="btn-text">
									<b>Sign in with google</b>
								</p>
							</div>
						</div>
					</div>
					<button
							className="exit"
							onClick={() => setLoginShown(false)}
						>
							<img src={loginClose} alt="x" />
						</button>
				</motion.div>
			) : null}
		</AnimatePresence>
	);
}
