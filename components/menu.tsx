import React, { useEffect, useState } from 'react';
import { MediumOutlined, GithubOutlined, LinkedinOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { MenuProps, theme } from 'antd';
import { Menu } from 'antd';
import config from '../hooks/config';

const items: MenuProps['items'] = [
    {
        label: <a href="https://www.linkedin.com/in/sebastian-boehler/" target="_blank" rel="noopener noreferrer">
            LinkedIn
        </a>,
        key: 'home',
        icon: <LinkedinOutlined />,
        disabled: false,
        rank: 0,
        showOnMobile: true,
    },
    {
        label: 'About',
        key: 'about',
        icon: <InfoCircleOutlined />,
        disabled: true,
        rank: 0,
        showOnMobile: true,
    },
    {
        label: 'Articles',
        key: 'app',
        icon: <MediumOutlined />,
        disabled: true,
        rank: 0,
        showOnMobile: true,
    },
    {
        label: <a href="https://github.com/SebastianBoehler" target="_blank" rel="noopener noreferrer">
            GitHub
        </a>,
        key: 'github',
        icon: <GithubOutlined />,
        disabled: false,
        rank: 0,
        showOnMobile: true,
    },
];

type props = {
    type?: 'horizontal' | 'vertical',
    width: number
}

const MenuComponent: React.FC<props> = ({ type, width }: props) => {
    //load padding inline px style from header
    const [current, setCurrent] = useState('research');
    const isMobile = width < config.widthBrakePoint;

    const onClick: MenuProps['onClick'] = (e) => {
        console.log('click ', e);
        setCurrent(e.key);
    };

    return <Menu
        onClick={onClick}
        selectedKeys={[current]}
        mode={type}
        style={{ margin: 'auto', width: '100%' }}
        items={items
            .filter((item) => !isMobile || item.showOnMobile)
            .sort((a, b) => b.rank - a.rank || +a.disabled - +b.disabled)
        } />;
};

export default MenuComponent;