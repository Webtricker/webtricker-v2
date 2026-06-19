"use client";

import React, { useMemo, useState } from "react";
import { FileTextIcon, PencilIcon, TrashIcon } from "./icons";
import { Button, Card, CardContent, Skeleton } from "./ui";

type DataTableColumn<Row> = {
  key: keyof Row & string;
  label: string;
  render?: (row: Row) => React.ReactNode;
};

type DataTableProps<Row extends { id?: unknown }> = {
  columns: DataTableColumn<Row>[];
  data: Row[];
  loading: boolean;
  onEdit?: (row: Row) => void;
  onDelete?: (row: Row) => void;
  emptyMessage: string;
};

type SortState<Row> = {
  key: keyof Row & string;
  direction: "asc" | "desc";
} | null;

const pageSizes = [10, 25, 50];

const getSearchableValue = (value: unknown) =>
  typeof value === "string" || typeof value === "number" ? String(value) : "";

const getSortableValue = (value: unknown) => {
  if (typeof value === "number") return value;
  if (typeof value === "string") return value.toLowerCase();
  return "";
};

function ConfirmDialog({
  open,
  title,
  description,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  title: string;
  description: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90] grid place-items-center bg-black/50 px-4">
      <div className="w-full max-w-md rounded-lg border border-zinc-200 bg-white p-5 shadow-lg dark:border-zinc-800 dark:bg-zinc-950">
        <h2 className="text-lg font-semibold text-zinc-950 dark:text-zinc-50">
          {title}
        </h2>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          {description}
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="button" onClick={onConfirm}>
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function DataTable<Row extends { id?: unknown }>({
  columns,
  data,
  loading,
  onEdit,
  onDelete,
  emptyMessage,
}: DataTableProps<Row>) {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortState<Row>>(null);
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [deleteRow, setDeleteRow] = useState<Row | null>(null);

  const filteredData = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    const visibleRows = normalizedSearch
      ? data.filter((row) =>
          columns.some((column) =>
            getSearchableValue(row[column.key])
              .toLowerCase()
              .includes(normalizedSearch)
          )
        )
      : data;

    if (!sort) return visibleRows;

    return [...visibleRows].sort((a, b) => {
      const left = getSortableValue(a[sort.key]);
      const right = getSortableValue(b[sort.key]);

      if (left < right) return sort.direction === "asc" ? -1 : 1;
      if (left > right) return sort.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [columns, data, search, sort]);

  const pageCount = Math.max(1, Math.ceil(filteredData.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const pagedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleSort = (key: keyof Row & string) => {
    setSort((current) => {
      if (current?.key !== key) return { key, direction: "asc" };
      if (current.direction === "asc") return { key, direction: "desc" };
      return null;
    });
  };

  const hasActions = Boolean(onEdit || onDelete);

  return (
    <>
      <Card>
        <CardContent className="pt-4">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <input
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              placeholder="Search..."
              className="min-h-11 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm outline-none focus:border-zinc-500 dark:border-zinc-800 dark:bg-zinc-950 sm:max-w-xs"
            />
            <select
              value={pageSize}
              onChange={(event) => {
                setPageSize(Number(event.target.value));
                setPage(1);
              }}
              className="min-h-11 rounded-md border border-zinc-200 bg-white px-3 text-sm outline-none focus:border-zinc-500 dark:border-zinc-800 dark:bg-zinc-950"
            >
              {pageSizes.map((size) => (
                <option key={size} value={size}>
                  {size} per page
                </option>
              ))}
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="border-b border-zinc-200 text-xs uppercase text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
                <tr>
                  {columns.map((column) => (
                    <th key={column.key} className="px-3 py-3 font-medium">
                      <button
                        type="button"
                        onClick={() => handleSort(column.key)}
                        className="inline-flex items-center gap-1 text-left uppercase"
                      >
                        {column.label}
                        {sort?.key === column.key && (
                          <span>{sort.direction === "asc" ? "^" : "v"}</span>
                        )}
                      </button>
                    </th>
                  ))}
                  {hasActions && (
                    <th className="px-3 py-3 text-right font-medium">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {loading
                  ? Array.from({ length: Math.min(pageSize, 10) }).map(
                      (_, index) => (
                        <tr key={index}>
                          {columns.map((column) => (
                            <td key={column.key} className="px-3 py-4">
                              <Skeleton className="h-5 w-full" />
                            </td>
                          ))}
                          {hasActions && (
                            <td className="px-3 py-4">
                              <Skeleton className="ml-auto h-9 w-24" />
                            </td>
                          )}
                        </tr>
                      )
                    )
                  : pagedData.map((row, rowIndex) => (
                      <tr key={String(row.id || rowIndex)}>
                        {columns.map((column) => (
                          <td
                            key={column.key}
                            className="px-3 py-4 text-zinc-600 dark:text-zinc-300"
                          >
                            {column.render
                              ? column.render(row)
                              : getSearchableValue(row[column.key])}
                          </td>
                        ))}
                        {hasActions && (
                          <td className="px-3 py-4">
                            <div className="flex justify-end gap-2">
                              {onEdit && (
                                <button
                                  type="button"
                                  onClick={() => onEdit(row)}
                                  className="grid h-9 w-9 place-items-center rounded-md border border-zinc-200 text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-950 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-900 dark:hover:text-zinc-50"
                                  aria-label="Edit row"
                                >
                                  <PencilIcon className="h-4 w-4" />
                                </button>
                              )}
                              {onDelete && (
                                <button
                                  type="button"
                                  onClick={() => setDeleteRow(row)}
                                  className="grid h-9 w-9 place-items-center rounded-md border border-zinc-200 text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-950 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-900 dark:hover:text-zinc-50"
                                  aria-label="Delete row"
                                >
                                  <TrashIcon className="h-4 w-4" />
                                </button>
                              )}
                            </div>
                          </td>
                        )}
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>

          {!loading && filteredData.length === 0 && (
            <div className="grid place-items-center rounded-md border border-dashed border-zinc-300 p-8 text-center dark:border-zinc-800">
              <FileTextIcon className="mb-3 h-7 w-7 text-zinc-400" />
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                {emptyMessage}
              </p>
            </div>
          )}

          <div className="mt-4 flex flex-col gap-3 text-sm text-zinc-500 dark:text-zinc-400 sm:flex-row sm:items-center sm:justify-between">
            <p>
              Showing {filteredData.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}
              {"-"}
              {Math.min(currentPage * pageSize, filteredData.length)} of{" "}
              {filteredData.length}
            </p>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="secondary"
                disabled={currentPage === 1}
                onClick={() => setPage((value) => Math.max(1, value - 1))}
                className="min-h-9 px-3 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Previous
              </Button>
              <span>
                Page {currentPage} of {pageCount}
              </span>
              <Button
                type="button"
                variant="secondary"
                disabled={currentPage === pageCount}
                onClick={() =>
                  setPage((value) => Math.min(pageCount, value + 1))
                }
                className="min-h-9 px-3 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <ConfirmDialog
        open={Boolean(deleteRow)}
        title="Delete item?"
        description="This action cannot be undone."
        onCancel={() => setDeleteRow(null)}
        onConfirm={() => {
          if (deleteRow && onDelete) onDelete(deleteRow);
          setDeleteRow(null);
        }}
      />
    </>
  );
}
