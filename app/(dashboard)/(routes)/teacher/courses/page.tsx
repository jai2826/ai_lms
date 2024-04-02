import { DataTable } from './_components/data-table';
import { columns } from './_components/columns';
import { db } from '@/lib/db';
import { redirect } from 'next/navigation';
import { getTeacherByUserId } from '@/data/teacher';
import { currentUser } from '@/lib/currentUser';

const CoursesPage = async () => {
  const user = await currentUser();

  if (!user || !user.id) {
    return redirect('/');
  }

  const teacherData = await getTeacherByUserId(user.id);

  if (!teacherData) {
    return redirect('/');
  }

  const data = await db.course.findMany({
    where: {
      teacherId: teacherData.id,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <div className="p-6 ">
      <DataTable columns={columns} data={data} />
    </div>
  );
};

export default CoursesPage;
