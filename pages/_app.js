import '../styles/globals.css'
import Layout from '../components/layout'
import Header from '../components/header'

function MyApp({ Component, pageProps }) {
  return (
    <div>
      <script
        //eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: `
          (function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
    })(window, document, "clarity", "script", "c6jlfc7vjo");
          `
        }}
      />
      <Layout>
        <Header />
        <Component {...pageProps} />
      </Layout>
    </div>
  )
}

export default MyApp
