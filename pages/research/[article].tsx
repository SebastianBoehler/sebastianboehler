/* eslint-disable react/no-children-prop */
import ReactMarkdown from 'react-markdown'
import styles from './article.module.css'
import fs from 'fs'
import { Col, Row } from 'antd'
import { InfoCircleOutlined } from '@ant-design/icons'
import Link from 'next/link'
import rehypeRaw from 'rehype-raw'

export default function Research({ markdown, props }: Record<string, any>) {
    const shouldFormat = props.width < 1000

    return (
        <Row className={styles.row}>
            <Col span={shouldFormat ? 28 : 17} className={styles.mdWrapper}>
                <ReactMarkdown
                    children={markdown}
                    rehypePlugins={[rehypeRaw]}
                />
            </Col>
            <Col span={shouldFormat ? 24 : 7}>
                <div className={styles.notice}>
                    <InfoCircleOutlined />
                    <p>If you&apos;re reading this article in any other language than english it may have been translated using <Link href='https://deepl.com/translate' target='_blank'>deepl</Link></p>
                </div>
            </Col>
        </Row>
    )
}

//load markdown article server side
export async function getServerSideProps(context: any) {
    const { params } = context
    const { article } = params
    //load article from md file in public folder using fs
    const markdown = fs.readFileSync(`public/articles/${article}.md`, 'utf8')

    return {
        props: {
            markdown,
            article
        }
    }
}