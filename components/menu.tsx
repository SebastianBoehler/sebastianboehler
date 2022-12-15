import React, { useState } from 'react';
import { AppstoreOutlined, GithubOutlined, LinkedinOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { MenuProps, theme } from 'antd';
import { Menu } from 'antd';

const items: MenuProps['items'] = [
    {
        label: <a href="https://www.linkedin.com/in/sebastian-boehler/" target="_blank" rel="noopener noreferrer">
            LinkedIn
        </a>,
        key: 'home',
        icon: <LinkedinOutlined />
    },
    {
        label: 'About',
        key: 'about',
        icon: <InfoCircleOutlined />,
        disabled: true,
    },
    {
        label: 'Articles',
        key: 'app',
        icon: <AppstoreOutlined />,
        disabled: true,
    },
    {
        label: <a href="https://github.com/SebastianBoehler" target="_blank" rel="noopener noreferrer">
            GitHub
        </a>,
        key: 'github',
        icon: <GithubOutlined />
    }
];

type props = {
    type?: 'horizontal' | 'vertical'
}

const MenuComponent: React.FC<props> = ({ type }: props) => {
    //load padding inline px style from header

    const [current, setCurrent] = useState('mail');

    const onClick: MenuProps['onClick'] = (e) => {
        console.log('click ', e);
        setCurrent(e.key);
    };

    return <Menu
        onClick={onClick}
        selectedKeys={[current]}
        mode={type}
        style={{ paddingInline: '30px 0' }}
        items={items} />;
};

export default MenuComponent;