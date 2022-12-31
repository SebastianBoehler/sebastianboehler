/* eslint-disable react/no-children-prop */
import { Col, Row } from "antd";
import fs from "fs";
import Link from "next/link";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import styles from "./research.module.css";

type article = {
    article: string,
    markdown: string
}

export default function Research({ props }: Record<string, any>) {
    const content = props.content
    const shouldFormat = props.width < 1000
    return (
        <Row gutter={[16, 16]} className={styles.row} >
            {content.map((article: article, index: number) => {
                return (
                    <Link href={`/research/${article.article}`} key={index} >
                        <Col span={shouldFormat ? 24 : 11} className={styles.column} >
                            <h1>/research/{encodeURIComponent(article.article)}</h1>
                            <ReactMarkdown children={article.markdown} className={styles.markdown} />
                            <div className={styles.gradient} />
                        </Col>
                    </Link>
                )
            })}
        </Row>
    )
}

export async function getServerSideProps(context: any) {
    //load article from md file in public folder using fs
    const files = fs.readdirSync('public/articles')
    const content = files.map((file: string) => {
        const markdown = fs.readFileSync(`public/articles/${file}`, 'utf8')
        return {
            markdown: markdown.substring(0, 900) + '...',
            article: file.split('.')[0]
        }
    })

    return {
        props: {
            content
        }
    }
}