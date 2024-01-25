/**
 * This code was generated by v0 by Vercel.
 * @see https://v0.dev/t/5EIftcnyyv4
 */

import { TimeLineCard, TimeLineCardProps } from "./timelineCard"

const timelineData: TimeLineCardProps[] = [
  {
    title: 'Supreme Bot chrome extension',
    description: 'This was my first contact with coding and JavaScript. I started learning by editing an open-source Chrome extension that automatically adds items to cart on the Supreme website. I then sold this modified software to resellers who used it to buy items and resell them for a profit.',
    date: 'Dec 2017',
    //tags
  },
  {
    title: 'Discord bots',
    description: 'I started learning how to code discord bots in JavaScript. I created a few bots for my friends and me. I also created a ("restock bot") bot that automatically posts new items from the Supreme website in a discord channel.',
    date: 'Jan 2018',
  },
  {
    title: 'Supreme Cop Bot cross-desktop application',
    description: 'Together with an experienced coding partner, we upgraded the Chrome extension to a cross-desktop application. I mainly handled marketing and customer relations, and we actively marketed this software. We were known for our good support and sold this software to resellers who used it to buy items and resell them for a profit. I designed all the graphics for social media using adobe products',
    date: 'Aug 2018',
  },
  {
    title: 'JGR Filderstadt',
    description: 'I was elected as a youth representative for the city of Filderstadt. I was responsible for the youth of my city and organized events for them. I also represented the youth in the city council.',
    date: 'Jun 2019',
  },
  {
    title: 'Paper rounds',
    description: 'Doing paper rounds for a local newspaper company. I did this for a few months to earn some extra money.',
    date: 'Nov 2019',
  },
  {
    title: 'Loop Supreme Bot',
    description: 'I rebranded the bot and continued development by myself. I added a lot of new features and improved the user interface. I also added support for shopify based websites.',
    date: 'Jan 2020',
  },
  {
    title: 'Registering my own company',
    description: 'Offcially registered my own company in germany. I did this to be able to sell my software legally and to be able to pay taxes.',
    date: 'Jan 2020',
  },
  {
    title: 'First CLI algo trading bot',
    description: 'First touch points with crypto and exchange APIs. I developed a simple CLI bot that trades based on only EMA crossings. I used the Coinbase pro API to get the data and place orders.',
    date: 'Jul 2020',
  },
  {
    title: 'Finished school',
    description: 'I finished my german high school',
    date: 'Jul 2020',
  },
  {
    title: 'Fullstack Developer at Remotly',
    description: 'I met the Founder of a online coaching startup and proofed my skill to him, so they hired me as a fullstack developer. I worked on the frontend and backend application for internal use.',
    date: 'Nov 2020',
  },
  {
    title: 'Boehler IO trading bot',
    description: 'I developed a ne wtrading bot with au GUI and a lot of new features. I used the Binance API to get the data and place orders.',
    date: 'Apr 2021',
  },
  {
    title: 'IBM Developing cloud native applications',
    description: 'I took a IBM course to learn and prove my knowledge about cloud native applications and how to develop them.',
    date: 'Apr 2022'
  },
  {
    title: 'Backend Developer at LI.FI',
    description: 'Started my job at a crpyto startup as a backend developer.',
    date: 'Jul 2022'
  },
  {
    title: 'Cloud algo trading system',
    description: 'I brought all my trading scripts, like backtester, live trading bot and data collector together in a cloud system.',
    date: 'Sep 2022'
  },
  {
    title: 'HB Capital',
    description: 'Together with my best friend we founded a crypto algo trading company. The goal is to obtain a BaFin license in the futures and offer investment strategies on tokenized assets like real estate and crypto trading products.',
    date: 'Feb 2023'
  }
]


export function timeline() {
  return (
    <main className="flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold mb-8">My Personal Timeline</h1>
      <div className="w-full max-w-3xl divide-y divide-gray-200">
        {timelineData.map(((props: TimeLineCardProps, idx: number) => (
          <TimeLineCard key={idx} {...props} />
        ))
        )}
      </div>
    </main>
  )
}
