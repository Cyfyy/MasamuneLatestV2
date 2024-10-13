'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { LoginModal } from '@/components/Login/login-modal'

export function Hero() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  
  return (
    <>
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center gap-5">
          <motion.div 
            className="md:w-1/2 text-center md:text-left"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
              Track Your <span className="text-orange-500">Axie Infinity</span> Progress
            </h1>
            <p className="text-xl md:text-base text-gray-600 dark:text-gray-300 mb-8">
              The ultimate tool for Axie Infinity Origins players and guild managers.
            </p>
            <motion.button 
              className="bg-orange-500 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-orange-600 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsLoginModalOpen(true)}
            >
              Get Started
            </motion.button>
          </motion.div>

          <motion.div 
            className="md:w-1/2 mt-12 md:mt-0"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1.1 }}  // Slightly larger for pop effect
            transition={{ duration: 0.6, delay: 0.3 }}
            whileHover={{ scale: 1.2 }}  // Pop effect on hover
            whileTap={{ scale: 1.05 }}  // Slight compression on tap
          >
            <Image
              src="/images/axie.jpg"
              alt="Axie Infinity Origins"
              width={570}
              height={300}
              className="rounded-lg shadow-2xl"
            />
          </motion.div>
        </div>
      </section>

      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
        onSwitchToSignup={() => console.log('Switching to signup modal')} // Add the onSwitchToSignup prop
      />
    </>
  )
}
