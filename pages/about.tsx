import { Col, Divider, Row, Timeline } from "antd";
import Image from "next/image";
import styles from "./about.module.css";

export default function About({ props }: Record<string, any>) {
  const isMobile = props.isMobile
  const years = new Date().getFullYear() - 2019

  return (
    <Row>
      <Col span={isMobile ? 24 : 12} className={styles.textColumn}>
        <h2>My Journey into coding</h2>
        <p>
          I am a self-taught programmer with about {years} years of experience.
          My journey began when I was in 10th grade and became interested in streetwear, specifically a brand called Supreme.
          At the time, Supreme&apos;s products were highly sought after and would sell out within seconds of being released.
          I thought I could create a bot to purchase these products for me, but I had no programming knowledge.
          I enlisted the help of a classmate who was a programmer and we started working on the project.
          As we progressed, I became more and more interested in programming, especially since I was mainly responsible for the marketing side of the business.
          I started asking my classmate questions and even editing small parts of the code on my own.
          We used Discord for communication and community management and I wanted to add a support ticketing system, so I read an article on how to create a Discord bot.
          This article covered everything from coding to hosting the bot, and that&apos;s how my journey in programming began.
          After we finished school, we lost touch and the project was put on hold for a while.
          However, since it was a profitable business, I wanted to continue it and taught myself more about the source code and frameworks we had used.
        </p>
        <Divider />
      </Col>
    </Row>
  )
}
