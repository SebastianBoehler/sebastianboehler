import Head from 'next/head'
import Image from 'next/image'
import Header from '../../components/header'
import styles from '../../styles/Blog.module.css'
import Link from 'next/link'
import { useState } from 'react'

export default function Home({ articles }) {
    const [filter, setFilter] = useState('all')

    let categories = ['all', 'node', 'algorithms']

    return (
        <div>
            <Head>
                <title>Sebastian Boehler | Blog</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className={styles.main}>
                <div className={styles.filter}>
                    {categories.map(category => {
                        return (
                            <p
                                onClick={() => setFilter(category)}
                                className={filter === category ? styles.activeFilter : ''}
                                key={`key_${category}`}
                            >{category}</p>
                        )
                    })}
                </div>
                <div className={styles.grid}>
                    {articles.map((article, index) => {
                        return (
                            <Link href={`/blog/${article['title']}`} key={`key_${article['title']} #${index}`}>
                                <div className={styles.card}>
                                    <div className={styles.cardHeader}>
                                        <h3>{article['title']}</h3>
                                    </div>
                                    <div className={styles.cardContent}>
                                        <p>{article['content']}</p>
                                    </div>
                                </div>
                            </Link>
                        )
                    })}
                </div>
            </main>
        </div>
    )
}

//server side rendering
export async function getServerSideProps({ req, res }) {

    let articles = [
        {
            title: 'How to code your own Supreme bot',
            content: 'Some random text to describe the article',
        },
        {
            title: 'How to code your own Supreme bot',
            content: 'Some random text to describe the article',
        },
        {
            title: 'How to code your own Supreme bot',
            content: 'Some random text to describe the article',
        },
    ]


    return {
        props: {
            articles
        }
    }
}