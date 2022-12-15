import { ConfigProvider, Layout, theme, notification } from 'antd'
import Menu from '../components/menu'
import Header from '../components/header'
import Main from '../components/main'
import Footer from '../components/footer'
import { useEffect } from 'react'
import useWindowDimensions from '../hooks/windowDimensions'

const { Content, Sider } = Layout

export default function Home() {
  const { height, width } = useWindowDimensions();

  return (
    <ConfigProvider
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
            <Main />
          </Content>
        </Layout>
        <Footer />
      </Layout>
    </ConfigProvider>
  )
}
