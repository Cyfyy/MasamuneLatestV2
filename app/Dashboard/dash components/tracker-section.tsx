import { useState } from "react";
import { Button } from "@/app/Dashboard/dash components/ui/button";
import { Input } from "@/app/Dashboard/dash components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/Dashboard/dash components/ui/table";
import { Pencil, Trash2, Plus, MoreHorizontal, Search } from "lucide-react";
import { useTheme } from "next-themes";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";

export function TrackerSection() {
  const [scholars, setScholars] = useState([
    { id: 1, name: "Alice", axieId: "AX123", managerShare: 30, scholarShare: 70 },
    { id: 2, name: "Bob", axieId: "AX124", managerShare: 40, scholarShare: 60 },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [newScholar, setNewScholar] = useState({
    name: "",
    axieId: "",
    managerShare: 0,  // Changed null to 0
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
        scholarShare: (100 - managerShare) as number, // Ensure scholarShare is treated as a number
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
              <span className="absolute left-1/2 -top-8 transform -translate-x-1/2 bg-gray-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                Add Scholar
              </span>
            </Button>
          </div>

          <div className="relative group">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="mr-2 flex items-center">
                  <MoreHorizontal className="h-5 w-5" />
                  <span className="absolute left-1/2 -top-8 transform -translate-x-1/2 bg-gray-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
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

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Axie ID</TableHead>
            <TableHead>Manager Share (%)</TableHead>
            <TableHead>Scholar Share (%)</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {scholars.map((scholar) => (
            <TableRow key={scholar.id}>
              <TableCell>{scholar.name}</TableCell>
              <TableCell>{scholar.axieId}</TableCell>
              <TableCell>{scholar.managerShare}</TableCell>
              <TableCell>{scholar.scholarShare}</TableCell>
              <TableCell>
                <Button variant="ghost" size="sm">
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => deleteScholar(scholar.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-1/2">
            <h2 className="text-lg font-bold mb-4 text-center">ADD SCHOLAR</h2>
            <form className="space-y-4">
              <div>
                <label className="block mb-1 text-sm font-semibold text-orange-500">Name</label>
                <Input
                  className="w-full border-2 border-gray-300 focus:border-orange-500 focus:ring-orange-500 rounded-lg"
                  placeholder="Name"
                  value={newScholar.name}
                  onChange={(e) => setNewScholar({ ...newScholar, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-semibold text-orange-500">Axie ID</label>
                <Input
                  className="w-full border-2 border-gray-300 focus:border-orange-500 focus:ring-orange-500 rounded-lg"
                  placeholder="Axie ID"
                  value={newScholar.axieId}
                  onChange={(e) => setNewScholar({ ...newScholar, axieId: e.target.value })}
                />
              </div>
              <div className="flex space-x-4">
                <div className="w-1/2">
                  <label className="block mb-1 text-sm font-semibold text-orange-500">Manager Share (%)</label>
                  <Input
                    type="text"
                    className="w-full border-2 border-gray-300 focus:border-orange-500 focus:ring-orange-500 rounded-lg"
                    placeholder="Manager Share (%)"
                    value={newScholar.managerShare ?? ''}  // This ensures no placeholder 0
                    onChange={handleNumberInput}
                  />
                </div>
                <div className="w-1/2">
                  <label className="block mb-1 text-sm font-semibold text-orange-500">Scholar Share (%)</label>
                  <Input
                    type="number"
                    readOnly
                    className="w-full bg-gray-600 border-1 border-gray-300 rounded-lg"
                    placeholder="Scholar Share (%)"
                    value={newScholar.scholarShare}
                  />
                </div>
              </div>
              <div className="flex justify-between space-x-4 mt-4">
                <Button variant="outline" onClick={() => setShowModal(false)} className="w-1/3">
                  Cancel
                </Button>
                <Button onClick={addScholar} className="w-1/3 bg-orange-500 hover:bg-orange-600 text-white">
                  Add
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
