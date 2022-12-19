
import { Layout } from 'antd'

const { Footer } = Layout

const component: React.FC = () => {
    return <div style={{ bottom: 0, position: 'relative', width: '100%' }}>
        <Footer style={{ backgroundColor: 'white', textAlign: 'right' }}>
            Copyright {new Date().getFullYear()} Sebastian Böhler
        </Footer>
    </div>
}

export default component