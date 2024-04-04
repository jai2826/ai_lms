import { auth } from '@/auth';
import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

// const { Video } = new Mux(
//   process.env.MUX_TOKEN_ID!,
//   process.env.MUX_TOKEN_SECRET!
// );

export async function DELETE(
  req: Request,
  { params }: { params: { teacherId: string } }
) {
  try {
    const session = await auth();
    const userId = session?.user.id;
    const { teacherId } = params;

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const teacher = await db.teacher.findUnique({
      where: {
        id: teacherId,
      },
    });

    if (!teacher) {
      return new NextResponse('Not found', { status: 404 });
    }

    const deletedTeacher = await db.teacher.delete({
      where: {
        id: teacherId,
      },
    });

    return NextResponse.json(deletedTeacher);
  } catch (error) {
    console.log('[TEACHER_ID_DELETE]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { teacherId: string } }
) {
  try {
    const session = await auth();
    const userId = session?.user.id;
    const { teacherId } = params;
    const values = await req.json();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    const teacher = await db.teacher.update({
      where: {
        id: teacherId,
      },
      data: {
        ...values,
      },
    });

    return NextResponse.json(teacher);
  } catch (error) {
    console.log('[TEACHER_ID]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
