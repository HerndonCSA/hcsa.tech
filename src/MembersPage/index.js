import { motion } from "framer-motion";

export default function MembersPage({enterAnimation, exitAnimation, animationVariants}) {
    return (
      <motion.div className="container"
        key="members"
        variants={animationVariants}
        initial={animationVariants[enterAnimation]}
        animate="visible"
        exit={animationVariants[exitAnimation]}
        transition={{ duration: 0.25 }}
      >
            <h1>Members Page</h1>
        </motion.div>
    );
}