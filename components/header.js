import styles from './header.module.css';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react'

export default function Header(object) {
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
                    <Link href={'/'}>
                        <div className={styles.mobileNavItem} onClick={toggleMenu}>
                            <p>Home</p>
                        </div>
                    </Link>
                    <Link href={'/blog'}>
                        <div className={styles.mobileNavItem} onClick={toggleMenu}>
                            <p>Blog</p>
                        </div>
                    </Link>
                    <Link href={'https://www.linkedin.com/in/sebastian-boehler/'} target={'_blank'} rel={'noopener noreferrer'}>
                        <div className={styles.mobileNavItem} onClick={toggleMenu}>
                            <p>LinkedIn</p>
                        </div>
                    </Link>
                    <Link href={'/projects'}>
                        <div className={`${styles.mobileNavItem} ${styles.mobileNavBtn}`} onClick={toggleMenu}>
                            <p>Projects</p>
                        </div>
                    </Link>
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