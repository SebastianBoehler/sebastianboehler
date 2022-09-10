import Head from 'next/head'
import styles from '../../styles/Trading.module.css'
import React, { useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, BarChart, Bar, ScatterChart, Scatter } from 'recharts';


export default function Home({ transactions }) {


    return (
        <div>
            <Head>
                <title>Sebastian Boehler | Trading Dashboard</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className={styles.main}>
                <div className={styles.topMenu} style={{ display: 'none' }}>
                    <p>Trading Dashboard</p>
                </div>
            </main>
        </div>
    )
}

//server side rendering
export async function getServerSideProps({ req, res }) {
    const transactions = []

    return {
        props: {
            transactions
        }
    }
}