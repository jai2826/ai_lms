'use client';

import { Button } from '@/components/ui/button';
import { useLoader } from '@/hooks/useloader';
import { formatPrice } from '@/lib/format';
import axios from 'axios';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface CourseEnrollButtonProps {
  price: number;
  courseId: string;
}


export const CourseEnrollButton = ({
  price,
  courseId,
}: CourseEnrollButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const loader = useLoader();
  const onClick = async () => {
    try {
      setIsLoading(true);
      loader.setValue(30);
      const response = await axios.post(`/api/courses/${courseId}/checkout`);
      console.log(response)
      window.location.assign(response.data.url);
      loader.setValue(60);
    } catch {
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
      loader.setValue(100);
    }
  };
  return (
    <Button
      onClick={onClick}
      disabled={isLoading}
      size="sm"
      className="w-full md:w-auto"
    >
      Enroll for {formatPrice(price)}
    </Button>
  );
};
