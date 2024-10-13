'use client';

import { motion } from 'framer-motion'
import { ChartBar, Users, Zap } from 'lucide-react'

const features = [
  {
    icon: ChartBar,
    title: "Advanced Analytics",
    description: "Get detailed insights into your Axie Infinity performance with our advanced analytics tools."
  },
  {
    icon: Users,
    title: "Team Management",
    description: "Easily manage your scholars and track their progress with our intuitive team management features."
  },
  {
    icon: Zap,
    title: "Real-time Updates",
    description: "Stay up-to-date with real-time updates on your Axies' performance and market trends."
  }
]

export function Features() {
  return (
    <section id="features" className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Powerful Features for Axie Infinity Players
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Discover how Masamune can help you optimize your Axie Infinity strategy.
          </p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              className="bg-white dark:bg-gray-700 rounded-lg shadow-lg p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <feature.icon className="w-12 h-12 text-orange-500 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}