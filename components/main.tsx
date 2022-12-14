import { Avatar, Button, List } from "antd"
import { ArrowRightOutlined } from '@ant-design/icons';

const btn = (link: string) => {
    return <Button
        type='link'
        href={link}
        icon={<ArrowRightOutlined />}

    >Learn More</Button>
}

const data = [
    {
        title: 'GitHub Repositories',
        description: 'View all my repositories',
        link: 'https://github.com',
        rank: 0
    },
    {
        title: 'Articles',
        description: 'A list of all my articles. I write about a variety of topics, including tech trends, scientific research and more.',
        rank: 5
    }
];

const component: React.FC = () => {
    return <div>
        <List
            itemLayout="vertical"
            dataSource={data.sort((a, b) => b.rank - a.rank)}
            renderItem={(item) => (
                <List.Item>
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
    </div>
}

export default component