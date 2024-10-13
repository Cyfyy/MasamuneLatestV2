'use client'

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import Link from "next/link"
import { Menu, X, Sun, Moon } from "lucide-react"
import { LoginModal } from "@/components/Login/login-modal"
import { SignupModal } from "@/components/Login/signup-modal"
import { Revalia } from "next/font/google"

const revalia = Revalia({
  subsets: ['latin'],
  weight: "400",
  display: 'swap',
})

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const handleLoginClick = () => {
    setIsLoginModalOpen(true)
    setIsSignupModalOpen(false)
  }

  const handleSignupClick = () => {
    setIsSignupModalOpen(true)
    setIsLoginModalOpen(false)
  }

  return (
    <>
      <nav className="sticky top-0 z-10 bg-white/30 dark:bg-gray-900/30 backdrop-blur-lg shadow-lg dark:shadow-white/10 border border-white/20 dark:border-gray-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className={`text-2xl font-bold text-orange-600 ${revalia.className}`}>
                Masamune
              </Link>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <Link href="#features" className="text-gray-700 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 px-3 py-2 rounded-md text-sm font-medium">Features</Link>
              <Link href="#testimonials" className="text-gray-700 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 px-3 py-2 rounded-md text-sm font-medium">Testimonials</Link>
              <Link href="#contact" className="text-gray-700 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 px-3 py-2 rounded-md text-sm font-medium">Contact</Link>
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="text-gray-700 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 p-2 rounded-md"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <button onClick={handleLoginClick} className="bg-orange-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-orange-600 transition-colors shadow-md hover:shadow-lg transform hover:-translate-y-0.5">Login</button>
              <button onClick={handleSignupClick} className="bg-gold-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gold-600 transition-colors shadow-md hover:shadow-lg transform hover:-translate-y-0.5">Signup</button>
            </div>
            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-orange-500"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link href="#features" className="text-gray-700 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 block px-3 py-2 rounded-md text-base font-medium">Features</Link>
              <Link href="#testimonials" className="text-gray-700 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 block px-3 py-2 rounded-md text-base font-medium">Testimonials</Link>
              <Link href="#contact" className="text-gray-700 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 block px-3 py-2 rounded-md text-base font-medium">Contact</Link>
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="text-gray-700 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 block px-3 py-2 rounded-md text-base font-medium w-full text-left"
              >
                {theme === "dark" ? "Light Mode" : "Dark Mode"}
              </button>
              <button onClick={handleLoginClick} className="bg-orange-500 text-white block w-full px-3 py-2 rounded-md text-base font-medium mt-4 hover:bg-orange-600 transition-colors shadow-md hover:shadow-lg transform hover:-translate-y-0.5">Login</button>
              <button onClick={handleSignupClick} className="bg-gold-500 text-white block w-full px-3 py-2 rounded-md text-base font-medium mt-2 hover:bg-gold-600 transition-colors shadow-md hover:shadow-lg transform hover:-translate-y-0.5">Signup</button>
            </div>
          </div>
        )}
      </nav>
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)}
        onSwitchToSignup={() => {
          setIsLoginModalOpen(false)
          setIsSignupModalOpen(true)
        }}
      />
      <SignupModal 
        isOpen={isSignupModalOpen} 
        onClose={() => setIsSignupModalOpen(false)}
        onSwitchToLogin={() => {
          setIsSignupModalOpen(false)
          setIsLoginModalOpen(true)
        }}
      />
    </>
  )
}