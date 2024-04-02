import { auth } from '@/auth';
import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const session = await auth();
    const userId = session?.user.id;
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { email } = await req.json();
    console.log(email);
    const usersList = await db.user.findMany();
    const emailList = usersList.map((item) => item.email);
    const teacherCheck = await db.teacher.findFirst({
      where: {
        email,
      },
    });
    if (teacherCheck) {
      return new NextResponse(
        'A teacher with this email is already regiesterd with us',
        { status: 404 }
      );
    }

    let userData;
    if (emailList.includes(email)) {
      userData = usersList.find((user) => user.email === email);
    }

    if (!userData || !userData.id || !userData.name) {
      console.log(userData);
      return new NextResponse('No User found with this email', { status: 404 });
    }

    const teacher = await db.teacher.create({
      data: {
        name: userData.name,
        email,
        userId: userData.id,
      },
    });

    return NextResponse.json(teacher);
  } catch (error) {
    console.log('[TEACHER]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
