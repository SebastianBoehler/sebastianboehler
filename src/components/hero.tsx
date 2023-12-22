import { Button } from "@/components/ui/button"
import Link from "next/link"

export function Hero() {
  return (
    <section className="w-full py-28 px-12 md:py-24 lg:py-32 xl:py-48">
      <div className="flex justify-center">
        <div className="flex flex-col justify-center space-y-4 mx-auto">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">Hello, I&apos;m Sebastian</h1>
            <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400 py-2">
              I&apos;m a Web Developer with experience in building high-quality web applications. Here, you can download my
              CV, contact me or scroll down to see more about my projects.
            </p>
          </div>
          <div className="w-full max-w-sm space-y-2" style={{ marginTop: '25px' }}>
            <div className="flex space-x-2">
              <Link href={'/api/download'}>
                <Button>Download CV</Button>
              </Link>
              <Link href={'#contact'}>
                <Button variant="outline">Contact Me</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
