'use client';
import { Button } from '@/components/ui/button';
import { Teacher } from '@prisma/client';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Copy, MoreHorizontal, Pencil, Trash } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import DeleteAction from './actions/delete-action';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import EditAction from './actions/edit-action';


export const columns: ColumnDef<Teacher>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: 'email',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: 'courses',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Courses
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const coursesData = row.getValue('courses') || 0;
      // @ts-ignore
      const courseCount = coursesData.length
      // console.log(courseCount)

      return <Badge className={cn('bg-white text-black ml-5')}>{courseCount}</Badge>;
    },
  },
  {
    id: 'actions',
    header: () => {
      return <Button variant="ghost">Actions</Button>;
    },
    cell: ({ row }) => {
      const { id } = row.original;
      return (
        <span className="flex space-x-1 lg:space-x-2">
          <EditAction teacherId={id} />
          <DeleteAction teacherId={id} />
          
        </span>
      );
    },
  },
];
