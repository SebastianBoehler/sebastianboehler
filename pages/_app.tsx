import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { ConfigProvider, Layout, theme, notification } from 'antd'
import Menu from '../components/menu'
import Header from '../components/header'
import Footer from '../components/footer'
import useWindowDimensions from '../hooks/windowDimensions'
import config from '../hooks/config'

const { Content, Sider } = Layout

export default function App({ Component, pageProps }: AppProps) {
  const { width } = useWindowDimensions();
  const isMobile = width < config.widthBrakePoint;

  return <ConfigProvider
    theme={{
      algorithm: theme.defaultAlgorithm,
      components: {
        Menu: {
          radiusItem: 0,
        }
      }
    }}
  >
    <Layout style={{ height: '100%' }}>
      <Header isMobile={isMobile} />
      <Layout>
        {!isMobile ? <Sider
          breakpoint="md"
          collapsedWidth="0"
          onBreakpoint={(broken) => {
            console.log(broken);
          }}
          onCollapse={(collapsed, type) => {
            console.log(collapsed, type);
          }}
          style={{ backgroundColor: 'white', padding: '0 20px', }}
          width={250}
        >
          <Menu type='vertical' isMobile={isMobile} />
        </Sider>
          :
          <Menu type='horizontal' isMobile={isMobile} />
        }
        <Content style={{ padding: '30px' }}>
          <Component {...pageProps} props={{ width, isMobile, ...pageProps }} />
        </Content>
      </Layout>
      <Footer />
    </Layout>
  </ConfigProvider>
}
