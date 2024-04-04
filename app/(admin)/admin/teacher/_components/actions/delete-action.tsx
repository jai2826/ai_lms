'use client';
import { ConfirmModal } from '@/components/modals/confirm-modal';
import { Button } from '@/components/ui/button';
import { useLoader } from '@/hooks/useloader';
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
  const loader = useLoader();

  const onDelete = async () => {
    try {
      setIsLoading(true);
      loader.setValue(30);
      await axios.delete(`/api/teacher/${teacherId}`);
      loader.setValue(60);
      toast.success('Teacher deleted');
      router.refresh();
      loader.setValue(80);
    } catch {
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
      loader.setValue(100);
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
      </Button>
    </ConfirmModal>
  );
};

export default DeleteAction;
