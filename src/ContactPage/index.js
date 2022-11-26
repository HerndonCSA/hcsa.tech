import { motion } from "framer-motion";

export default function ContactPage({enterAnimation, exitAnimation, animationVariants}) {
    return (
      <motion.div className="container"
        key="contact"
        variants={animationVariants}
        initial={animationVariants[enterAnimation]}
        animate="visible"
        exit={animationVariants[exitAnimation]}
        transition={{ duration: 0.25 }}
      >
            <h1>Contact Page</h1>
        </motion.div>
    );
}