import { getChapter } from '@/actions/get-chapters';
import { auth } from '@/auth';
import { Banner } from '@/components/banner';
import { Preview } from '@/components/preview';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, File } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { CourseEnrollButton } from './_components/course-enroll-button';
import { CourseProgressButton } from './_components/course-progress-button';
import { VideoPlayer } from './_components/chapter-video-player';

const ChapterIdPage = async ({
  params,
}: {
  params: { courseId: string; chapterId: string };
}) => {
  const session = await auth();
  const userId = session?.user.id;
  if (!userId) {
    return redirect('/');
  }

  const {
    chapter,
    course,
    muxData,
    attachments,
    nextChapter,
    userProgress,
    purchase,
  } = await getChapter({
    userId,
    chapterId: params.chapterId,
    courseId: params.courseId,
  });

  if (!chapter || !course) {
    return redirect('/');
  }

  const isLocked = !chapter.isFree && !purchase;
  const completeOnEnd = !!purchase && !userProgress?.isCompleted;

  return (
    <div>
      {userProgress?.isCompleted && (
        <Banner
          variant={'success'}
          label="You already completed this chapter"
        />
      )}
      {isLocked && (
        <Banner
          variant={'warning'}
          label="You need to purchase this course to watch this chapter."
        />
      )}
      <Link
        href={`/courses/${params.courseId}`}
        className="flex items-center text-sm hover:opacity-75 transition m-3"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to course home
      </Link>
      <div className="flex flex-col max-w-6xl mx-auto pb-20">
        <div className="p-4">
          <VideoPlayer
            chapterId={params.chapterId}
            title={chapter.title}
            courseId={params.courseId}
            nextChapterId={nextChapter?.id}
            playbackId={muxData?.playbackId!}
            isLocked={isLocked}
            src={chapter.videoUrl!}
            completeOnEnd={completeOnEnd}
          />
        </div>
        <div>
          <div className="p-4 flex flex-col md:flex-row items-center justify-between ">
            <h2 className="text-2xl font-semibold mb-2">{chapter.title}</h2>
            {purchase ? (
              <CourseProgressButton
                chapterId={params.chapterId}
                courseId={params.courseId}
                nextChapterId={nextChapter?.id}
                isCompleted={!!userProgress?.isCompleted}
              />
            ) : (
              <CourseEnrollButton
                courseId={params.courseId}
                price={course.price!}
              />
            )}
          </div>
          <Separator />
          <div>
            <Preview value={chapter.description!} />
          </div>
          {!!attachments.length && (
            <>
              <Separator />
              <div>
                {attachments.map((attachment) => (
                  <a
                    className="flex items-center p-3 w-full bg-sky-200 border text-sky-700 rounded-md hover:underline"
                    href={attachment.url}
                    key={attachment.id}
                    target="_blank"
                  >
                    <File />
                    <p className="line-clamp-1">{attachment.name}</p>
                  </a>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChapterIdPage;
