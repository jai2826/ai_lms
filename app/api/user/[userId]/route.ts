import { db } from '@/lib/db';
import { auth } from '@/auth';
import Mux from '@mux/mux-node';
import { NextResponse } from 'next/server';

// export async function DELETE(
//   req: Request,
//   { params }: { params: { teacherId: string } }
// ) {
//   try {
//     const session = await auth();
//     const userId = session?.user.id;
//     const { teacherId } = params;

//     if (!userId) {
//       return new NextResponse('Unauthorized', { status: 401 });
//     }

//     const teacher = await db.teacher.findUnique({
//       where: {
//         id: teacherId,
//       },
//     });

//     if (!teacher) {
//       return new NextResponse('Not found', { status: 404 });
//     }

//     const deletedTeacher = await db.teacher.delete({
//       where: {
//         id: teacherId,
//       },
//     });

//     return NextResponse.json(deletedTeacher);
//   } catch (error) {
//     console.log('[TEACHER_ID_DELETE]', error);
//     return new NextResponse('Internal Error', { status: 500 });
//   }
// }

export async function PATCH(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;
    const values = await req.json();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    const newUser = await db.user.update({
      where: {
        id: userId,
      },
      data: {
        ...values,
      },
    });

    return NextResponse.json(newUser);
  } catch (error) {
    console.log('[USER_ID]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
