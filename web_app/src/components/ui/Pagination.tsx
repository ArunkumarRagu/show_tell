import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { PaginationMeta } from '@/types';
import { ReactSelect } from './ReactSelect';

interface PaginationProps {
  meta?: PaginationMeta;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: number[];
  isFetching?: boolean;
  className?: string;
}

export function Pagination({
  meta,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [5, 10, 20, 50],
  isFetching = false,
  className = '',
}: PaginationProps) {
  if (!meta || meta.total_items === 0) return null;

  const { page, page_size, total_items, total_pages, has_prev, has_next } = meta;
  const startItem = total_items === 0 ? 0 : (page - 1) * page_size + 1;
  const endItem = Math.min(page * page_size, total_items);

  const selectOptions = pageSizeOptions.map((opt) => ({
    value: opt,
    label: `${opt}`,
  }));

  return (
    <div
      className={`flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-4 py-3 border-t border-[#26324A] bg-[#11182B]/80 text-xs ${className}`}
    >
      <div className="flex items-center gap-4 text-slate-400">
        <div>
          Showing <span className="font-semibold text-white">{startItem}</span> to{' '}
          <span className="font-semibold text-white">{endItem}</span> of{' '}
          <span className="font-semibold text-white">{total_items}</span> results
        </div>
        {onPageSizeChange && (
          <div className="flex items-center gap-2 border-l border-[#26324A] pl-4">
            <span>Per page:</span>
            <div className="w-20">
              <ReactSelect
                options={selectOptions}
                value={selectOptions.find((opt) => opt.value === page_size) || { value: page_size, label: `${page_size}` }}
                onChange={(selected) => selected && onPageSizeChange(Number(selected.value))}
                isDisabled={isFetching}
                isSearchable={false}
                menuPlacement="top"
                menuPortalTarget={typeof document !== 'undefined' ? document.body : undefined}
                styles={{
                  control: (base, state) => ({
                    ...base,
                    backgroundColor: '#151E33',
                    borderColor: state.isFocused ? '#7C3AED' : '#26324A',
                    minHeight: '32px',
                    height: '32px',
                    borderRadius: '0.5rem',
                    fontSize: '0.75rem',
                    boxShadow: 'none',
                    '&:hover': {
                      borderColor: '#3b4d71',
                    },
                  }),
                  valueContainer: (base) => ({
                    ...base,
                    height: '30px',
                    padding: '0 8px',
                    display: 'flex',
                    alignItems: 'center',
                  }),
                  singleValue: (base) => ({
                    ...base,
                    color: '#F8FAFC',
                    fontSize: '0.75rem',
                    margin: 0,
                  }),
                  indicatorsContainer: (base) => ({
                    ...base,
                    height: '30px',
                  }),
                  dropdownIndicator: (base) => ({
                    ...base,
                    padding: '2px 4px',
                  }),
                  menuPortal: (base) => ({
                    ...base,
                    zIndex: 9999,
                  }),
                  menu: (base) => ({
                    ...base,
                    backgroundColor: '#151E33',
                    borderColor: '#26324A',
                    borderWidth: '1px',
                    borderRadius: '0.5rem',
                    fontSize: '0.75rem',
                  }),
                  option: (base, state) => ({
                    ...base,
                    backgroundColor: state.isSelected
                      ? '#7C3AED'
                      : state.isFocused
                      ? '#1C2742'
                      : 'transparent',
                    color: state.isSelected ? '#FFFFFF' : '#F8FAFC',
                    fontSize: '0.75rem',
                    padding: '6px 10px',
                    cursor: 'pointer',
                  }),
                }}
              />
            </div>
          </div>
        )}
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={!has_prev || isFetching}
          className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 font-medium border border-[#26324A] bg-[#151E33] text-slate-300 hover:bg-[#1C2742] hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </button>
        <span className="px-2 font-display font-semibold text-slate-300">
          Page <span className="text-purple-400">{page}</span> of {total_pages || 1}
        </span>
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={!has_next || isFetching}
          className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 font-medium border border-[#26324A] bg-[#151E33] text-slate-300 hover:bg-[#1C2742] hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

