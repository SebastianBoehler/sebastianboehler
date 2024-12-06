"use client";

import { Code2, Cpu, LineChart, Lock } from 'lucide-react';

const features = [
  {
    title: "Full-Stack Development",
    description: "Building scalable web applications with modern technologies like React, Next.js, and Node.js. Focus on clean code and best practices.",
    icon: Code2
  },
  {
    title: "Algorithmic Trading",
    description: "Developing sophisticated trading algorithms and backtesting frameworks. Co-founder of HB Capital, specializing in crypto market strategies.",
    icon: LineChart
  },
  {
    title: "Smart Contract Development",
    description: "Creating secure and efficient smart contracts on Solana using Rust and Anchor framework. Experience with DeFi protocols and Web3.",
    icon: Lock
  },
  {
    title: "Machine Learning",
    description: "Implementing ML models for trading strategy optimization and market analysis. Proficient in Python and deep learning frameworks.",
    icon: Cpu
  }
];

export default function FeaturesSection() {
  return (
    <section className="section-container bg-white dark:bg-gray-900">
      <div className="max-w-6xl mx-auto">
        <h2 className="heading-2 text-center mb-12">What I Do</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="p-6 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <div className="flex items-center mb-4">
                <feature.icon className="h-6 w-6 text-gray-900 dark:text-white mr-3" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
