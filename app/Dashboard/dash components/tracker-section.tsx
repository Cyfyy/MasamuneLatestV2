import { useState } from "react";
import { Button } from "@/app/Dashboard/dash components/ui/button";
import { Input } from "@/app/Dashboard/dash components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/Dashboard/dash components/ui/table";
import { Pencil, Trash2, Plus, MoreHorizontal, Search } from "lucide-react";
import { useTheme } from "next-themes";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { FaArrowUp, FaArrowDown, FaEquals } from 'react-icons/fa'; // Import the Total icon here

type StatKey = 'manager' | 'scholar' | 'total' | 'todaySLP' | 'yesterdaySLP' | 'totalScholars';

// Update logo type to allow string or JSX.Element
type Stat = {
  label: string;
  value: number;
  isIncreasing: boolean;
  logo: string | JSX.Element; // Allow both string and JSX.Element
  logoWidth: number;
  logoHeight: number;
};

export function TrackerSection() {
  const [scholars, setScholars] = useState([
    { id: 1, name: "Alice", axieId: "AX123", managerShare: 30, scholarShare: 70 },
    { id: 2, name: "Bob", axieId: "AX124", managerShare: 40, scholarShare: 60 },
  ]);

  const stats: Record<StatKey, Stat> = {
    manager: { label: "Manager AXS", value: 56687, isIncreasing: true, logo: "/images/AXS-logo.png", logoWidth: 50 , logoHeight: 50 },
    scholar: { label: "Manager SLP", value: 118000, isIncreasing: false, logo: "/images/SLP-logo.png", logoWidth: 42 , logoHeight: 42 },
    total: { label: "Total", value: 200000, isIncreasing: true, logo: <FaEquals className="w-8 h-8 text-blue-500" />, logoWidth: 60, logoHeight: 60 }, // Use the Total icon here
    todaySLP: { label: "Scholar AXS", value: 10000, isIncreasing: true, logo: "/images/AXS-logo.png", logoWidth: 50, logoHeight: 50 },
    yesterdaySLP: { label: "Scholar SLP", value: 11000, isIncreasing: false, logo: "/images/SLP-logo.png", logoWidth: 42, logoHeight: 42 },
    totalScholars: { label: "Total", value: 3, isIncreasing: true, logo: <FaEquals className="w-8 h-8 text-blue-500" />, logoWidth: 60, logoHeight: 60 },
  };

  const [showModal, setShowModal] = useState(false);
  const [newScholar, setNewScholar] = useState({
    name: "",
    axieId: "",
    managerShare: 0,
    scholarShare: 100,
  });

  const { theme } = useTheme();

  const addScholar = () => {
    if (newScholar.name && newScholar.axieId) {
      setScholars([...scholars, { ...newScholar, id: scholars.length + 1 }]);
      setNewScholar({ name: "", axieId: "", managerShare: 0, scholarShare: 100 });
      setShowModal(false);
    }
  };

  const deleteScholar = (id: number) => {
    setScholars(scholars.filter((scholar) => scholar.id !== id));
  };

  const handleManagerShareChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const managerShare = Number(e.target.value);
    if (!isNaN(managerShare)) {
      setNewScholar({
        ...newScholar,
        managerShare,
        scholarShare: (100 - managerShare),
      });
    }
  };

  const handleNumberInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      handleManagerShareChange(e);
    }
  };

  const exportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," + scholars.map((s) => `${s.name}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    window.open(encodedUri);
  };

  return (
    <div className={`space-y-4 ${theme === "dark" ? "text-white" : "text-black"}`}>
      <div className="flex justify-between items-center bg-blue-200 p-8 rounded-lg">
        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-8 w-full">
          {/* Loop through stats using the defined StatKey type */}
          {(Object.keys(stats) as StatKey[]).map((key) => (
            <div key={key} className="flex flex-col bg-gray-800 text-white p-4 rounded-2xl">
              {/* Label */}
              <span className="text-left text-sm">{stats[key].label}</span>
              
              {/* Value, Icon, and Logo */}
              <div className="flex justify-between items-center mt-2">
                <div className="flex items-center space-x-2">
                  {/* Value */}
                  <span className="text-2xl font-bold">{stats[key].value.toLocaleString()}</span>

                  {/* Conditional rendering of the icon */}
                  {stats[key].isIncreasing ? (
                    <FaArrowUp className="text-green-500" />
                  ) : (
                    <FaArrowDown className="text-red-500" />
                  )}
                </div>

                {/* Add logo or icon to the far right */}
                <div className="flex items-center" style={{ width: `${stats[key].logoWidth}px`, height: `${stats[key].logoHeight}px`, marginLeft: 'auto' }}>
                  {typeof stats[key].logo === 'string' ? (
                    <img
                      src={stats[key].logo}
                      alt={`${stats[key].label} logo`}
                      className="object-contain"
                    />
                  ) : (
                    stats[key].logo // Render the Total icon directly
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* End of Stats Section */}

      <div className="flex justify-between items-center">
        <div className="relative w-1/3">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4" />
          </span>
          <Input
            placeholder="Scholar Name"
            value={newScholar.name}
            onChange={(e) => setNewScholar({ ...newScholar, name: e.target.value })}
            className={`pl-10 ${theme === "dark" ? "bg-gray-700 text-white" : "bg-white text-black"} border-2 border-gray-300 focus:border-orange-500 focus:ring-orange-500 rounded-lg`}
          />
        </div>

        <div className="flex items-center space-x-2">
          <div className="relative group">
            <Button onClick={() => setShowModal(true)} className="flex items-center">
              <Plus className="h-5 w-5" />
              <span className="absolute left-1/2 -top-4 transform -translate-x-1/2 bg-gray-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                Add Scholar
              </span>
            </Button>
          </div>

          <div className="relative group">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="mr-2 flex items-center">
                  <MoreHorizontal className="h-5 w-5" />
                  <span className="absolute left-1/2 -top-4 transform -translate-x-1/2 bg-gray-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    Options
                  </span>
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

      {/* Scholar List Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Scholar Name</TableHead>
            <TableHead>Axie ID</TableHead>
            <TableHead>Manager Share</TableHead>
            <TableHead>Scholar Share</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {scholars.map((scholar) => (
            <TableRow key={scholar.id}>
              <TableCell>{scholar.name}</TableCell>
              <TableCell>{scholar.axieId}</TableCell>
              <TableCell>
                <Input
                  type="number"
                  value={scholar.managerShare}
                  onChange={(e) => handleNumberInput(e)}
                  className={`bg-white dark:bg-gray-700 rounded-md`}
                />
              </TableCell>
              <TableCell>{scholar.scholarShare}</TableCell>
              <TableCell>
                <Button onClick={() => deleteScholar(scholar.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
