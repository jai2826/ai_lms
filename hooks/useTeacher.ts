import { useState, useEffect } from 'react';
import { useCurrentUser } from './useCurrentUser';

export const useTeacher = () => {
  const user = useCurrentUser();
  const [teacher, setTeacher] = useState<any>(null);

  useEffect(() => {
    if (!user?.id) {
      setTeacher(null);
      return;
    }
    fetch(`/api/teacher?userId=${user.id}`)
      .then((res) => res.json())
      .then((data) => setTeacher(data))
      .catch(() => setTeacher(null));
  }, [user?.id]);

  return teacher;
};
