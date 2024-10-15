import { useState } from "react";
import { Button } from "@/app/Dashboard/dash components/ui/button";
import { Input } from "@/app/Dashboard/dash components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/Dashboard/dash components/ui/table";
import { Pencil, Trash2, Plus, MoreHorizontal, Search } from "lucide-react";
import { useTheme } from "next-themes";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/app/Dashboard/dash components/ui/dropdown-menu";
import { FaArrowUp, FaArrowDown, FaEquals } from 'react-icons/fa';

type StatKey = 'manager' | 'scholar' | 'total' | 'todaySLP' | 'yesterdaySLP' | 'totalScholars';

type Stat = {
  label: string;
  value: number;
  isIncreasing: boolean;
  logo: string | JSX.Element;
  logoWidth: number;
  logoHeight: number;
};

type Scholar = {
  id: number;
  name: string;
  rank: string;
  winrate: number;
  axs: number;
  slp: number;
  managerShare: number;
  scholarShare: number;
};

export function TrackerSection() {
  const [scholars, setScholars] = useState<Scholar[]>([
    { id: 1, name: "Alice", rank: "Chicks", winrate: 55, axs: 10, slp: 1000, managerShare: 30, scholarShare: 70 },
    { id: 2, name: "Bob", rank: "Eggs", winrate: 60, axs: 15, slp: 1200, managerShare: 40, scholarShare: 60 },
    { id: 3, name: "Charlie", rank: "Fledgling", winrate: 58, axs: 12, slp: 1100, managerShare: 35, scholarShare: 65 },
    { id: 4, name: "David", rank: "Bird", winrate: 62, axs: 18, slp: 1300, managerShare: 45, scholarShare: 55 },
    { id: 5, name: "Eve", rank: "Fowl", winrate: 57, axs: 11, slp: 1050, managerShare: 33, scholarShare: 67 },
  ]);

  const stats: Record<StatKey, Stat> = {
    manager: { label: "Manager AXS", value: 56687, isIncreasing: true, logo: "/images/AXS-logo.png", logoWidth: 50, logoHeight: 50 },
    scholar: { label: "Manager SLP", value: 118000, isIncreasing: false, logo: "/images/SLP-logo.png", logoWidth: 42, logoHeight: 42 },
    total: { label: "Total", value: 200000, isIncreasing: true, logo: <FaEquals className="w-8 h-8 text-blue-500" />, logoWidth: 60, logoHeight: 60 },
    todaySLP: { label: "Scholar AXS", value: 10000, isIncreasing: true, logo: "/images/AXS-logo.png", logoWidth: 50, logoHeight: 50 },
    yesterdaySLP: { label: "Scholar SLP", value: 11000, isIncreasing: false, logo: "/images/SLP-logo.png", logoWidth: 42, logoHeight: 42 },
    totalScholars: { label: "Total Scholars", value: 5, isIncreasing: true, logo: <FaEquals className="w-8 h-8 text-blue-500" />, logoWidth: 60, logoHeight: 60 },
  };

  const [showModal, setShowModal] = useState(false);
  const [newScholar, setNewScholar] = useState<Omit<Scholar, 'id'>>({
    name: "",
    rank: "",
    winrate: 0,
    axs: 0,
    slp: 0,
    managerShare: 0,
    scholarShare: 100,
  });

  const { theme } = useTheme();

  const addScholar = () => {
    if (newScholar.name && newScholar.rank) {
      setScholars([...scholars, { ...newScholar, id: scholars.length + 1 }]);
      setNewScholar({ name: "", rank: "", winrate: 0, axs: 0, slp: 0, managerShare: 0, scholarShare: 100 });
      setShowModal(false);
    }
  };

  const deleteScholar = (id: number) => {
    setScholars(scholars.filter((scholar) => scholar.id !== id));
  };

  const handleManagerShareChange = (e: React.ChangeEvent<HTMLInputElement>, id: number) => {
    const managerShare = Number(e.target.value);
    if (!isNaN(managerShare) && managerShare >= 0 && managerShare <= 100) {
      setScholars(scholars.map(scholar => 
        scholar.id === id ? { ...scholar, managerShare, scholarShare: 100 - managerShare } : scholar
      ));
    }
  };

  const exportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      scholars.map(s => `${s.name},${s.rank},${s.winrate},${s.axs},${s.slp},${s.managerShare},${s.scholarShare}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    window.open(encodedUri);
  };

  return (
    <div className={`${theme === "dark" ? "text-white" : "text-black"}`}>
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

      <section className="w-full mt-8">
        <div className="flex justify-between items-center px-9 py-4">
          <div className="relative w-1/3">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4" />
            </span>
            <Input
              placeholder="Scholar Name"
              value={newScholar.name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewScholar({ ...newScholar, name: e.target.value })}
              className={`pl-10 ${theme === "dark" ? "bg-gray-700 text-white" : "bg-gray-200 text-black"} border-2 border-gray-300 focus:border-orange-500 focus:ring-orange-500 rounded-xl`}
            />
          </div>

          <div className="flex items-center space-x-2">
            <div className="relative group">
              <Button onClick={() => setShowModal(true)} className="flex items-center">
                <Plus className="h-5 w-5 mr-2" />
                Add Scholar
              </Button>
            </div>

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
                <TableCell>{scholar.name}</TableCell>
                <TableCell>{scholar.rank}</TableCell>
                <TableCell>{scholar.winrate}%</TableCell>
                <TableCell>{scholar.axs}</TableCell>
                <TableCell>{scholar.slp}</TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={scholar.managerShare}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleManagerShareChange(e, scholar.id)} // Updated to pass the event
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
  );
}
