"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";

export type SubcategoryColumn = {
  id: string;
  name: string;
  subcategoryName: string;
  createdAt: string;
};

export const columns: ColumnDef<SubcategoryColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => row.original.subcategoryName,
  },
  {
    id: "actions",
     cell: ({ row }) => <CellAction data={row.original} />,
  },
];
