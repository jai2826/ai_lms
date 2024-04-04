'use client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/format';
import { cn } from '@/lib/utils';
import { Chapter, Course, Purchase } from '@prisma/client';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import EditAction from './actions/edit-action';

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
        <Badge className={cn('bg-white text-black ml-5 ')}>
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
      return purchase.length;
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
          <EditAction courseId={id} />
        </span>
      );
    },
  },
];
