"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/Dashboard/dash components/ui/table"
import { useTheme } from "next-themes"

const logs = [
  { id: 1, action: "User Login", user: "John Doe", timestamp: "2023-06-10 10:30:00" },
  { id: 2, action: "Scholar Added", user: "John Doe", timestamp: "2023-06-10 11:15:00" },
  { id: 3, action: "Donation Received", user: "Jane Smith", timestamp: "2023-06-10 14:45:00" },
  { id: 4, action: "User Logout", user: "John Doe", timestamp: "2023-06-10 17:00:00" },
]

export function LogsSection() {
  const { theme } = useTheme()

  return (
    <div className={`space-y-4 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
      <h2 className="text-2xl font-bold">Activity Logs</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Action</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Timestamp</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.map((log) => (
            <TableRow key={log.id}>
              <TableCell>{log.action}</TableCell>
              <TableCell>{log.user}</TableCell>
              <TableCell>{log.timestamp}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}