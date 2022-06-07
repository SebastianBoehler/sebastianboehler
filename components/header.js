import styles from './header.module.css';
import Link from 'next/link';
import { useState, useRef } from 'react'

export default function Header({ }) {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    }

    return (
        <div>
            <div className={`${styles.navigationWrapper} ` + (isOpen ? `${styles.open}` : `${styles.closed}`)}>
                <div className={styles.controls}>
                    <p>Sebastan Böhler</p>
                    <p onClick={toggleMenu}>close</p>
                </div>
                <div className={styles.navItemList}>
                    <div className={styles.mobileNavItem}>
                        <Link href="/">
                            <p>Home</p>
                        </Link>
                    </div>
                    <div className={styles.mobileNavItem}>
                        <Link href={'https://www.linkedin.com/in/sebastian-boehler/'} target={'_blank'} rel={'noopener noreferrer'}>
                            <p>LinkedIn</p>
                        </Link>
                    </div>
                    <div className={`${styles.mobileNavItem} ${styles.mobileNavBtn}`}>
                        <Link href={'/projects'}>
                            <p>Projects</p>
                        </Link>
                    </div>
                </div>
            </div>
            <div className={styles.menu}>
                <Link href={'/'}>
                    <p>Sebastian Böhler</p>
                </Link>
                <div className={styles.btnWrapper}>
                    <Link href={'/blog'}>
                        <p>Blog</p>
                    </Link>
                    <Link href={'https://www.linkedin.com/in/sebastian-boehler/'} target={'_blank'} rel={'noopener noreferrer'}>
                        <p>LinkedIn</p>
                    </Link>
                    <Link href={'/projects'}>
                        <button className={styles.btnLogin}>Projects</button>
                    </Link>
                </div>
                <div className={styles.mobileMenu}>
                    <button
                        className={styles.btnMenu}
                        onClick={toggleMenu}
                    >Menu</button>
                </div>
            </div>
        </div>
    )
}