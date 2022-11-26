import { motion } from "framer-motion";

export default function MembersPage() {
    return (
        <motion.div
            key="members"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
        >
            <h1>Members Page</h1>
        </motion.div>
    );
}