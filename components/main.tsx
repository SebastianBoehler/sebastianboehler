import { Button, Card, List, Space } from "antd"
import { ArrowRightOutlined } from '@ant-design/icons';
import styles from './main.module.css'
import config from "../hooks/config";

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
        rank: -Infinity
    },
    {
        title: 'Algorithmic Trading',
        description: 'Simple overview aboutmy algorithmic trading strategies and infrastructur',
        rank: 0
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

    return <div className={styles.mainWrapper}>
        <List
            itemLayout="vertical"
            dataSource={data.sort((a: field, b: field) => b.rank - a.rank)}
            className={styles.list}
            renderItem={(item: field) => (
                <List.Item style={{ maxWidth: '600px' }} className={styles.listItem}>
                    <List.Item.Meta
                        title={<a href={item.link || "/"}>{item.title}</a>}
                        description={item.description}
                    />
                    <div style={{ margin: 'auto' }}>
                        {item.link ? btn(item.link) : null}
                    </div>
                </List.Item>
            )}
        />
        {!isMobile
            ?
            <div className={styles.featured}>
                <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
                    <Card title="Featured (coming soon)" bordered={false} loading={true} className={styles.card}>
                        Card content
                    </Card>
                </Space>
            </div>
            : null
        }
    </div>
}

export default component