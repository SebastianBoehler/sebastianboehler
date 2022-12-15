import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { ConfigProvider, Layout, theme, notification } from 'antd'
import Menu from '../components/menu'
import Header from '../components/header'
import Footer from '../components/footer'
import useWindowDimensions from '../hooks/windowDimensions'

const { Content, Sider } = Layout

export default function App({ Component, pageProps }: AppProps) {
  const { height, width } = useWindowDimensions();

  return <ConfigProvider
    theme={{
      algorithm: theme.defaultAlgorithm,
    }}
  >
    <Layout style={{ height: '100%' }}>
      <Header />
      <Layout>
        {width > 768 ? <Sider
          breakpoint="md"
          collapsedWidth="0"
          onBreakpoint={(broken) => {
            console.log(broken);
          }}
          onCollapse={(collapsed, type) => {
            console.log(collapsed, type);
          }}
          style={{ backgroundColor: 'white' }}
        >
          <Menu type='vertical' />
        </Sider>
          :
          <Menu type='horizontal' />
        }
        <Content style={{ padding: '30px' }}>
          <Component {...pageProps} />
        </Content>
      </Layout>
      <Footer />
    </Layout>
  </ConfigProvider>
}
