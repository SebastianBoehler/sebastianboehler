import Head from 'next/head'
import Image from 'next/image'
import Header from '../../components/header'
import styles from '../../styles/Blog.module.css'

export default function Home() {
    return (
        <main className={styles.main}>
            <div className={styles.grid}>
                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <h3>How to code your own Supreme bot</h3>
                    </div>
                    <div className={styles.cardContent}>
                        <p>Some random text to describe the article</p>
                    </div>
                </div>
                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <h3>How to code your own Supreme bot</h3>
                    </div>
                    <div className={styles.cardContent}>
                        <p>Some random text to describe the article</p>
                    </div>
                </div>
            </div>
        </main>
    )
}