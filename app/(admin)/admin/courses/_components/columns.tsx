'use client';
import { Button } from '@/components/ui/button';
import { Chapter, Course, Purchase } from '@prisma/client';
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
import { formatPrice } from '@/lib/format';

type FullCourse = Course & {
  chapters: Chapter[];
  purchases: Purchase[];
};

export const columns: ColumnDef<FullCourse>[] = [
  {
    accessorKey: 'title',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: 'price',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Price
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const price = row.getValue('price');

      return (
        <Badge className={cn('bg-white text-black ml-2')}>
          {/* @ts-ignore */}
          {price === 0 ? 'Free' : formatPrice(price)}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'chapters',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Chapters
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const chaptersData = row.getValue('chapters') || 0;
      // @ts-ignore
      const chaptersCount = chaptersData.length;
      // console.log(courseCount)

      return (
        <Badge className={cn('bg-white text-black ml-5')}>
          {chaptersCount}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'purchases',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          User Enrolled
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const purchase = row.getValue('purchases');

      // @ts-ignore
      return purchase.length
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const { id } = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="h-4 w-8 p-0" variant="ghost">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <Link href={`/teacher/courses/${id}`}>
              <DropdownMenuItem>
                <Pencil className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
            </Link>
            {/* <DeleteAction teacherId={id} /> */}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
