import { Col, Layout, Row, theme } from 'antd'
import Image from 'next/image';
import styles from './header.module.css'
const { Header } = Layout

type props = {
    isMobile?: boolean,
}

const headerComponent: React.FC<props> = ({ isMobile }) => {
    return <Header style={{ backgroundColor: 'white' }}>
        <title>Sebastian Böhler</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="Sebastian Böhler's personal website" />
        <Row
            onClick={() => { window.location.href = '/' }}
            className={styles.headerRow}
        >
            <Col className={styles.logoWrapper}>
                <Image src='/logo.png' width="100" height="50" alt='Logo' className={styles.logo} />
            </Col>
        </Row>
    </Header>
};

export default headerComponent;