import { auth } from '@/auth';
import { currentTeacher } from '@/lib/currentTeacher';
import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { name, link, socialsTypeId, id, position, isLocked } =
      await req.json();
    const teacher = await currentTeacher();

    const { courseId } = params;

    if (!teacher || !teacher.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const courseOwner = await db.course.findUnique({
      where: {
        id: courseId,
        teacherId: teacher?.id,
      },
    });

    if (!courseOwner) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    if (id || position) {
      const updatedSocial = await db.socials.update({
        where: {
          id,
        },
        data: {
          name,
          link,
          socialsTypeId,
          position,
          isLocked,
        },
      });
      return NextResponse.json(updatedSocial);
    }

    const lastSocial = await db.socials.findFirst({
      where: {
        courseId: params.courseId,
      },
      orderBy: {
        position: 'desc',
      },
    });

    const newPosition = lastSocial ? lastSocial.position + 1 : 1;

    const social = await db.socials.create({
      data: {
        name,
        link,
        courseId,
        socialsTypeId,
        isLocked,
        position: newPosition,
      },
    });

    return NextResponse.json(social);
  } catch (error) {
    console.log('[SOCIALS]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
