'use client';
import { ConfirmModal } from '@/components/modals/confirm-modal';
import { Button } from '@/components/ui/button';
import { useLoader } from '@/hooks/useloader';
import { DropdownMenuItem } from '@radix-ui/react-dropdown-menu';
import axios from 'axios';
import { Copy } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';
interface DuplicateActionProps {
  courseId: string;
}

const DuplicateAction = ({ courseId }: DuplicateActionProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
const loader = useLoader();
  const createDuplicate = async () => {
    try {
      setIsLoading(true);
      loader.setValue(30)
      const newCourse = await axios.post(`/api/courses/${courseId}/duplicate`);
      loader.setValue(60)
      toast.success('Course created');
      router.push(`/teacher/courses/${newCourse.data.id}`);
      loader.setValue(80)
      router.refresh();
    } catch {
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
      loader.setValue(100)
    }
  };
  return (
    <Button
      className="relative flex cursor-default select-none h-auto justify-start rounded-sm px-2 w-full text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
      variant={'ghost'}
      disabled={isLoading}
      onClick={createDuplicate}
    >
      <Copy className="h-4 w-4 mr-2" />
      Create a copy
    </Button>
  );
};

export default DuplicateAction;
