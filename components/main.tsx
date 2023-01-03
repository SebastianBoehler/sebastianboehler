/* eslint-disable react/no-children-prop */
import { Button, Card, List, Space } from "antd"
import { ArrowRightOutlined } from '@ant-design/icons';
import styles from './main.module.css'
import config from "../hooks/config";
import Link from "next/link";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";

const btn = (link: string) => {
    return <Button
        type='link'
        href={link}
        icon={<ArrowRightOutlined />}

    >Learn More</Button>
}

type field = {
    title: string,
    description: string,
    link?: string,
    rank: number
}

type props = Record<string, any>

const data: field[] = [
    {
        title: 'Scientific Research',
        description: 'A list of all my scientific research projects. I write a lot about tools and methods to improve focus, drive and productivity.',
        link: '/research',
        rank: Infinity
    },
    {
        title: 'GitHub Repositories',
        description: 'View all my repositories and projects on GitHub. Please get in touch if you want to contribute or have any questions.',
        link: 'https://github.com/SebastianBoehler',
        rank: 0
    },
    {
        title: 'Medium Articles',
        description: 'A list of all my articles. I write about a variety of topics, including tech trends, scientific research and more.',
        link: 'https://medium.com/@sebastianboehler',
        rank: 1
    },
    {
        title: 'About Me',
        description: 'A short overview about my background, education and work experience.',
        link: '/about',
        rank: -Infinity
    },
    {
        title: 'Algorithmic Trading',
        description: 'Simple overview aboutmy algorithmic trading strategies and infrastructur',
        rank: -1
    },
    {
        title: 'OpenAI Playground',
        link: '/playground',
        description: 'My own playground to write sales text, ads, emails or articles with the help of GPT models',
        rank: 0
    }
];

const component: React.FC<{ props: props }> = ({ props }: props) => {
    const width = props.width
    const isMobile = width < config.widthBrakePoint
    const markdown: string = props.markdown

    return <div className={styles.mainWrapper}>
        {isMobile ?
            <Space direction="vertical" size="middle">
                <Link href='/research/airquality'>
                    <Card title="Featured" bordered={false} loading={false}>
                        <ReactMarkdown children={markdown} className={styles.markdown} />
                    </Card>
                </Link>
            </Space>
            : null
        }
        <List
            itemLayout="vertical"
            dataSource={data.sort((a: field, b: field) => b.rank - a.rank)}
            className={styles.list}
            renderItem={(item: field) => (
                <List.Item className={styles.listItem}>
                    <Link href={item.link || '/'} target={item.link?.startsWith('/') ? '' : '_blank'}>
                        <List.Item.Meta
                            title={item.title}
                            description={item.description}
                        />
                        <div style={{ margin: 'auto', display: 'none' }}>
                            {item.link ? btn(item.link) : null}
                        </div>
                    </Link>
                </List.Item>
            )}
        />
        {!isMobile
            ?
            <div className={styles.featured}>
                <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
                    <Link href='/research/negative-effects-co2'>
                        <Card title="Featured" bordered={false} loading={false} className={styles.card}>
                            <ReactMarkdown children={markdown} className={styles.markdown} />
                        </Card>
                    </Link>
                </Space>
            </div>
            : null
        }
    </div>
}

export default component