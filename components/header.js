import styles from './header.module.css';
import Link from 'next/link';

export default function Header({ }) {
    return (
        <div className={styles.menu}>
            <Link href={'/'}>
                <p>Sebastian Böhler</p>
            </Link>
            <div className={styles.btnWrapper}>
                <p>LinkedIn</p>
                <Link href={'/home'}>
                    <button className={styles.btnLogin}>Projects</button>
                </Link>
            </div>
        </div>
    )
}