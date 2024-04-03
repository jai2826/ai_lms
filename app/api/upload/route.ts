// import Mux from '@mux/mux-node';
// import { NextResponse } from 'next/server';

// import { db } from '@/lib/db';
// import { auth } from '@/auth';
// import { Storage } from '@google-cloud/storage';

// const { Video } = new Mux(
//   process.env.MUX_TOKEN_ID!,
//   process.env.MUX_TOKEN_SECRET!
// );

// const storage = new Storage({
//   projectId: process.env.GCS_PROJECT_ID,
//   credentials: {
//     client_email: process.env.GCS_CLIENT_EMAIL,
//     private_key: process.env.GCS_PRIVATE_KEY,
//   },
// });

// // export async function DELETE(
// //   req: Request,
// //   { params }: { params: { courseId: string; chapterId: string } }
// // ) {
// //   try {
// //     const session = await auth();
// //     const userId = session?.user.id;

// //     if (!userId) {
// //       return new NextResponse('Unauthorized', { status: 401 });
// //     }

// //     const ownCourse = await db.course.findUnique({
// //       where: {
// //         id: params.courseId,
// //         userId,
// //       },
// //     });

// //     if (!ownCourse) {
// //       return new NextResponse('Unauthorized', { status: 401 });
// //     }

// //     const chapter = await db.chapter.findUnique({
// //       where: {
// //         id: params.chapterId,
// //         courseId: params.courseId,
// //       },
// //     });

// //     if (!chapter) {
// //       return new NextResponse('Not Found', { status: 404 });
// //     }

// //     if (chapter.videoUrl) {
// //       const existingMuxData = await db.muxData.findFirst({
// //         where: {
// //           chapterId: params.chapterId,
// //         },
// //       });

// //       if (existingMuxData) {
// //         await Video.Assets.del(existingMuxData.assetId);
// //         await db.muxData.delete({
// //           where: {
// //             id: existingMuxData.id,
// //           },
// //         });
// //       }
// //     }

// //     const deletedChapter = await db.chapter.delete({
// //       where: {
// //         id: params.chapterId,
// //       },
// //     });

// //     const publishedChaptersInCourse = await db.chapter.findMany({
// //       where: {
// //         courseId: params.courseId,
// //         isPublished: true,
// //       },
// //     });

// //     if (!publishedChaptersInCourse.length) {
// //       await db.course.update({
// //         where: {
// //           id: params.courseId,
// //         },
// //         data: {
// //           isPublished: false,
// //         },
// //       });
// //     }

// //     return NextResponse.json(deletedChapter);
// //   } catch (error) {
// //     console.log('[CHAPTER_ID_DELETE]', error);
// //     return new NextResponse('Internal Error', { status: 500 });
// //   }
// // }

// export async function PATCH(
//   req: Request,
//   { params }: { params: { courseId: string; chapterId: string } }
// ) {
//   try {
//     const session = await auth();
//     const userId = session?.user.id;
//     const { isPublished, ...values } = await req.json();

//     // console.log("first")
//     if (!userId) {
//       return new NextResponse('Unauthorized', { status: 401 });
//     }

//     const ownCourse = await db.course.findUnique({
//       where: {
//         id: params.courseId,
//         userId,
//       },
//     });

//     if (!ownCourse) {
//       return new NextResponse('Unauthorized', { status: 401 });
//     }

//     const chapter = await db.chapter.update({
//       where: {
//         id: params.chapterId,
//         courseId: params.courseId,
//       },
//       data: {
//         ...values,
//       },
//     });

//     if (values.videoUrl) {
//       const bucket = storage.bucket(process.env.GCS_BUCKET_NAME!);
//       // const file = bucket.file(values.videoUrl as string)
//       const buffer = await values.videoUrl
//       await bucket.file(values.videoUrl).save()
      


//       const existingMuxData = await db.muxData.findFirst({
//         where: {
//           chapterId: params.chapterId,
//         },
//       });

//       if (existingMuxData) {
//         await Video.Assets.del(existingMuxData.assetId);
//         await db.muxData.delete({
//           where: {
//             id: existingMuxData.id,
//           },
//         });
//       }
//       // console.log("two")

//       const asset = await Video.Assets.create({
//         input: values.videoUrl,
//         playback_policy: 'public',
//         test: false,
//       });
//       // console.log("three")

//       await db.muxData.create({
//         data: {
//           chapterId: params.chapterId,
//           assetId: asset.id,
//           playbackId: asset.playback_ids?.[0]?.id,
//         },
//       });
//     }
//     // console.log("four")

//     return NextResponse.json(chapter);
//   } catch (error) {
//     console.log('[COURSES_CHAPTER_ID]', error);
//     return new NextResponse('Internal Error', { status: 500 });
//   }
// }
