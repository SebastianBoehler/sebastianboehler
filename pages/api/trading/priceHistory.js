import mysql from 'mysql'

const pool = mysql.createPool({
    host: '139.59.156.50',
    user: 'enduser',
    password: 'mysql_password',
    database: 'ftx'
})

export default async function handler(req, res) {
    if (req.method === 'POST') {
        console.log(req.body)
        const history = await new Promise((resolve, reject) => {
            pool.query(`SELECT close, time FROM ${req.body.symbol.replace('-', '')} WHERE time >= ${req.body.time}`, (err, result) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(result.map(item => {
                        return {
                            close: +item.close,
                            time: +item.time
                        }
                    }))
                }
            })
        })
        res.status(200).json(history)
    }
    else res.status(404).end()
}