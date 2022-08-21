import Head from 'next/head'
import styles from '../../styles/Blog.module.css'
import Link from 'next/link'

export default function Home({ articles }) {

    return (
        <div>
            <Head>
                <title>Sebastian Boehler | Projects</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className={styles.main}>
                <div>
                    <p>Algorithmic Crypto Trading</p>
                    <p>Discover my dashboard for algorithmic trading which I use to develop, analyze and optimize trading strategies </p>
                </div>
            </main>
        </div>
    )
}