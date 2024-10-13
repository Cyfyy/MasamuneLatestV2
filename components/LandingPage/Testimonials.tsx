'use client';

import { motion } from 'framer-motion'
import Image from 'next/image'

const testimonials = [
  {
    name: "Alex Johnson",
    role: "Axie Infinity Player",
    content: "Masamune has completely transformed how I manage my Axies. The insights I get are invaluable!",
    avatar: "/placeholder.svg"
  },
  {
    name: "Sarah Lee",
    role: "Guild Manager",
    content: "As a guild manager, Masamune has made my job so much easier. I can track all my scholars' progress effortlessly.",
    avatar: "/placeholder.svg"
  },
  {
    name: "Mike Chen",
    role: "Professional Axie Trader",
    content: "The real-time market data from Masamune gives me a competitive edge in Axie trading. Highly recommended!",
    avatar: "/placeholder.svg"
  }
]

export function Testimonials() {
  return (
    <section id="testimonials" className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            What Our Users Say
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Hear from the Axie Infinity community about their experience with Masamune.
          </p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div 
              key={index}
              className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow-lg p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <p className="text-gray-600 dark:text-gray-300 mb-4">{testimonial.content}</p>
              <div className="flex items-center">
                <Image
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  width={48}
                  height={48}
                  className="rounded-full mr-4"
                />
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{testimonial.name}</h4>
                  <p className="text-gray-600 dark:text-gray-300">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}