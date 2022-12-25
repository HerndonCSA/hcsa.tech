import {motion} from "framer-motion";
import {useState} from "react";

const Dropdown = ({setUserData, dropDownRef, profileRef}: any) => {
    return <motion.div
            key="userMenu"
            ref={dropDownRef}
            className="userMenu"
            animate={{maxHeight: "10em"}}
            transition={{
                duration: 0.1,
                type: "spring",
                stiffness: 100,
                damping: 15,

            }}
            style={{width: profileRef.current?.offsetWidth}}
            initial={{maxHeight: "0em"}}
            exit={{maxHeight: "0em"}}
        >
            <ul className="userMenuList">
                <li className="userMenuListItem">Dashboard</li>
                <li className="userMenuListItem"
                    onClick={() => {
                        // open link in new tab
                        window.open("http://localhost:8000/user/sessions?session=" + localStorage.getItem("session"), "_blank");
                    }}
                >Account Settings</li>
                <hr/>
                <li
                    onClick={() => {
                        // noinspection JSIgnoredPromiseFromCall
                        fetch("http://localhost:8000/logout?session=" + localStorage.getItem("session"),
                            {method: "POST",});
                        localStorage.removeItem("session");
                        // refresh the page
                        window.location.reload();
                    }}
                    className="userMenuListItem"
                    id="sign out"
                >
                    Sign Out
                </li>
            </ul>
        </motion.div>;
};

export default Dropdown;
