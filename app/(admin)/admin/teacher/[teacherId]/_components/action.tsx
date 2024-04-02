'use client';

import { ConfirmModal } from '@/components/modals/confirm-modal';
import { Button } from '@/components/ui/button';
import { useConfettiStore } from '@/hooks/useConfettiStore';
import axios from 'axios';
import { Check, Copy, Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface ActionsProps {
  disabled: boolean;
  teacherId: string;
  teacherUserId: string;
}
export const Actions = ({
  disabled,
  teacherId,
  teacherUserId,
}: ActionsProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const router = useRouter();

  const onDelete = async () => {
    try {
      setIsLoading(true);
      await axios.delete(`/api/teacher/${teacherId}`);
      toast.success('Teacher deleted');
      router.push(`/admin/teacher`);
      router.refresh();
    } catch {
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const onClick = async () => {
    await navigator.clipboard.writeText(teacherUserId);
    const testData = await navigator.clipboard.readText();

    if (testData === teacherUserId) {
      setIsCopied(true);
    }
  };
  return (
    <div className="flex items-center gap-x-2 ">
      {/* <Button
        onClick={onClick}
        disabled={isLoading}
        variant="outline"
        size="sm"
      >
        {isPublished ? 'Unpublish' : 'Publish'}
      </Button> */}
      <Button size="sm" onClick={onClick}>
        {isCopied ? (
          <Check className="h-4 w-4" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
      </Button>
      <ConfirmModal onConfirm={onDelete}>
        <Button disabled={isLoading} size="sm">
          <Trash className="h-4 w-4" />
        </Button>
      </ConfirmModal>
    </div>
  );
};