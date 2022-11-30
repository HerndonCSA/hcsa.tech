import wave from '../assets/images/waves.png';
import { motion } from "framer-motion";


export default function HomePage({ enterAnimation, exitAnimation, animationVariants }) {
  return (
    <motion.div
      key="home"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      <div className="welcome">
        <h1 className="name_top">We are the <span>Herndon</span></h1>
        <div className="flex">
          <h1 className="name_bottom">Computer Science Association</h1>
          <p className="shortcut">Just call us the "HCSA"</p>
        </div>
        <h3 className="info">A place for students to explore the countless fields of computer science.</h3>
      </div>
      <div className="content">
        <div className="join_and_view">
          <img src={wave} alt="waves" />
          <div className="buttons">
            <button className="view">View our ongoing projects</button>
            <div className="or">
              <div className="line" />
              <p>or</p>
              <div className="line" />
            </div>
            <button className="join">Join us</button></div>
        </div>
      </div>
    </motion.div>
  );
}