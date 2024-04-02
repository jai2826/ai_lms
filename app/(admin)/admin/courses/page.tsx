import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { DataTable } from './_components/data-table';
import { columns } from './_components/columns';
import { db } from '@/lib/db';
import { useCurrentUser } from '@/hooks/useCurrentUser';

const TeacherPage = async () => {
  const session = await auth();
  const userId = session?.user.id;

  if (!userId) {
    return redirect('/');
  }

  const data = await db.course.findMany({
    include:{
      chapters:true,
      purchases: true
    }
  });
  return (
    <div className="p-6 ">
      <DataTable columns={columns} data={data} />
    </div>
  );
};

export default TeacherPage;
