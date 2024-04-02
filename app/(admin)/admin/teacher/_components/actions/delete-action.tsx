'use client';
import { ConfirmModal } from '@/components/modals/confirm-modal';
import { Button } from '@/components/ui/button';
import { DropdownMenuItem } from '@radix-ui/react-dropdown-menu';
import axios from 'axios';
import { Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';
interface DeleteActionProps {
  teacherId: string;
}

const DeleteAction = ({ teacherId }: DeleteActionProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const onDelete = async () => {
    try {
      setIsLoading(true);
      await axios.delete(`/api/teacher/${teacherId}`);
      toast.success('Teacher deleted');
      router.refresh();
    } catch {
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <ConfirmModal onConfirm={onDelete}>
      <Button
        className="relative flex cursor-default select-none h-auto justify-start rounded-sm px-2 w-full text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
        variant={'ghost'}
        disabled={isLoading}
      >
        <Trash className="h-4 w-4 mr-2" />
        Delete
      </Button>
    </ConfirmModal>
  );
};

export default DeleteAction;
