import type { ReactNode } from 'react';
import { useState } from 'react';
import { Search, ChevronUp, ChevronDown, ChevronsUpDown, Loader2 } from 'lucide-react';
import { Pagination } from './Pagination';
import type { PaginationMeta } from '@/types';

export interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => ReactNode;
  sortable?: boolean;
  sortValue?: (row: T) => string | number;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  isFetching?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
  searchFields?: (row: T) => string[];
  meta?: PaginationMeta;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: number[];
  onRowClick?: (row: T) => void;
  emptyMessage?: string;
  actionButton?: ReactNode;
}

export function DataTable<T extends { id: string }>({
  columns,
  data,
  isLoading = false,
  isFetching = false,
  searchable = false,
  searchPlaceholder = 'Search records...',
  searchFields,
  meta,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions,
  onRowClick,
  emptyMessage = 'No data available',
  actionButton,
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Client-side filtering if searchFields is provided
  const filteredData = data.filter((row) => {
    if (!searchQuery.trim() || !searchFields) return true;
    const fields = searchFields(row);
    return fields.some((f) => String(f || '').toLowerCase().includes(searchQuery.toLowerCase()));
  });

  // Client-side sorting if sortColumn is active
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortColumn) return 0;
    const col = columns.find((c) => c.key === sortColumn);
    if (!col) return 0;

    const valA = col.sortValue ? col.sortValue(a) : (a as any)[sortColumn];
    const valB = col.sortValue ? col.sortValue(b) : (b as any)[sortColumn];

    if (valA === valB) return 0;
    if (valA == null) return 1;
    if (valB == null) return -1;

    const result = valA < valB ? -1 : 1;
    return sortDirection === 'asc' ? result : -result;
  });

  const handleSort = (key: string) => {
    if (sortColumn === key) {
      if (sortDirection === 'asc') setSortDirection('desc');
      else setSortColumn(null);
    } else {
      setSortColumn(key);
      setSortDirection('asc');
    }
  };

  return (
    <div className="space-y-4">
      {(searchable || actionButton) && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {searchable && (
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={searchPlaceholder}
                className="input pl-10"
              />
            </div>
          )}
          {actionButton && <div>{actionButton}</div>}
        </div>
      )}

      <div className="relative overflow-hidden rounded-2xl border border-[#26324A] bg-[#151E33] shadow-xl">
        {isFetching && !isLoading && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#0B1020]/50 backdrop-blur-[1px] transition-all">
            <div className="flex items-center gap-2.5 rounded-xl border border-[#26324A] bg-[#151E33] px-4 py-2 text-xs font-semibold text-purple-400 shadow-xl">
              <Loader2 className="h-4 w-4 animate-spin text-purple-400" />
              <span>Loading data...</span>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
          </div>
        ) : sortedData.length === 0 ? (
          <div className="py-16 text-center text-slate-400 font-medium">
            {emptyMessage}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-[#26324A] bg-[#11182B]">
                    {columns.map((col) => {
                      const isSorted = sortColumn === col.key;
                      return (
                        <th
                          key={col.key}
                          onClick={() => col.sortable && handleSort(col.key)}
                          className={`px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400 select-none ${
                            col.sortable ? 'cursor-pointer hover:text-white' : ''
                          } ${col.className ?? ''}`}
                        >
                          <div className="flex items-center gap-1.5">
                            <span>{col.header}</span>
                            {col.sortable && (
                              <span className="text-slate-500">
                                {isSorted ? (
                                  sortDirection === 'asc' ? (
                                    <ChevronUp className="h-4 w-4 text-purple-400" />
                                  ) : (
                                    <ChevronDown className="h-4 w-4 text-purple-400" />
                                  )
                                ) : (
                                  <ChevronsUpDown className="h-3.5 w-3.5 opacity-50" />
                                )}
                              </span>
                            )}
                          </div>
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#26324A]">
                  {sortedData.map((row) => (
                    <tr
                      key={row.id}
                      onClick={() => onRowClick?.(row)}
                      className={`transition-colors hover:bg-[#1C2742]/60 ${
                        onRowClick ? 'cursor-pointer' : ''
                      }`}
                    >
                      {columns.map((col) => (
                        <td key={col.key} className={`px-6 py-4 text-slate-200 ${col.className ?? ''}`}>
                          {col.render ? col.render(row) : (row as any)[col.key]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {meta && onPageChange && (
              <Pagination
                meta={meta}
                onPageChange={onPageChange}
                onPageSizeChange={onPageSizeChange}
                pageSizeOptions={pageSizeOptions}
                isFetching={isFetching}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
