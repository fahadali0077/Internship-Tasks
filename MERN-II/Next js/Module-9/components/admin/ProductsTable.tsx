"use client";

import { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
} from "@tanstack/react-table";
import { ChevronUp, ChevronDown, ChevronsUpDown, ChevronLeft, ChevronRight } from "lucide-react";
import type { AdminProduct } from "@/lib/adminData";



const CATEGORIES = ["All", "Electronics", "Fashion", "Home & Kitchen", "Books", "Sports"];

interface ProductsTableProps { products: AdminProduct[]; }

export function ProductsTable({ products }: ProductsTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const columns = useMemo<ColumnDef<AdminProduct>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Product",
        cell: ({ row }) => (
          <div className="min-w-0">
            <p className="truncate font-medium text-ink dark:text-white max-w-[220px]">
              {row.original.name}
            </p>
            {row.original.badge && (
              <span className="mt-0.5 inline-block rounded-full bg-amber-dim px-2 py-0.5 text-[10px] font-bold uppercase text-amber">
                {row.original.badge}
              </span>
            )}
          </div>
        ),
        enableSorting: false,
      },
      {
        accessorKey: "category",
        header: "Category",
        cell: ({ getValue }) => (
          <span className="text-xs font-medium uppercase tracking-wider text-ink-muted">
            {getValue<string>()}
          </span>
        ),
        filterFn: (row, _id, filterValue: string) =>
          filterValue === "All" || row.original.category === filterValue,
      },
      {
        accessorKey: "price",
        header: "Price",
        cell: ({ getValue }) => (
          <span className="tabular-nums font-semibold dark:text-white">
            ${getValue<number>().toFixed(2)}
          </span>
        ),
      },
      {
        accessorKey: "stock",
        header: "Stock",
        cell: ({ getValue }) => {
          const stock = getValue<number>();
          return (
            <span
              className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-bold ${stock < 20
                  ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                  : stock < 50
                    ? "bg-amber-dim text-amber"
                    : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                }`}
            >
              {stock}
            </span>
          );
        },
      },
      {
        accessorKey: "sold",
        header: "Sold",
        cell: ({ getValue }) => (
          <span className="tabular-nums text-ink-muted">{getValue<number>().toLocaleString()}</span>
        ),
      },
      {
        accessorKey: "rating",
        header: "Rating",
        cell: ({ getValue }) => (
          <span className="flex items-center gap-1 text-sm">
            <span className="text-amber-light">★</span>
            <span className="tabular-nums text-ink-muted dark:text-white">{getValue<number>()}</span>
          </span>
        ),
      },
    ],
    [],
  );

  const table = useReactTable({
    data: products,
    columns,
    state: { sorting, columnFilters, globalFilter },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 8 } },
  });

  const SortIcon = ({ column }: { column: ReturnType<typeof table.getColumn> }) => {
    if (!column?.getCanSort()) return null;
    const sorted = column.getIsSorted();
    if (sorted === "asc") return <ChevronUp size={14} className="text-amber" />;
    if (sorted === "desc") return <ChevronDown size={14} className="text-amber" />;
    return <ChevronsUpDown size={14} className="text-border" />;
  };

  return (
    <div className="rounded-xl border border-border bg-white shadow-sm dark:border-dark-border dark:bg-dark-surface">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-4 dark:border-dark-border">
        <h3 className="font-serif text-lg font-normal dark:text-white">Products</h3>
        <div className="flex items-center gap-3">
          {/* Global search */}
          <input
            value={globalFilter}
            onChange={(e) => { setGlobalFilter(e.target.value); }}
            placeholder="Search products…"
            className="h-8 rounded-lg border border-border bg-parchment px-3 text-sm text-ink outline-none transition focus:border-amber focus:ring-2 focus:ring-amber/20 dark:border-dark-border dark:bg-dark-surface-2 dark:text-white"
          />
          {/* Category filter */}
          <select
            value={(table.getColumn("category")?.getFilterValue() as string) ?? "All"}
            onChange={(e) => {
              table.getColumn("category")?.setFilterValue(
                e.target.value === "All" ? undefined : e.target.value,
              );
            }}
            className="h-8 rounded-lg border border-border bg-parchment px-3 text-sm text-ink outline-none focus:border-amber dark:border-dark-border dark:bg-dark-surface-2 dark:text-white"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id} className="border-b border-border bg-parchment/60 dark:border-dark-border dark:bg-dark-surface-2">
                {hg.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-ink-muted"
                  >
                    {header.isPlaceholder ? null : (
                      <button
                        className={`flex items-center gap-1.5 ${header.column.getCanSort() ? "cursor-pointer select-none hover:text-ink dark:hover:text-white" : ""}`}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        <SortIcon column={header.column} />
                      </button>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-border/40 dark:divide-dark-border">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="transition-colors hover:bg-parchment/50 dark:hover:bg-dark-surface-2">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between border-t border-border px-4 py-3 dark:border-dark-border">
        <p className="text-xs text-ink-muted">
          {table.getFilteredRowModel().rows.length} products ·{" "}
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => { table.previousPage(); }}
            disabled={!table.getCanPreviousPage()}
            className="flex h-7 w-7 items-center justify-center rounded border border-border text-ink-muted transition hover:border-amber hover:text-amber disabled:opacity-30 dark:border-dark-border dark:text-white"
          >
            <ChevronLeft size={14} />
          </button>
          <button
            onClick={() => { table.nextPage(); }}
            disabled={!table.getCanNextPage()}
            className="flex h-7 w-7 items-center justify-center rounded border border-border text-ink-muted transition hover:border-amber hover:text-amber disabled:opacity-30 dark:border-dark-border dark:text-white"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
