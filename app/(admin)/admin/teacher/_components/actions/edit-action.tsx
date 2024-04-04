'use client';
import { Button } from '@/components/ui/button';
import { useLoader } from '@/hooks/useloader';
import { Pencil } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
interface EditActionProps {
  teacherId: string;
}

const EditAction = ({ teacherId }: EditActionProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const loader = useLoader();
  const handleClick = () => {
    loader.setValue(50);
    router.push(`/admin/teacher/${teacherId}`);
    loader.setValue(100);
  };
  return (
    <Button
      className="hover:cursor-pointer relative flex cursor-default select-none h-auto justify-start rounded-sm px-2  text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
      variant={'ghost'}
      disabled={isLoading}
      onClick={handleClick}
    >
      <Pencil className="h-4 w-4 " />
    </Button>
  );
};

export default EditAction;
