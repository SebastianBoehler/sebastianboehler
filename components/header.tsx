import { Col, Layout, Row, theme } from 'antd'
import style from './header.module.css'
const { Header } = Layout

const headerComponent: React.FC = () => {
    return <Header style={{ backgroundColor: 'white' }}>
        <Row>
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