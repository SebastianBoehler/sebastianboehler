import Main from '../components/main'
import fs from 'fs'

export default function Home({ props }: Record<string, any>) {
  return (
    <Main props={props} />
  )
}

export async function getServerSideProps(context: any) {
  const markdown = fs.readFileSync(`public/articles/negative-effects-co2.md`, 'utf8')

  return {
    props: {
      markdown,
    }
  }
}
