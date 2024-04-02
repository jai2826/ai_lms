import { currentTeacher } from "@/lib/currentTeacher";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { courseId: string, socialId: string } }
) {
  try {
    const teacher = await currentTeacher();
    if (!teacher || !teacher.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    const ownCourse = await db.course.findUnique({
      where: {
        id: params.courseId,
        teacherId: teacher.id,
      },
    });


    if (!ownCourse) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const deletedSocial = await db.socials.delete({
      where: {
        id:params.socialId,
      },
    });

    return NextResponse.json(deletedSocial);
  } catch (error) {
    console.log('[CHAPTER_ID_DELETE]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}