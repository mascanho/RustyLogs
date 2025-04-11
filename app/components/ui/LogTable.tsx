"use client";

import { useState, useRef } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronDown,
  Search,
  Filter,
  Download,
  Eye,
  CalendarIcon,
  X,
  FileDown,
  FileText,
  Info,
} from "lucide-react";
import type { LogEntry } from "@/lib/types";

interface LogTableProps {
  data: LogEntry[];
}

type FilterState = {
  statusCode: string;
  method: string;
  fileType: string;
  botTraffic: string;
  dateRange: {
    from: Date | undefined;
    to: Date | undefined;
  };
};

export function LogTable({ data }: LogTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<keyof LogEntry>("timestamp");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [selectedEntry, setSelectedEntry] = useState<LogEntry | null>(null);
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>(
    {
      timestamp: true,
      ip: true,
      method: true,
      path: true,
      statusCode: true,
      size: true,
      userAgent: false,
      referer: false,
      fileType: true,
    },
  );

  // Advanced filtering
  const [filters, setFilters] = useState<FilterState>({
    statusCode: "all",
    method: "all",
    fileType: "all",
    botTraffic: "all",
    dateRange: {
      from: undefined,
      to: undefined,
    },
  });

  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  // Export functionality
  const csvLinkRef = useRef<HTMLAnchorElement>(null);
  const jsonLinkRef = useRef<HTMLAnchorElement>(null);

  // Get unique values for filter dropdowns
  const uniqueMethods = Array.from(new Set(data.map((entry) => entry.method)));
  const uniqueFileTypes = Array.from(
    new Set(data.map((entry) => entry.fileType)),
  );

  // Apply filters to data
  const applyFilters = (entry: LogEntry) => {
    // Status code filter
    if (filters.statusCode !== "all") {
      const statusRange = filters.statusCode;
      const statusCode = entry.statusCode;

      if (statusRange === "2xx" && (statusCode < 200 || statusCode >= 300))
        return false;
      if (statusRange === "3xx" && (statusCode < 300 || statusCode >= 400))
        return false;
      if (statusRange === "4xx" && (statusCode < 400 || statusCode >= 500))
        return false;
      if (statusRange === "5xx" && (statusCode < 500 || statusCode >= 600))
        return false;
    }

    // Method filter
    if (filters.method !== "all" && entry.method !== filters.method)
      return false;

    // File type filter
    if (filters.fileType !== "all" && entry.fileType !== filters.fileType)
      return false;

    // Bot traffic filter
    if (filters.botTraffic !== "all") {
      const userAgent = entry.userAgent.toLowerCase();
      const isBot =
        userAgent.includes("bot") ||
        userAgent.includes("crawler") ||
        userAgent.includes("spider");

      if (filters.botTraffic === "bots" && !isBot) return false;
      if (filters.botTraffic === "humans" && isBot) return false;
    }

    // Date range filter
    if (filters.dateRange.from && entry.timestamp < filters.dateRange.from)
      return false;
    if (filters.dateRange.to) {
      const endDate = new Date(filters.dateRange.to);
      endDate.setHours(23, 59, 59, 999); // End of day
      if (entry.timestamp > endDate) return false;
    }

    return true;
  };

  // Filter data based on search term and filters
  const filteredData = data.filter((entry) => {
    // First apply search term
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      searchTerm === "" ||
      entry.ip.toLowerCase().includes(searchLower) ||
      entry.path.toLowerCase().includes(searchLower) ||
      entry.method.toLowerCase().includes(searchLower) ||
      entry.statusCode.toString().includes(searchLower) ||
      entry.userAgent.toLowerCase().includes(searchLower) ||
      entry.fileType.toLowerCase().includes(searchLower);

    // Then apply filters
    return matchesSearch && applyFilters(entry);
  });

  // Sort data
  const sortedData = [...filteredData].sort((a, b) => {
    if (sortField === "timestamp") {
      return sortDirection === "asc"
        ? a.timestamp.getTime() - b.timestamp.getTime()
        : b.timestamp.getTime() - a.timestamp.getTime();
    }

    if (sortField === "statusCode" || sortField === "size") {
      return sortDirection === "asc"
        ? (a[sortField] as number) - (b[sortField] as number)
        : (b[sortField] as number) - (a[sortField] as number);
    }

    const aValue = String(a[sortField]).toLowerCase();
    const bValue = String(b[sortField]).toLowerCase();

    return sortDirection === "asc"
      ? aValue.localeCompare(bValue)
      : bValue.localeCompare(aValue);
  });

  // Pagination
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const totalPages = Math.ceil(sortedData.length / rowsPerPage);
  const paginatedData = sortedData.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage,
  );

  const handleSort = (field: keyof LogEntry) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Update active filters display
  const updateActiveFilters = () => {
    const active: string[] = [];

    if (filters.statusCode !== "all")
      active.push(`Status: ${filters.statusCode}`);
    if (filters.method !== "all") active.push(`Method: ${filters.method}`);
    if (filters.fileType !== "all") active.push(`Type: ${filters.fileType}`);
    if (filters.botTraffic !== "all")
      active.push(`Traffic: ${filters.botTraffic}`);
    if (filters.dateRange.from) {
      const dateStr = filters.dateRange.to
        ? `${filters.dateRange.from.toLocaleDateString()} - ${filters.dateRange.to.toLocaleDateString()}`
        : `From ${filters.dateRange.from.toLocaleDateString()}`;
      active.push(`Date: ${dateStr}`);
    }

    setActiveFilters(active);
  };

  // Handle filter changes
  const applyFilterChanges = (newFilters: Partial<FilterState>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    setPage(1); // Reset to first page when filters change

    // Update active filters display
    setActiveFilters([]);
    setTimeout(updateActiveFilters, 0);
  };

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      statusCode: "all",
      method: "all",
      fileType: "all",
      botTraffic: "all",
      dateRange: {
        from: undefined,
        to: undefined,
      },
    });
    setActiveFilters([]);
    setPage(1);
  };

  // Export functions
  const exportToCSV = () => {
    const headers = [
      "Timestamp",
      "IP",
      "Method",
      "Path",
      "Status",
      "Size",
      "User Agent",
      "Referer",
      "File Type",
    ];

    const csvContent = [
      headers.join(","),
      ...sortedData.map((entry) =>
        [
          entry.timestamp.toISOString(),
          entry.ip,
          entry.method,
          `"${entry.path.replace(/"/g, '""')}"`, // Escape quotes in CSV
          entry.statusCode,
          entry.size,
          `"${entry.userAgent.replace(/"/g, '""')}"`,
          `"${entry.referer.replace(/"/g, '""')}"`,
          entry.fileType,
        ].join(","),
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    if (csvLinkRef.current) {
      csvLinkRef.current.href = url;
      csvLinkRef.current.download = `log_data_${new Date().toISOString().slice(0, 10)}.csv`;
      csvLinkRef.current.click();
    }

    URL.revokeObjectURL(url);
  };

  const exportToJSON = () => {
    const jsonContent = JSON.stringify(sortedData, null, 2);
    const blob = new Blob([jsonContent], {
      type: "application/json;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);

    if (jsonLinkRef.current) {
      jsonLinkRef.current.href = url;
      jsonLinkRef.current.download = `log_data_${new Date().toISOString().slice(0, 10)}.json`;
      jsonLinkRef.current.click();
    }

    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4 px-2 mt-3 min-h-2 h-full">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search logs..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1); // Reset to first page on search
            }}
          />
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4" />
            Filters
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
              >
                <Download className="h-4 w-4" />
                Export
                <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={exportToCSV}>
                <FileText className="h-4 w-4 mr-2" />
                Export as CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={exportToJSON}>
                <FileDown className="h-4 w-4 mr-2" />
                Export as JSON
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
              >
                <Eye className="h-4 w-4" />
                Columns
                <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuCheckboxItem
                checked={visibleColumns.timestamp}
                onCheckedChange={(checked) =>
                  setVisibleColumns({ ...visibleColumns, timestamp: !!checked })
                }
              >
                Timestamp
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={visibleColumns.ip}
                onCheckedChange={(checked) =>
                  setVisibleColumns({ ...visibleColumns, ip: !!checked })
                }
              >
                IP Address
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={visibleColumns.method}
                onCheckedChange={(checked) =>
                  setVisibleColumns({ ...visibleColumns, method: !!checked })
                }
              >
                Method
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={visibleColumns.path}
                onCheckedChange={(checked) =>
                  setVisibleColumns({ ...visibleColumns, path: !!checked })
                }
              >
                Path
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={visibleColumns.statusCode}
                onCheckedChange={(checked) =>
                  setVisibleColumns({
                    ...visibleColumns,
                    statusCode: !!checked,
                  })
                }
              >
                Status Code
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={visibleColumns.size}
                onCheckedChange={(checked) =>
                  setVisibleColumns({ ...visibleColumns, size: !!checked })
                }
              >
                Size
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={visibleColumns.userAgent}
                onCheckedChange={(checked) =>
                  setVisibleColumns({ ...visibleColumns, userAgent: !!checked })
                }
              >
                User Agent
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={visibleColumns.referer}
                onCheckedChange={(checked) =>
                  setVisibleColumns({ ...visibleColumns, referer: !!checked })
                }
              >
                Referer
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={visibleColumns.fileType}
                onCheckedChange={(checked) =>
                  setVisibleColumns({ ...visibleColumns, fileType: !!checked })
                }
              >
                File Type
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Active filters display */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {activeFilters.map((filter, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="flex items-center gap-1"
            >
              {filter}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => resetFilters()}
              />
            </Badge>
          ))}
          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            className="h-6 px-2 text-xs"
          >
            Clear all
          </Button>
        </div>
      )}

      {/* Advanced filters panel */}
      {showFilters && (
        <Card className="mb-4">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Status Code</label>
                <Select
                  value={filters.statusCode}
                  onValueChange={(value) =>
                    applyFilterChanges({ statusCode: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Status Codes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status Codes</SelectItem>
                    <SelectItem value="2xx">Success (2xx)</SelectItem>
                    <SelectItem value="3xx">Redirection (3xx)</SelectItem>
                    <SelectItem value="4xx">Client Error (4xx)</SelectItem>
                    <SelectItem value="5xx">Server Error (5xx)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Method</label>
                <Select
                  value={filters.method}
                  onValueChange={(value) =>
                    applyFilterChanges({ method: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Methods" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Methods</SelectItem>
                    {uniqueMethods.map((method) => (
                      <SelectItem key={method} value={method}>
                        {method}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">File Type</label>
                <Select
                  value={filters.fileType}
                  onValueChange={(value) =>
                    applyFilterChanges({ fileType: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All File Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All File Types</SelectItem>
                    {uniqueFileTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Traffic Type</label>
                <Select
                  value={filters.botTraffic}
                  onValueChange={(value) =>
                    applyFilterChanges({ botTraffic: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Traffic" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Traffic</SelectItem>
                    <SelectItem value="humans">Human Traffic</SelectItem>
                    <SelectItem value="bots">Bot Traffic</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium">Date Range</label>
                <div className="flex items-center gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1"
                      >
                        <CalendarIcon className="h-4 w-4" />
                        {filters.dateRange.from
                          ? filters.dateRange.from.toLocaleDateString()
                          : "Start Date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={filters.dateRange.from}
                        onSelect={(date) =>
                          applyFilterChanges({
                            dateRange: { ...filters.dateRange, from: date },
                          })
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>

                  <span>to</span>

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1"
                      >
                        <CalendarIcon className="h-4 w-4" />
                        {filters.dateRange.to
                          ? filters.dateRange.to.toLocaleDateString()
                          : "End Date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={filters.dateRange.to}
                        onSelect={(date) =>
                          applyFilterChanges({
                            dateRange: { ...filters.dateRange, to: date },
                          })
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>

                  {(filters.dateRange.from || filters.dateRange.to) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        applyFilterChanges({
                          dateRange: { from: undefined, to: undefined },
                        })
                      }
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {visibleColumns.timestamp && (
                <TableHead
                  className="w-[180px] cursor-pointer"
                  onClick={() => handleSort("timestamp")}
                >
                  Timestamp{" "}
                  {sortField === "timestamp" &&
                    (sortDirection === "asc" ? "↑" : "↓")}
                </TableHead>
              )}
              {visibleColumns.ip && (
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort("ip")}
                >
                  IP Address{" "}
                  {sortField === "ip" && (sortDirection === "asc" ? "↑" : "↓")}
                </TableHead>
              )}
              {visibleColumns.method && (
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort("method")}
                >
                  Method{" "}
                  {sortField === "method" &&
                    (sortDirection === "asc" ? "↑" : "↓")}
                </TableHead>
              )}
              {visibleColumns.path && (
                <TableHead
                  className="max-w-[200px] cursor-pointer"
                  onClick={() => handleSort("path")}
                >
                  Path{" "}
                  {sortField === "path" &&
                    (sortDirection === "asc" ? "↑" : "↓")}
                </TableHead>
              )}
              {visibleColumns.statusCode && (
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort("statusCode")}
                >
                  Status{" "}
                  {sortField === "statusCode" &&
                    (sortDirection === "asc" ? "↑" : "↓")}
                </TableHead>
              )}
              {visibleColumns.size && (
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort("size")}
                >
                  Size{" "}
                  {sortField === "size" &&
                    (sortDirection === "asc" ? "↑" : "↓")}
                </TableHead>
              )}
              {visibleColumns.userAgent && (
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort("userAgent")}
                >
                  User Agent{" "}
                  {sortField === "userAgent" &&
                    (sortDirection === "asc" ? "↑" : "↓")}
                </TableHead>
              )}
              {visibleColumns.referer && (
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort("referer")}
                >
                  Referer{" "}
                  {sortField === "referer" &&
                    (sortDirection === "asc" ? "↑" : "↓")}
                </TableHead>
              )}
              {visibleColumns.fileType && (
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort("fileType")}
                >
                  File Type{" "}
                  {sortField === "fileType" &&
                    (sortDirection === "asc" ? "↑" : "↓")}
                </TableHead>
              )}
              <TableHead className="w-[50px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map((entry, index) => (
                <TableRow
                  key={index}
                  className="cursor-pointer hover:bg-muted/50"
                >
                  {visibleColumns.timestamp && (
                    <TableCell className="font-mono text-xs">
                      {entry.timestamp.toLocaleString()}
                    </TableCell>
                  )}
                  {visibleColumns.ip && <TableCell>{entry.ip}</TableCell>}
                  {visibleColumns.method && (
                    <TableCell>{entry.method}</TableCell>
                  )}
                  {visibleColumns.path && (
                    <TableCell
                      className="max-w-[200px] truncate"
                      title={entry.path}
                    >
                      {entry.path}
                    </TableCell>
                  )}
                  {visibleColumns.statusCode && (
                    <TableCell>
                      <span
                        className={`inline-block px-2 py-1 text-xs rounded-full ${getStatusCodeColor(entry.statusCode)}`}
                      >
                        {entry.statusCode}
                      </span>
                    </TableCell>
                  )}
                  {visibleColumns.size && (
                    <TableCell>{formatBytes(entry.size)}</TableCell>
                  )}
                  {visibleColumns.userAgent && (
                    <TableCell
                      className="max-w-[200px] truncate"
                      title={entry.userAgent}
                    >
                      {entry.userAgent}
                    </TableCell>
                  )}
                  {visibleColumns.referer && (
                    <TableCell
                      className="max-w-[200px] truncate"
                      title={entry.referer}
                    >
                      {entry.referer || "-"}
                    </TableCell>
                  )}
                  {visibleColumns.fileType && (
                    <TableCell>{entry.fileType}</TableCell>
                  )}
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setSelectedEntry(entry)}
                        >
                          <Info className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl">
                        <DialogHeader>
                          <DialogTitle>Log Entry Details</DialogTitle>
                          <DialogDescription>
                            Detailed information about this log entry
                          </DialogDescription>
                        </DialogHeader>

                        {selectedEntry && (
                          <Tabs defaultValue="details">
                            <TabsList className="grid w-full grid-cols-2">
                              <TabsTrigger value="details">Details</TabsTrigger>
                              <TabsTrigger value="raw">Raw Data</TabsTrigger>
                            </TabsList>
                            <TabsContent
                              value="details"
                              className="space-y-4 pt-4"
                            >
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <h4 className="text-sm font-medium text-muted-foreground">
                                    Timestamp
                                  </h4>
                                  <p>
                                    {selectedEntry.timestamp.toLocaleString()}
                                  </p>
                                </div>
                                <div>
                                  <h4 className="text-sm font-medium text-muted-foreground">
                                    IP Address
                                  </h4>
                                  <p>{selectedEntry.ip}</p>
                                </div>
                                <div>
                                  <h4 className="text-sm font-medium text-muted-foreground">
                                    Method
                                  </h4>
                                  <p>{selectedEntry.method}</p>
                                </div>
                                <div>
                                  <h4 className="text-sm font-medium text-muted-foreground">
                                    Status Code
                                  </h4>
                                  <p>
                                    <span
                                      className={`inline-block px-2 py-1 text-xs rounded-full ${getStatusCodeColor(selectedEntry.statusCode)}`}
                                    >
                                      {selectedEntry.statusCode}
                                    </span>
                                  </p>
                                </div>
                                <div className="col-span-2">
                                  <h4 className="text-sm font-medium text-muted-foreground">
                                    Path
                                  </h4>
                                  <p className="break-all">
                                    {selectedEntry.path}
                                  </p>
                                </div>
                                <div>
                                  <h4 className="text-sm font-medium text-muted-foreground">
                                    File Type
                                  </h4>
                                  <p>{selectedEntry.fileType}</p>
                                </div>
                                <div>
                                  <h4 className="text-sm font-medium text-muted-foreground">
                                    Size
                                  </h4>
                                  <p>{formatBytes(selectedEntry.size)}</p>
                                </div>
                                <div className="col-span-2">
                                  <h4 className="text-sm font-medium text-muted-foreground">
                                    User Agent
                                  </h4>
                                  <p className="break-all">
                                    {selectedEntry.userAgent}
                                  </p>
                                </div>
                                <div className="col-span-2">
                                  <h4 className="text-sm font-medium text-muted-foreground">
                                    Referer
                                  </h4>
                                  <p className="break-all">
                                    {selectedEntry.referer || "-"}
                                  </p>
                                </div>
                              </div>
                            </TabsContent>
                            <TabsContent value="raw" className="pt-4">
                              <pre className="bg-muted p-4 rounded-md overflow-auto text-xs">
                                {JSON.stringify(selectedEntry, null, 2)}
                              </pre>
                            </TabsContent>
                          </Tabs>
                        )}
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={
                    Object.values(visibleColumns).filter(Boolean).length + 1
                  }
                  className="h-24 text-center"
                >
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Rows per page:
            </span>
            <Select
              value={rowsPerPage.toString()}
              onValueChange={(value) => {
                setRowsPerPage(Number(value));
                setPage(1); // Reset to first page when changing rows per page
              }}
            >
              <SelectTrigger className="w-16 h-8">
                <SelectValue placeholder="10" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="text-sm text-muted-foreground">
            Showing {(page - 1) * rowsPerPage + 1} to{" "}
            {Math.min(page * rowsPerPage, sortedData.length)} of{" "}
            {sortedData.length} entries
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(1)}
              disabled={page === 1}
            >
              First
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
            >
              Previous
            </Button>
            <span className="text-sm">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
            >
              Next
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(totalPages)}
              disabled={page === totalPages}
            >
              Last
            </Button>
          </div>
        </div>
      )}

      {/* Hidden download links for export functionality */}
      <a ref={csvLinkRef} style={{ display: "none" }} />
      <a ref={jsonLinkRef} style={{ display: "none" }} />
    </div>
  );
}

function getStatusCodeColor(statusCode: number): string {
  if (statusCode >= 200 && statusCode < 300) {
    return "bg-green-100 text-green-800";
  } else if (statusCode >= 300 && statusCode < 400) {
    return "bg-blue-100 text-blue-800";
  } else if (statusCode >= 400 && statusCode < 500) {
    return "bg-yellow-100 text-yellow-800";
  } else if (statusCode >= 500) {
    return "bg-red-100 text-red-800";
  }
  return "bg-gray-100 text-gray-800";
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";

  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));

  return `${Number.parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`;
}
