"use client"

import { useState } from "react"
import { Button } from "@/app/Dashboard/dash components/ui/button"
import { Input } from "@/app/Dashboard/dash components/ui/input"
import { Label } from "@/app/Dashboard/dash components/ui/label"
import { Copy } from "lucide-react"
import { useTheme } from "next-themes"

export function DonateModal() {
  const [copied, setCopied] = useState(false)
  const walletAddress = "ronin:9fa3927f639745b14f8195f2c93d1f3674460d9c"
  const { theme } = useTheme()

  const copyToClipboard = () => {
    navigator.clipboard.writeText(walletAddress)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={`space-y-4 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
      <h2 className="text-2xl font-bold">Donate</h2>
      <p>Support our project by donating to the following Ronin Wallet address:</p>
      <div className="flex space-x-2">
        <Input 
          value={walletAddress} 
          readOnly 
          className={theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-black'}
        />
        <Button onClick={copyToClipboard}>
          {copied ? "Copied!" : <Copy className="h-4 w-4" />}
        </Button>
      </div>
      <p className="text-sm text-muted-foreground">Thank you for your support!</p>
    </div>
  )
}