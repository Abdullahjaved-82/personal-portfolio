'use client';
import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion';
import Button from './Button';
import styles from './style.module.scss';
import Nav from './Nav';
import clsx from 'clsx';

const menu = {
    open: {
        width: "88vw",
        height: "75svh",
        transform: "translate(12vw, 12svh)",
        transition: { duration: 0.5, type: "tween", ease: [0.76, 0, 0.24, 1] },
    },
    closed: {
        width: "100px",
        height: "40px",
        transform: "translate(0, 0)",
        transition: { duration: 0.5, delay: 0.35, type: "tween", ease: [0.76, 0, 0.24, 1] },
    },
};

export default function Index() {
    const [isActive, setIsActive] = useState(false);

    return (
        <div className={styles.header}>
            <motion.div
                className={clsx(styles.menu)}
                variants={menu}
                animate={isActive ? "open" : "closed"}
                initial="closed"
            >
                <AnimatePresence>
                    {isActive && <Nav />}
                </AnimatePresence>
            </motion.div>
            <Button isActive={isActive} toggleMenu={() => { setIsActive(!isActive) }} />
        </div>
    )
}
