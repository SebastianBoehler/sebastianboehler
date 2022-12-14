import { ConfigProvider, Layout, theme, notification } from 'antd'
import Menu from '../components/menu'
import Header from '../components/header'
import Main from '../components/main'
import Footer from '../components/footer'
import { useEffect } from 'react'

const { Content } = Layout

export default function Home() {
  const [api, contextHolder] = notification.useNotification();

  useEffect(() => {
    setTimeout(() => {
      api.info({
        message: `Info`,
        description:
          'This site is still in build :)',
        placement: 'topRight'
      });
    }, 1000);
  })

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
      }}
    >
      {contextHolder}
      <Layout style={{ height: '100%' }}>
        <Header />
        <Menu />
        <Content style={{ padding: '30px' }}>
          <Main />
        </Content>
        <Footer />
      </Layout>
    </ConfigProvider>
  )
}
