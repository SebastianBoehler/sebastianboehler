import Head from 'next/head'
import styles from '../../styles/Trading.Overview.module.css'
import React, { useEffect } from 'react'


export default function Home({ overview }) {
    console.log(overview)

    const keys = Object.keys(overview)
    const values = Object.values(overview)

    return (
        <div>
            <Head>
                <title>Sebastian Boehler | Trading Dashboard</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className={styles.main}>
                <div className={styles.grid}>
                    {keys.map((item, index) => {
                        const long = values[index]['long']['main'].filter(item => item['val']).length === values[index]['long']['main'].length
                        const longOpt = values[index]['long']['optional'].filter(item => item['val']).length === values[index]['long']['optional'].length
                        console.log(values[index])
                        return (
                            <div key={index} className={styles.card}>
                                <p>{item}</p>
                                <p>{long ? 'long signal' : ''}</p>
                                <p>{longOpt ? 'long opt signal' : ''}</p>
                            </div>
                        )
                    })}
                </div>
            </main>
        </div>
    )
}

//server side rendering
export async function getServerSideProps({ req, res }) {
    //TODO: load client side to use cache
    const resp = await fetch(`http://localhost:3001/ftx/overview`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })

    return {
        props: {
            overview: await resp.json()
        }
    }
}