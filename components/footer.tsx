
import { Layout } from 'antd'

const { Footer } = Layout

const component: React.FC = () => {
    return <div style={{ bottom: 0, position: 'relative', width: '100%' }}>
        <Footer style={{ backgroundColor: 'white' }}>
            Copyright {new Date().getFullYear()}
        </Footer>
    </div>
}

export default component