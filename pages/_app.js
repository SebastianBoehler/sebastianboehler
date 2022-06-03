import '../styles/globals.css'
import Layout from '../components/layout'
import Header from '../components/header'

function MyApp({ Component, pageProps }) {
  return <Layout>
    <Header />
    <Component {...pageProps} />
  </Layout>
}

export default MyApp
