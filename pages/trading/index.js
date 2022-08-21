import Head from 'next/head'
import styles from '../../styles/Trading.module.css'
import mysql from 'mysql'
import React, { useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, PieChart, Pie, BarChart, Bar } from 'recharts';

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: 'storage'
})

export default function Home({ transactions }) {
    const [priceHistoryEth, setPriceHistoryEth] = React.useState([])
    const [chartData, setChartData] = React.useState([])
    const [symbol, setSymbol] = React.useState('ETH-PERP')

    const rules = [...new Set(transactions.map(item => item['rule']))]
    const symbols = [...new Set(transactions.map(item => item['symbol']))]
    const data = transactions.filter(item => item['rule'] === 'test7' && item['symbol'] === symbol)
    const data2 = transactions.filter(item => item['rule'] === 'test2' && item['symbol'] === symbol)

    useEffect(() => {
        fetch('/api/trading/priceHistory', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                time: transactions[0].timestamp - (1000 * 60 * 60 * 2),
                symbol
            })
        })
            .then(res => res.json())
            .then(data => setPriceHistoryEth(data))
    }, [symbol])

    useEffect(() => {
        const granularity = +(priceHistoryEth.length / 200).toFixed(0)
        console.log(granularity)
        const filteredHistory = priceHistoryEth.filter((item, index) => index % granularity === 0)
        console.log(filteredHistory.length)

        const tempArray = []
        for (const { time: timestamp, close } of filteredHistory) {
            //console.log(timestamp, close)

            const obj = {
                time: new Date(timestamp).toLocaleDateString(),
                "price %": +((close / filteredHistory[0].close - 1) * 100).toFixed(2)
            }

            for (let rule of rules) {
                const temp = transactions.filter(item => item.rule === rule && item.timestamp <= timestamp && item['symbol'] === symbol)
                const currentVal = temp[temp.length - 1]?.netInvest || transactions[0].netInvest
                obj[rule] = +((currentVal - transactions[0].netInvest) / transactions[0].netInvest * 100).toFixed(2)
            }

            tempArray.push(obj)
        }
        setChartData(tempArray)
    }, [priceHistoryEth])

    const avgProfits = []

    for (let rule of rules) {
        const profits = []

        for (let symbol of symbols) {
            const trxs = transactions.filter(item => item['rule'] === rule && item['symbol'] === symbol)
            if (trxs.length < 1) continue
            const start = trxs[0]['netInvest']
            const end = trxs[trxs.length - 1]['netInvest']
            const profit = +((end - start) / start * 100).toFixed(2)
            profits.push(profit)
        }

        avgProfits.push({
            rule,
            profit: +(profits.reduce((a, b) => a + b, 0) / profits.length).toFixed(2)
        })
    }

    return (
        <div>
            <Head>
                <title>Sebastian Boehler | Trading Dashboard</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className={styles.main}>
                <div className={styles.topMenu}>
                    <p>Trading Dashboard</p>
                    <div>
                        <select onChange={(e) => setSymbol(e.target.value)}>
                            {symbols.map(item => <option key={item} value={item}>{item}</option>)}
                        </select>
                    </div>
                </div>
                <div className={styles.chartWrapper}>
                    {chartData.length > 0 && <ResponsiveContainer width="100%" height={300}>
                        <LineChart
                            width={500}
                            height={300}
                            data={chartData}
                            margin={{
                                top: 20, right: 30, left: 20, bottom: 20,
                            }}
                        >
                            <YAxis hide="true" domain={["dataMin", "dataMax + 1"]} yAxisId="left" />
                            <YAxis hide="true" yAxisId="right" orientation='right' domain={["dataMin", "dataMax + 1"]} />
                            <XAxis dataKey="time" hide="true" />
                            <Tooltip />
                            {rules.map(rule => <Line yAxisId="left" type="monotone" dataKey={rule} stroke='blue' strokeWidth={2} dot={false} key={rule} />)}
                            <Line type="monotone" dataKey="price %" stroke="grey" activeDot={{ r: 5 }} strokeWidth={2} yAxisId="right" dot={false} />
                            <ReferenceLine y={500} yAxisId="left" />
                        </LineChart>
                    </ResponsiveContainer>}
                </div>
                <div className={styles.grid}>
                    <div className={styles.chartWrapper}>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart
                                width={500}
                                height={300}
                                data={avgProfits}
                                margin={{
                                    top: 20, right: 30, left: 20, bottom: 20,
                                }}
                            >
                                <XAxis dataKey="rule" />
                                <Tooltip />
                                <Bar dataKey="profit" fill="blue" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className={styles.chartWrapper}>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart
                                width={500}
                                height={300}
                                data={data}
                                margin={{
                                    top: 20, right: 30, left: 20, bottom: 20,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <YAxis hide="true" domain={["dataMin", "dataMax + 1"]} />
                                <Tooltip />
                                <Line type="monotone" dataKey="netInvest" stroke="#82ca9d" />
                                <ReferenceLine y={500} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </main>
        </div>
    )
}

//server side rendering
export async function getServerSideProps({ req, res }) {

    const transactions = await new Promise((resolve, reject) => {
        pool.query('SELECT data FROM backtester', (err, results) => {
            if (err) {
                reject(err)
            } else {
                resolve(results.map(item => {
                    const obj = JSON.parse(item['data'])
                    return {
                        ...obj,
                        time: new Date(obj['timestamp']).toLocaleString()
                    }
                }))
            }
        })
    })

    return {
        props: {
            transactions
        }
    }
}