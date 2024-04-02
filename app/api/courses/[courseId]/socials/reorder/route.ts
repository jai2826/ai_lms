import { currentTeacher } from '@/lib/currentTeacher';
import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function PUT(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const teacher = await currentTeacher();

    if (!teacher || !teacher.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    const { list } = await req.json();

    const ownCourse = await db.course.findUnique({
      where: {
        id: params.courseId,
        teacherId: teacher.id,
      },
    });
    if (!ownCourse) {
      return new NextResponse('Unauthorised', { status: 401 });
    }

    for (let link of list) {
      await db.socials.update({
        where: { id: link.id },
        data: { position: link.position },
      });
    }
    return new NextResponse('Success', { status: 200 });
  } catch (error) {
    console.log('[SOCIALS_REORDER]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
