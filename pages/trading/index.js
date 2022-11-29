import Head from 'next/head'
import styles from '../../styles/Trading.module.css'
import React, { useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, BarChart, Bar, ScatterChart, Scatter } from 'recharts';
import { pearsonCorrelation } from '../../utils/pearson-correlation';

const fetchLimit = 5000

async function loadTransactions(id) {
    const resp = await fetch(`http://139.59.156.50/ftx/transactions?limit=${fetchLimit}&id=${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    if (resp.status !== 200) return null
    const data = await resp.json();
    return data;
}

export default function Home({ transactionsSSR }) {
    const [transactions, setTransactions] = React.useState(transactionsSSR);
    const [priceHistory, setPriceHistory] = React.useState([])
    const [chartData, setChartData] = React.useState([])
    const [options, setOptions] = React.useState({
        maxProfit: 100,
        minProfit: -100,
        maxHoldDuration: Math.max(
            ...transactions.filter(t => t.holdDuration).map(t => t.holdDuration)
        )
    })

    const rules = [...new Set(transactions.map(item => item['rule']))]
    const symbols = [...new Set(transactions.map(item => item['symbol']))]
    const tests = []

    useEffect(() => {
        if (transactions.length < 1) return

        console.info(`Check if loading more trxs, ${transactions.length} so far. ID: ${transactions[transactions.length - 1].db_id}`)
        loadTransactions(transactions[transactions.length - 1].db_id)
            .then(newTransactions => {
                if (!newTransactions) {
                    //loadMore()
                    return
                }
                console.log(newTransactions)
                if (newTransactions.length > 0) {
                    setTransactions(
                        [...transactions, ...newTransactions]
                            .sort((a, b) => a.db_id - b.db_id)
                    )
                }

                if (newTransactions.length < fetchLimit) {
                    setTimeout(() => setActiveTest(tests[0]), 1000)
                }
            })
    }, [transactions])

    //return for all rules per symbol
    for (const rule of rules) {
        for (const symbol of symbols) {
            const filtered = transactions.filter(item => item['rule'] === rule && item['symbol'] === symbol)
            if (filtered.length < 1) continue
            const exits = filtered.filter(item => item['type'].includes('Exit'))
            const profit = exits.reduce((acc, item) => acc + item['netProfit'], 0)

            const maxInvest = Math.max(...filtered.map(item => item['netInvest']))
            const minInvest = Math.min(...filtered.map(item => item['netInvest']))
            const startInvest = filtered[0]['netInvest']

            const maxProfit = +((maxInvest - startInvest) / startInvest * 100).toFixed(2)
            const minProfit = +((minInvest - startInvest) / startInvest * 100).toFixed(2)

            const maxTrxProfit = +Math.max(...exits.map(item => item['netProfitPercentage'])).toFixed(2)
            const minTrxProfit = +Math.min(...exits.map(item => item['netProfitPercentage'])).toFixed(2)

            const percent = (filtered[filtered.length - 1]['netInvest'] - filtered[0]['netInvest']) / filtered[0]['netInvest'] * 100

            const avgAmount = filtered.reduce((acc, item) => acc + (item['details']['1m volume'] / 20), 0) / filtered.length
            tests.push({
                rule,
                symbol,
                profit,
                percent,
                maxProfit,
                minProfit,
                maxTrxProfit,
                minTrxProfit,
                avgAmount
            })
        }
    }
    tests.sort((a, b) => b.percent - a.percent)
    const [activeTest, setActiveTest] = React.useState(tests[0] || {})
    const [filteredTrxs, setFilteredTrxs] = React.useState(transactions.filter(item =>
        item['rule'] === activeTest.rule &&
        item['symbol'] === activeTest.symbol
    ))
    const [filteredEntries, setFilteredEntries] = React.useState(filteredTrxs.filter(item => item['type'].includes('Entry')))
    const [filteredExits, setFilteredExits] = React.useState(filteredTrxs.filter(item =>
        item['type'].includes('Exit') &&
        item['netProfitPercentage'] <= options['maxProfit'] &&
        item['netProfitPercentage'] >= options['minProfit'] &&
        item['holdDuration'] <= options['maxHoldDuration']
    ))
    const entryDetails = filteredExits.length > 0 ? Object.keys(filteredExits[0]['entryDetails']) : ['']
    const [detailsKey, setDetailsKey] = React.useState(entryDetails[0])

    useEffect(() => {
        //setPriceHistory([])
        console.log(activeTest)

        setOptions({
            ...options,
            maxProfit: activeTest.maxTrxProfit,
            minProfit: activeTest.minTrxProfit,
        })

        setFilteredTrxs(transactions.filter(item => item['rule'] === activeTest.rule && item['symbol'] === activeTest.symbol))

        const time = transactions[0]?.timestamp || Date.now()
        //console.log('load priceHistory', time, new Date(time).toLocaleString(), transactions.length)
        if (!activeTest.symbol) return
        fetch('http://139.59.156.50/ftx/priceHistory', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                time: time - (1000 * 60 * 60 * 2),
                symbol: activeTest.symbol,
            })
        })
            .then(res => res.json())
            .then(data => setPriceHistory(data))
            .catch(e => console.error(e))
    }, [activeTest])

    useEffect(() => {
        const granularity = +(priceHistory.length / 150).toFixed(0)
        const filteredHistory = priceHistory.filter((item, index) => index % granularity === 0)

        const tempArray = []
        for (const { time: timestamp, close } of filteredHistory) {
            const obj = {
                time: new Date(timestamp).toLocaleDateString(),
                price: +((close / filteredHistory[0].close - 1) * 100).toFixed(2)
            }

            for (let rule of rules) {
                if (rule === 'correlation') continue
                const temp = transactions.filter(item =>
                    item.rule === rule &&
                    item.timestamp <= timestamp &&
                    item.symbol === activeTest.symbol
                )
                if (temp.length < 1) {
                    obj[rule] = 0
                    continue
                }

                if (timestamp > Math.max(...transactions.map(item => item.timestamp))) {
                    obj[rule] = null
                    continue
                }

                const currentVal = temp[temp.length - 1]?.netInvest || temp[0].netInvest
                obj[rule] = +((currentVal - temp[0].netInvest) / temp[0].netInvest * 100).toFixed(2)
            }

            tempArray.push(obj)
        }
        setChartData(tempArray)
    }, [priceHistory])

    useEffect(() => {
        setFilteredTrxs(transactions.filter(item =>
            item['rule'] === activeTest.rule &&
            item['symbol'] === activeTest.symbol &&
            item['netProfitPercentage'] <= options['maxProfit'] &&
            item['netProfitPercentage'] >= options['minProfit']
        ))

        setFilteredExits(filteredTrxs.filter(item =>
            item['type'].includes('Exit') &&
            item['netProfitPercentage'] <= options['maxProfit'] &&
            item['netProfitPercentage'] >= options['minProfit'] &&
            item['holdDuration'] <= options['maxHoldDuration']
        ))
    }, [options])

    //avg profit per rule
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

    //correlations
    //console.log('filteredTrxs', filteredTrxs)
    const correlations = []
    const indicators = Object.keys(transactions[0]?.details || [])
    for (const key of indicators) {
        let values = filteredEntries.map(item => item['details'][key])
        const profits = filteredExits.map(item => item['netProfitPercentage'])
        if (activeTest.rule === 'correlation') values = filteredExits.map(item => item['details'][key])
        //console.log('correl test', filteredEntries, filteredTrxs)
        const correlation = pearsonCorrelation([values, profits], 0, 1)
        correlations.push({
            key,
            correlation
        })
    }

    useEffect(() => {
        setTimeout(() => {
            const index = entryDetails.findIndex(item => item === detailsKey)
            if (index === entryDetails.length - 1) setDetailsKey(entryDetails[0])
            else setDetailsKey(entryDetails[index + 1])
        }, 1000 * 15);
    }, [detailsKey])

    return (
        <div>
            <div className={styles.sidebar}>
                <div>
                    <p>Max Profit: {options['maxProfit']}</p>
                    <input
                        type={'range'}
                        min={activeTest['minTrxProfit']}
                        max={activeTest['maxTrxProfit']}
                        className={styles.slider}
                        value={options['maxProfit']}
                        onChange={e => setOptions({ ...options, maxProfit: +e.target.value })}
                    />
                </div>
                <div>
                    <p>Min Profit: {options['minProfit']}</p>
                    <input
                        type={'range'}
                        min={activeTest['minTrxProfit']}
                        max={activeTest['maxTrxProfit']}
                        className={styles.slider}
                        value={options['minProfit']}
                        onChange={e => setOptions({ ...options, minProfit: +e.target.value })}
                    />
                </div>
                <div>
                    <p>Hold Duration: {options['maxHoldDuration']}</p>
                    <input
                        type={'range'}
                        min={0}
                        max={Math.max(
                            ...transactions.filter(t => t.holdDuration).map(t => t.holdDuration)
                        )}
                        className={styles.slider}
                        value={options['maxHoldDuration']}
                        onChange={e => setOptions({ ...options, maxHoldDuration: +e.target.value })}
                    />
                </div>
            </div>
            <Head>
                <title>Sebastian Boehler | Trading Dashboard</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className={styles.main}>
                <div className={styles.topMenu} style={{ display: 'none' }}>
                    <p>Trading Dashboard</p>
                    <div>
                        <select onChange={(e) => setSymbol(e.target.value)}>
                            {symbols.map(item => <option key={item} value={item}>{item}</option>)}
                        </select>
                    </div>
                </div>
                <div className={styles.testsWrapper}>
                    {tests.map((item, index) => {
                        const profitColor = item.profit > 0 ? styles.green : styles.red
                        const className = item.rule === activeTest.rule && item.symbol === activeTest.symbol ? `${styles.active} ${styles.testItem}` : styles.testItem

                        if (item.rule === 'correlation') return (
                            <div key={index} className={className} onClick={() => setActiveTest(item)}>
                                <p>{item.rule}</p>
                                <p>{item.symbol}</p>
                            </div>
                        )

                        return (
                            <div key={index} className={className} onClick={() => setActiveTest(item)}>
                                <p>{item.rule}</p>
                                <p>{item.symbol.replace('-', '')}</p>
                                <p className={profitColor}>{item.percent.toFixed(2)}%</p>
                                <p style={{ opacity: 0.3 }} >{item.maxProfit.toFixed(2)}%</p>
                                <p>{item.avgAmount.toFixed(2)}$</p>
                                <p>{item.profit.toFixed(2)}$</p>
                            </div>
                        )
                    })}
                </div>
                <div className={styles.chartWrapper}>
                    {chartData.length > 0 && <ResponsiveContainer width="100%" height={300}>
                        <LineChart
                            width={500}
                            height={300}
                            data={chartData}
                            margin={{
                                top: 20, right: 5, left: 5, bottom: 20,
                            }}
                        >
                            <YAxis hide="true" domain={["dataMin", "dataMax + 1"]} yAxisId="left" />
                            <YAxis hide="true" yAxisId="right" orientation='right' domain={["dataMin", "dataMax + 1"]} />
                            <XAxis dataKey="time" hide="true" />
                            <Tooltip formatter={(val) => val + '%'} />
                            {rules.map(rule => {
                                const width = rule === activeTest.rule ? 3 : 1
                                const color = rule === activeTest.rule ? 'blue' : '#0000ff57'
                                return <Line yAxisId="left" type="monotone" dataKey={rule} stroke={color} strokeWidth={width} dot={false} key={rule} isAnimationActive={false} />
                            })}
                            <Line type="monotone" dataKey="price" stroke="grey" activeDot={{ r: 5 }} strokeWidth={2} yAxisId="right" dot={false} />
                            <ReferenceLine y={0} yAxisId="left" />
                        </LineChart>
                    </ResponsiveContainer>}
                </div>
                <div className={styles.grid}>
                    <div className={styles.chartWrapper} >
                        <p className={styles.chartHeadline} >Average Profit per Rule</p>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart
                                width={500}
                                height={300}
                                data={avgProfits}
                                margin={{
                                    top: 20, right: 30, left: 20, bottom: 20,
                                }}
                            >
                                <XAxis dataKey="rule" hide="true" />
                                <Tooltip formatter={(val) => val + '%'} />
                                <Bar dataKey="profit" fill="blue" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className={styles.chartWrapper} >
                        <p className={styles.chartHeadline} >Indicator Correlation</p>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart
                                width={500}
                                height={300}
                                data={correlations}
                                margin={{
                                    top: 20, right: 30, left: 20, bottom: 20,
                                }}
                            >
                                <XAxis dataKey="key" hide="true" />
                                <Tooltip />
                                <Bar dataKey="correlation" fill="blue" isAnimationActive={false} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className={styles.chartWrapper}>
                        <p className={styles.chartHeadline} >HoldDuration x Profit</p>
                        <ResponsiveContainer width="100%" height={300}>
                            <ScatterChart
                                width={500}
                                height={300}
                                margin={{
                                    top: 20, right: 30, left: 20, bottom: 20,
                                }}
                            >
                                <XAxis dataKey="netProfitPercentage" unit="%" hide="true" type="number" />
                                <YAxis dataKey="holdDuration" hide="true" unit="m" type="number" />
                                <ReferenceLine x={0} strokeDasharray="5 10" />
                                <Scatter data={filteredExits} fill="blue" />
                                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                            </ScatterChart>
                        </ResponsiveContainer>
                    </div>
                    <div className={styles.chartWrapper}>
                        <p className={styles.chartHeadline} >{detailsKey} x Profit</p>
                        <ResponsiveContainer width="100%" height={300}>
                            <ScatterChart
                                width={500}
                                height={300}
                                margin={{
                                    top: 20, right: 30, left: 20, bottom: 20,
                                }}
                            >
                                <XAxis dataKey="netProfitPercentage" unit="%" hide="true" type="number" />
                                <YAxis dataKey={`entryDetails.${detailsKey}`} hide="true" type="number" domain={["dataMin", "dataMax"]} />
                                <ReferenceLine x={0} strokeDasharray="5 10" />
                                <Scatter data={filteredExits} fill="blue" />
                                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                            </ScatterChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </main>
        </div>
    )
}

//server side rendering
export async function getServerSideProps({ req, res }) {
    const resp = await fetch(`http://139.59.156.50/ftx/transactions?limit=${fetchLimit}&id=0`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })

    const data = await resp.json()

    return {
        props: {
            transactionsSSR: data.sort((a, b) => a.db_id - b.db_id)
        }
    }
}