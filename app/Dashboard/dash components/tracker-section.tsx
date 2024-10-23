'use client';

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/app/Dashboard/dash components/ui/button"
import { Input } from "@/app/Dashboard/dash components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/Dashboard/dash components/ui/table"
import { Trash2, MoreHorizontal, Search } from "lucide-react"
import { useTheme } from "next-themes"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/app/Dashboard/dash components/ui/dropdown-menu"
import { FaArrowUp, FaArrowDown, FaEquals } from 'react-icons/fa'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/app/Dashboard/dash components/ui/dialog"
import { Label } from "@/app/Dashboard/dash components/ui/label"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/app/Dashboard/dash components/ui/sheet"

type StatKey = 'manager' | 'scholar' | 'total' | 'todaySLP' | 'yesterdaySLP' | 'totalScholars'

type Stat = {
  label: string
  value: number
  isIncreasing: boolean
  logo: string | JSX.Element
  logoWidth: number
  logoHeight: number
}

type Scholar = {
  id: number
  name: string
  axieId: string
  rank: string
  winrate: number
  axs: number
  slp: number
  managerShare: number
  scholarShare: number
}

type BattleLog = {
  gameData: {
    players: Array<{
      userID: string
      rank: string
    }>
    winner: number
  }
}

export default function TrackerSection() {
  const [scholars, setScholars] = useState<Scholar[]>([])
  const [selectedScholar, setSelectedScholar] = useState<Scholar | null>(null)
  const [battleLogs, setBattleLogs] = useState<BattleLog[]>([])
  const { theme } = useTheme()
  const [lastFetchTime, setLastFetchTime] = useState<number>(0)
  const [isOpen, setIsOpen] = useState(false)
  const [newScholar, setNewScholar] = useState<Omit<Scholar, 'id'>>({
    name: "",
    axieId: "",
    rank: "",
    winrate: 0,
    axs: 0,
    slp: 0,
    managerShare: 0,
    scholarShare: 100,
  })

  const stats: Record<StatKey, Stat> = {
    manager: { label: "Manager AXS", value: 56687, isIncreasing: true, logo: "/images/AXS-logo.png", logoWidth: 50, logoHeight: 50 },
    scholar: { label: "Manager SLP", value: 118000, isIncreasing: false, logo: "/images/SLP-logo.png", logoWidth: 42, logoHeight: 42 },
    total: { label: "Total", value: 200000, isIncreasing: true, logo: <FaEquals className="w-8 h-8 text-blue-500" />, logoWidth: 60, logoHeight: 60 },
    todaySLP: { label: "Scholar AXS", value: 10000, isIncreasing: true, logo: "/images/AXS-logo.png", logoWidth: 50, logoHeight: 50 },
    yesterdaySLP: { label: "Scholar SLP", value: 11000, isIncreasing: false, logo: "/images/SLP-logo.png", logoWidth: 42, logoHeight: 42 },
    totalScholars: { label: "Total Scholars", value: 5, isIncreasing: true, logo: <FaEquals className="w-8 h-8 text-blue-500" />, logoWidth: 60, logoHeight: 60 },
  }

  const fetchBattleLogs = useCallback(async (axieId: string) => {
    try {
      const response = await fetch('/api/battleLogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ axieId }),
      })

      if (!response.ok) {
        throw new Error('Error fetching battle logs')
      }

      const logs = await response.json()
      return logs._items
    } catch (error) {
      console.error('Error fetching battle logs', error)
      throw error
    }
  }, [])

  const updateScholarRank = useCallback((scholar: Scholar, logs: BattleLog[]) => {
    if (logs.length > 0) {
      const latestLog = logs[0]
      const playerIndex = latestLog.gameData.players.findIndex(player => player.userID === scholar.axieId)
      if (playerIndex !== -1) {
        const updatedScholar = { ...scholar, rank: latestLog.gameData.players[playerIndex].rank }
        setScholars(prevScholars => prevScholars.map(s => s.id === scholar.id ? updatedScholar : s))
      }
    }
  }, [])

  useEffect(() => {
    const fetchAllBattleLogs = async () => {
      const currentTime = Date.now()
      if (currentTime - lastFetchTime < 20000) {
        return; // Don't fetch if less than 20 seconds have passed
      }

      for (const scholar of scholars) {
        try {
          const logs = await fetchBattleLogs(scholar.axieId)
          updateScholarRank(scholar, logs)
        } catch (error) {
          console.error(`Error fetching battle logs for ${scholar.name}`, error)
        }
      }

      setLastFetchTime(currentTime)
    }

    fetchAllBattleLogs()
    const interval = setInterval(fetchAllBattleLogs, 20000)

    return () => clearInterval(interval)
  }, [scholars, fetchBattleLogs, updateScholarRank, lastFetchTime])

  const addScholar = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (newScholar.name && newScholar.axieId) {
      const newScholarWithId = { ...newScholar, id: scholars.length + 1 }
      setScholars(prevScholars => [...prevScholars, newScholarWithId])
  
      try {
        const logs = await fetchBattleLogs(newScholar.axieId)
        updateScholarRank(newScholarWithId, logs)
      } catch (error) {
        console.error("Error fetching battle logs", error)
      }
  
      setNewScholar({
        name: "",
        axieId: "",
        rank: "",
        winrate: 0,
        axs: 0,
        slp: 0,
        managerShare: 0,
        scholarShare: 100,
      })
      
      setIsOpen(false)
    }
  }

  const deleteScholar = (id: number) => {
    setScholars(scholars.filter((scholar) => scholar.id !== id))
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (name === "managerShare") {
      const cleanValue = value.replace(/^0+/, '')
      const managerShare = Math.min(100, Math.max(0, parseInt(cleanValue) || 0))
      setNewScholar({
        ...newScholar,
        managerShare,
        scholarShare: 100 - managerShare,
      })
    } else {
      setNewScholar({ ...newScholar, [name]: value })
    }
  }

  const handleManagerShareChange = (e: React.ChangeEvent<HTMLInputElement>, id: number) => {
    const value = e.target.value
    const cleanValue = value.replace(/^0+/, '')
    const managerShare = Math.min(100, Math.max(0, parseInt(cleanValue) || 0))
    setScholars(scholars.map(scholar =>
      scholar.id === id ? { ...scholar, managerShare, scholarShare: 100 - managerShare } : scholar
    ))
  }

  const exportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," +
      scholars.map(s => `${s.name},${s.axieId},${s.rank},${s.winrate},${s.axs},${s.slp},${s.managerShare},${s.scholarShare}`).join("\n")
    const encodedUri = encodeURI(csvContent)
    window.open(encodedUri)
  }

  const openScholarDrawer = async (scholar: Scholar) => {
    setSelectedScholar(scholar)
    try {
      const logs = await fetchBattleLogs(scholar.axieId)
      setBattleLogs(logs)
    } catch (error) {
      console.error("Error fetching battle logs", error)
    }
  }

  return (
    <div className={`${theme === "dark" ? "text-white" : "text-black"}`}>
      {/* Stats section */}
      <section className="flex justify-between items-center bg-blue-200 p-8 rounded-lg">
        <div className="grid grid-cols-3 gap-8 w-full">
          {(Object.keys(stats) as StatKey[]).map((key) => (
            <div key={key} className="flex flex-col bg-gray-800 text-white p-4 rounded-2xl">
              <span className="text-left text-sm">{stats[key].label}</span>
              <div className="flex justify-between items-center mt-2">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold">{stats[key].value.toLocaleString()}</span>
                  {stats[key].isIncreasing ? (
                    <FaArrowUp className="text-green-500" />
                  ) : (
                    <FaArrowDown className="text-red-500" />
                  )}
                </div>
                <div className="flex items-center" style={{ width: `${stats[key].logoWidth}px`, height: `${stats[key].logoHeight}px`, marginLeft: 'auto' }}>
                  {typeof stats[key].logo === 'string' ? (
                    <img
                      src={stats[key].logo}
                      alt={`${stats[key].label} logo`}
                      className="object-contain"
                    />
                  ) : (
                    stats[key].logo
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Scholars table section */}
      <section className="w-full mt-8">
        <div className="flex justify-between items-center px-9 py-4">
          <div className="relative w-1/3">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4" />
            </span>
            <Input
              placeholder="Scholar Name"
              className={`pl-10 ${theme === "dark" ? "bg-gray-700 text-white" : "bg-gray-200 text-black"} border-2 border-gray-300 focus:border-orange-500 focus:ring-orange-500 rounded-xl`}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5 mr-2"
                  >
                    <path d="M5 12h14" />
                    <path d="M12 5v14" />
                  </svg>
                  Add Scholar
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle className="text-center">Add New Scholar</DialogTitle>
                </DialogHeader>
                <form onSubmit={addScholar} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={newScholar.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="axieId">Axie ID</Label>
                    <Input
                      id="axieId"
                      name="axieId"
                      value={newScholar.axieId}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="managerShare">Manager Share (%)</Label>
                    <Input
                      id="managerShare"
                      name="managerShare"
                      type="number"
                      min="0"
                      max="100"
                      value={newScholar.managerShare || ''}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="scholarShare">Scholar Share (%)</Label>
                    <Input
                      id="scholarShare"
                      name="scholarShare"
                      value={newScholar.scholarShare}
                      readOnly
                      disabled
                    />
                  </div>
                  <Button type="submit" className="w-full">Add Scholar</Button>
                </form>
              </DialogContent>
            </Dialog>

            <div className="relative group">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center">
                    <MoreHorizontal className="h-5 w-5 mr-2" />
                    Options
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white dark:bg-gray-800 rounded-md shadow-md p-2">
                  <DropdownMenuItem className="hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md" onSelect={exportCSV}>
                    Export
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-base">Scholar Name</TableHead>
              <TableHead  className="text-base">Axie ID</TableHead>
              <TableHead className="text-base">Rank</TableHead>
              <TableHead className="text-base">Winrate</TableHead>
              <TableHead className="text-base">AXS</TableHead>
              <TableHead className="text-base">SLP</TableHead>
              <TableHead className="text-base">Manager Share</TableHead>
              <TableHead className="text-base">Scholar Share</TableHead>
              <TableHead className="text-base">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {scholars.map((scholar) => (
              <TableRow key={scholar.id}>
                <TableCell>
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="link" onClick={() => openScholarDrawer(scholar)}>{scholar.name}</Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-[400px] sm:w-[540px]">
                      <SheetHeader>
                        <SheetTitle>{selectedScholar?.name} Details</SheetTitle>
                        <SheetDescription>Battle logs and performance details</SheetDescription>
                      </SheetHeader>
                      <div className="py-4 overflow-y-auto flex-1">
                        {battleLogs.map((log, index) => (
                          <div key={index} className="mb-4 p-4 border rounded">
                            <p>Battle Outcome: {log.gameData.winner === 0 ? 'Win' : 'Loss'}</p>
                            <p>Rank: {log.gameData.players[0].rank}</p>
                          </div>
                        ))}
                      </div>
                    </SheetContent>
                  </Sheet>
                </TableCell>
                <TableCell>{scholar.axieId}</TableCell>
                <TableCell>{scholar.rank}</TableCell>
                <TableCell>{scholar.winrate}%</TableCell>
                <TableCell>{scholar.axs}</TableCell>
                <TableCell>{scholar.slp}</TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={scholar.managerShare || ''}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleManagerShareChange(e, scholar.id)}
                    className={`bg-white dark:bg-gray-700 rounded-md w-20`}
                  />
                </TableCell>
                <TableCell>{scholar.scholarShare}%</TableCell>
                <TableCell>
                  <Button onClick={() => deleteScholar(scholar.id)} variant="ghost">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>
    </div>
  )
}