import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(
  req: Request,
  { params }: { params: { userId: string } }
) {
  console.log('Hello');
  try {
    const { userId } = params;
    const values = await req.json();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    
    console.log(values)
    for (let category of values.categories) {
      console.log(category)
      await db.categoryPreference.create({
        data: {
          userId: userId,
          categoryId: category,
        },
      });
    }

    const preference = await db.categoryPreference.findMany();
    // console.log(preference)
    return NextResponse.json(preference);
  } catch (error) {
    console.log('[USER_PREFERENCE]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
