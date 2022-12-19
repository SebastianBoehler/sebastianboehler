import { Col, Layout, Row, theme } from 'antd'
import style from './header.module.css'
const { Header } = Layout

const headerComponent: React.FC = () => {
    return <Header style={{ backgroundColor: 'white' }}>
        <title>Sebastian Böhler</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="Sebastian Böhler's personal website" />
        <Row onClick={() => {
            window.location.href = '/'
        }}
            style={{ cursor: 'pointer' }}
        >
            <Col span={12}>
                *logo*
            </Col>
            <Col
                span={12}
                className={style.headerRight}
                style={{ display: 'none' }}
            >
                Online Monitor
            </Col>
        </Row>
    </Header>
};

export default headerComponent;