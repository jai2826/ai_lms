import { auth } from '@/auth';
import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const session = await auth();
    const userId = session?.user.id;
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const course = await db.course.findUnique({
      where: {
        id: params.courseId,
      },
    });
    const chaptersData = await db.chapter.findMany({
      where: {
        courseId: params.courseId,
      },
    });

    if (!course) {
      return new NextResponse('Not Found', { status: 404 });
    }
    const muxData = await db.muxDataCourse.findUnique({
      where: {
        courseId: course.id,
      },
    });
    const socials = await db.socials.findMany({
      where: {
        courseId: course.id,
      },
    });
    const courseOwner = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId,
      },
    });

    if (!courseOwner) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const newCourse = await db.course.create({
      data: {
        ...course,
        isPublished: false,
        title: course.title + '-copy',
        id: undefined,
        createdAt: undefined,
        updatedAt: undefined,
      },
    });

    if (muxData) {
      await db.muxDataCourse.create({
        data: {
          id: undefined,
          courseId: newCourse.id,
          playbackId: muxData.playbackId,
          assetId: muxData.assetId,
        },
      });
    }

    for (const chapter of chaptersData) {
      await db.chapter.create({
        data: {
          ...chapter,
          courseId: newCourse.id,
          id: undefined,
          createdAt: undefined,
          updatedAt: undefined,
        },
      });
    }

    if (socials) {
      for (const social of socials) {
        await db.socials.create({
          data: {
            ...social,
            id: undefined,
            courseId: newCourse.id,
          },
        });
      }
    }

    return NextResponse.json(newCourse);
  } catch (error) {
    console.log('[COURSE_DUPLICATE]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
