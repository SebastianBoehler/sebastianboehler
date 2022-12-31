import React, { useEffect, useState } from 'react';
import { MediumOutlined, GithubOutlined, LinkedinOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { MenuProps, theme } from 'antd';
import { Menu } from 'antd';
import { ItemType } from 'rc-menu/lib/interface';
import styles from './menu.module.css';
import Link from 'next/link';

const items = [
    {
        label: <Link href="https://www.linkedin.com/in/sebastian-boehler/" target="_blank" rel="noopener noreferrer">
            LinkedIn
        </Link>,
        key: 'linkedin',
        icon: <LinkedinOutlined />,
        disabled: false,
        rank: 0,
        showOnMobile: true,
    },
    {
        label: <Link href='/about'>
            About
        </Link>,
        key: 'about',
        icon: <InfoCircleOutlined />,
        disabled: false,
        rank: 0,
        showOnMobile: true,
    },
    {
        label: 'Articles',
        key: 'articles',
        icon: <MediumOutlined />,
        disabled: true,
        rank: 0,
        showOnMobile: true,
    },
    {
        label: <Link href="https://github.com/SebastianBoehler" target="_blank" rel="noopener noreferrer">
            GitHub
        </Link>,
        key: 'github',
        icon: <GithubOutlined />,
        disabled: false,
        rank: 0,
        showOnMobile: true,
    },
];

type props = {
    type?: 'horizontal' | 'vertical',
    isMobile?: boolean,
}

const MenuComponent: React.FC<props> = ({ type, isMobile }: props) => {
    //load padding inline px style from header
    const [current, setCurrent] = useState('home');

    const onClick: MenuProps['onClick'] = (e) => {
        console.log('click ', e);
        setCurrent(e.key);
    };

    return <Menu
        onClick={onClick}
        selectedKeys={[current]}
        mode={type}
        style={{ margin: 'auto', width: '100%' }}
        className={styles.menu}
        items={items
            .filter((item) => !isMobile || item.showOnMobile)
            .sort((a, b) => b.rank - a.rank || +a.disabled - +b.disabled) as ItemType[]
        } />;
};

export default MenuComponent;