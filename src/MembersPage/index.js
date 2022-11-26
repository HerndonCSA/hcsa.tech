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
            <div className="members">
                <h1>Members</h1>
            </div>
        </motion.div>
    );
}