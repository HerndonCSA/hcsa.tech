import { motion } from "framer-motion";

export default function ContactPage() {
    return (
        <motion.div
            key="contact"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <h1>Contact Page</h1>
        </motion.div>
    );
}