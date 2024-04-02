import { IconBadge } from '@/components/icon-badge';
import { db } from '@/lib/db';
import { auth } from '@/auth';
import {
  CircleDollarSign,
  File,
  LayoutDashboard,
  BookUser,
  ArrowLeft,
  Copy,
} from 'lucide-react';
import { redirect } from 'next/navigation';

import Link from 'next/link';
import { Actions } from './_components/action';
import { NameForm } from './_components/name-form';
import { ImageForm } from './_components/image-form';
import { EmailForm } from './_components/email-form';
import { PhoneNumberForm } from './_components/phone-number-form';

const TeacherIdPage = async ({ params }: { params: { teacherId: string } }) => {
  const session = await auth();
  const userId = session?.user.id;

  if (!userId) {
    return redirect('/');
  }

  const teacher = await db.teacher.findUnique({
    where: {
      id: params.teacherId,
    },
    include: {
      courses: true,
    },
  });

  const categories = await db.category.findMany({
    orderBy: {
      name: 'asc',
    },
  });
  if (!teacher) {
    return redirect('/');
  }

  const copyUserId = async () => {
    await navigator.clipboard.writeText(teacher.userId);
  };

  const requiredFields = [teacher.name, teacher.email, teacher.phoneNumber];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;

  const completionText = `(${completedFields}/${totalFields})`;

  const isComplete = requiredFields.every(Boolean);
  return (
    <>
      <div className="p-6 ">
        <div className="flex items-center  justify-between">
          <div className="w-full">
            <Link
              href={`/admin/teacher`}
              className="flex items-center text-sm hover:opacity-75 transition mb-6"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to teacher list
            </Link>
            <div className="flex items-center justify-between w-full">
              <div className="flex flex-col gap-y-2">
                <h1 className="text-2xl font-medium">Teacher Setup</h1>
                <span className="text-sm text-slate-700">
                  Complete all fields {completionText}
                </span>
              </div>
              <Actions
                disabled={!isComplete}
                teacherId={params.teacherId}
                teacherUserId={teacher.userId}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16 ">
              <div>
                <div className="flex items-center gap-x-2">
                  <IconBadge icon={LayoutDashboard} />
                  <h2 className="text-xl">Teacher details</h2>
                </div>
                <NameForm initialData={teacher} teacherId={teacher.id} />
                {/* <DescriptionForm initialData={course} courseId={course.id} /> */}
                <ImageForm initialData={teacher} teacherId={teacher.id} />
                {/* <CategoryForm
              options={categories.map((item) => ({
                label: item.name,
                value: item.id,
              }))}
              initialData={course}
              courseId={course.id}
            /> */}
              </div>
              <div className="space-y-6 ">
                <div>
                  <div className="flex items-center gap-x-2">
                    <IconBadge icon={BookUser} />
                    <h2 className="text-xl ">Teacher Contact</h2>
                  </div>
                  <EmailForm initialData={teacher} teacherId={teacher.id} />
                  <PhoneNumberForm
                    initialData={teacher}
                    teacherId={teacher.id}
                  />
                </div>
                {/* <div>
                  <div className="flex items-center gap-x-2">
                    <IconBadge icon={CircleDollarSign} />
                    <h2 className="text-xl ">Sell your course</h2>
                  </div>
                  <PriceForm initialData={course} courseId={course.id} /> 
                </div> */}
                {/* <div>
                  <div className="flex items-center gap-x-2">
                    <IconBadge icon={File} />
                    <h2 className="text-xl ">Resources & Attachments</h2>
                  </div>
                  <AttachmentForm initialData={course} courseId={course.id} />
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TeacherIdPage;
