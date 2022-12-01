import { motion, AnimatePresence } from "framer-motion";
import loginClose from '../assets/images/loginClose.svg';
export default function LoginModal({ loginShown, setLoginShown }) {
    console.log(loginShown);
    return (
        <AnimatePresence key="loginPrompt">
            {loginShown ?
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} key="loginPrompt" className="login-modal">
                    <div>
                        <h2>Please prove that you teach or attend at a fairfax county public school.</h2>
                        <div className="signin">
                            <h3>Sign in into a <span>@fcps.edu</span> or <span>@fcpsschools.net</span> google account</h3>
                            <div class="google-btn">
                                <div class="google-icon-wrapper">
                                    <img class="google-icon" src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" />
                                </div>
                                <p class="btn-text"><b>Sign in with google</b></p>
                            </div>
                        </div>
                        <button className="exit" onClick={() => setLoginShown(false)}>
                            <img src={loginClose} alt="x" />
                        </button>
                    </div>
                </motion.div>
                : null
            }
        </AnimatePresence >
    );
}