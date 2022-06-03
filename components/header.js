import styles from './header.module.css';
import Link from 'next/link';

export default function Header({ }) {
    return (
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
                <button className={styles.btnMenu}>Menu</button>
            </div>
        </div>
    )
}