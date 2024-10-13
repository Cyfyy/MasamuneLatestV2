import { Card, CardContent, CardHeader, CardTitle } from "@/app/Dashboard/dash components/ui/card"
import { Progress } from "@/app/Dashboard/dash components/ui/progress"
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts"

const scholarData = [
  { name: "New Scholars", value: 15, color: "#FF6384" },
  { name: "Deleted Scholars", value: 5, color: "#36A2EB" },
  { name: "Active Scholars", value: 80, color: "#FFCE56" },
]

const topScholars = [
  { name: "Alice", performance: 95 },
  { name: "Bob", performance: 92 },
  { name: "Charlie", performance: 88 },
]

export function DashboardOverview() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {scholarData.map((item, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{item.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{item.value}</div>
          </CardContent>
        </Card>
      ))}
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>Scholar Distribution</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={scholarData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {scholarData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>Top Scholars Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          {topScholars.map((scholar, index) => (
            <div key={index} className="mb-4">
              <div className="flex items-center justify-between">
                <div>{scholar.name}</div>
                <div>{scholar.performance}%</div>
              </div>
              <Progress value={scholar.performance} className="mt-2" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}