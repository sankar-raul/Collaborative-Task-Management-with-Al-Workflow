import React, { useState, useMemo } from "react";
import { COLUMNS } from "./kanbanData";
import KanbanColumn from "./KanbanColumn";
import { Search, SlidersHorizontal, ChevronDown } from "lucide-react";

const FILTER_OPTIONS = ["All", "High Priority", "Medium Priority", "Low Priority", "My Tasks"];

const KanbanBoard: React.FC = () => {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [filterOpen, setFilterOpen] = useState(false);

  // Filter tasks across columns based on search + quick filter
  const filteredColumns = useMemo(() => {
    return COLUMNS.map((col) => ({
      ...col,
      tasks: col.tasks.filter((task) => {
        const matchesSearch =
          search.trim() === "" ||
          task.title.toLowerCase().includes(search.toLowerCase()) ||
          task.tags.some((t) =>
            t.label.toLowerCase().includes(search.toLowerCase())
          );

        const matchesFilter =
          activeFilter === "All" ||
          (activeFilter === "High Priority" && task.priority === "high") ||
          (activeFilter === "Medium Priority" && task.priority === "medium") ||
          (activeFilter === "Low Priority" && task.priority === "low") ||
          (activeFilter === "My Tasks" && task.completed === false);

        return matchesSearch && matchesFilter;
      }),
    }));
  }, [search, activeFilter]);

  return (
    <div className="flex flex-col gap-5 h-full min-h-0">
      {/* ── Toolbar ── */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-45 max-w-sm">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tasks…"
            className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent placeholder:text-gray-400 transition"
          />
        </div>

        {/* Quick Filters */}
        <div className="relative">
          <button
            onClick={() => setFilterOpen((v) => !v)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl shadow-sm hover:bg-gray-50 transition"
          >
            <SlidersHorizontal size={14} />
            Quick Filters
            <ChevronDown
              size={14}
              className={`transition-transform duration-200 ${filterOpen ? "rotate-180" : ""}`}
            />
          </button>

          {filterOpen && (
            <div className="absolute left-0 top-full mt-1 z-30 w-44 bg-white border border-gray-100 rounded-xl shadow-lg py-1 overflow-hidden">
              {FILTER_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  onClick={() => {
                    setActiveFilter(opt);
                    setFilterOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                    activeFilter === opt
                      ? "bg-indigo-50 text-indigo-600 font-semibold"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Board ── */}
      {/*
        Responsive layout:
          mobile  (<640px)  → vertical stack (1 col)
          sm      (640px+)  → 2 columns
          lg      (1024px+) → 4 columns
      */}
      <div
        className="
          grid
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-4
          gap-5
          overflow-y-auto
          pb-4
          flex-1
          min-h-0
          items-start
        "
        onClick={() => filterOpen && setFilterOpen(false)}
      >
        {filteredColumns.map((col, idx) => (
          <KanbanColumn
            key={col.id}
            column={col}
            showAddTask={idx === 0}
          />
        ))}
      </div>
    </div>
  );
};

export default KanbanBoard;
