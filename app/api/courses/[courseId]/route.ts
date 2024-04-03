import Mux from '@mux/mux-node';
import { auth } from '@/auth';
import { NextResponse } from 'next/server';

import { db } from '@/lib/db';
import { currentTeacher } from '@/lib/currentTeacher';

const { Video } = new Mux(
  process.env.MUX_TOKEN_ID!,
  process.env.MUX_TOKEN_SECRET!
);

export async function DELETE(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const session = await auth();

    const teacher = await currentTeacher();

    const { courseId } = params;

    if (!teacher || !teacher.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const course = await db.course.findUnique({
      where: {
        id: params.courseId,
        teacherId: teacher.id,
      },
      include: {
        chapters: {
          include: {
            muxData: true,
          },
        },
      },
    });

    if (!course) {
      return new NextResponse('Not found', { status: 404 });
    }

    for (const chapter of course.chapters) {
      if (chapter.muxData?.assetId) {
        await Video.Assets.del(chapter.muxData.assetId);
      }
    }

    const deletedCourse = await db.course.delete({
      where: {
        id: params.courseId,
      },
    });

    return NextResponse.json(deletedCourse);
  } catch (error) {
    console.log('[COURSE_ID_DELETE]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const session = await auth();
    const userId = session?.user.id;
    const values = await req.json();

    const teacher = await currentTeacher();

    const { courseId } = params;


    if (!teacher || !teacher.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const course = await db.course.update({
      where: {
        id: courseId,
        teacherId: teacher.id,
      },
      data: {
        ...values,
      },
    });

    // if (values.introUrl) {
    //   const existingMuxData = await db.muxDataCourse.findFirst({
    //     where: {
    //       courseId: params.courseId,
    //     },
    //   });

    //   if (existingMuxData) {
    //     await Video.Assets.del(existingMuxData.assetId);
    //     await db.muxDataCourse.delete({
    //       where: {
    //         id: existingMuxData.id,
    //       },
    //     });
    //   }

    //   const asset = await Video.Assets.create({
    //     input: values.introUrl,
    //     playback_policy: 'public',
    //     test: false,
    //   });

    //   await db.muxDataCourse.create({
    //     data: {
    //       courseId: params.courseId,
    //       assetId: asset.id,
    //       playbackId: asset.playback_ids?.[0]?.id,
    //     },
    //   });
    // }

    return NextResponse.json(course);
  } catch (error) {
    console.log('[COURSE_ID]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
