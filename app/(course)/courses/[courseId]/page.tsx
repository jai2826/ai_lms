
import { Preview } from '@/components/preview';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { currentUser } from '@/lib/currentUser';
import { db } from '@/lib/db';
import { cn } from '@/lib/utils';
import { SocialsType } from '@prisma/client';
import { CheckCircle, File, Lock } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { IconType } from 'react-icons';
import {
  FaFacebookSquare,
  FaInstagramSquare,
  FaRedditSquare,
  FaSnapchatSquare,
  FaWhatsappSquare,
} from 'react-icons/fa';
import {
  FaDiscord,
  FaGithub,
  FaLinkedin,
  FaSquareThreads,
  FaSquareXTwitter,
  FaYoutube,
} from 'react-icons/fa6';
import { CourseVideoPlayer } from './_components/course-video-player';
import { CourseEnrollButton } from './chapters/[chapterId]/_components/course-enroll-button';
import { useEffect } from 'react';

const iconMap: Record<SocialsType['name'], IconType> = {
  Github: FaGithub,
  Youtube: FaYoutube,
  Instagram: FaInstagramSquare,
  'X (Twitter)': FaSquareXTwitter,
  Facebook: FaFacebookSquare,
  Threads: FaSquareThreads,
  Whatsapp: FaWhatsappSquare,
  Linkedin: FaLinkedin,
  Reddit: FaRedditSquare,
  Discord: FaDiscord,
  Snapchat: FaSnapchatSquare,
};
const colorMap: Record<SocialsType['name'], string> = {
  Github: 'text-black',
  Youtube: 'text-[#FF0000]',
  Instagram: 'text-[#E4405F]',
  'X (Twitter)': 'text-black',
  Facebook: 'text-[#1877F2]',
  Threads: 'text-black',
  Whatsapp: 'text-[#25D366]',
  Linkedin: 'text-[#0077B5]',
  Reddit: 'text-[#FF4500]',
  Discord: 'text-[#5865F2]',
  Snapchat: 'text-[#FFFC00] ',
};

const CourseIdPage = async ({ params }: { params: { courseId: string } }) => {
  const course = await db.course.findUnique({
    where: {
      id: params.courseId,
    },
    include: {
      muxData: true,
      attachments: {
        orderBy: {
          createdAt: 'desc',
        },
      },
      socials: {
        orderBy: {
          position: 'asc',
        },
        include: {
          socialsType: true,
        },
      },
      chapters: {
        where: {
          isPublished: true,
        },
        orderBy: {
          position: 'asc',
        },
      },
    },
  });
  
  if (!course) {
    return redirect('/');
  }
  const user = await currentUser();
  if (!user || !user.id) {
    return redirect('/');
  }
  const purchase = await db.purchase.findUnique({
    where: {
      userId_courseId: {
        userId: user?.id,
        courseId: course.id,
      },
    },
  });

  return (
    <div className="flex items-center flex-col xl:flex-row xl:items-start  w-full">
      <div className="flex flex-col w-full xl:w-3/5 2xl:w-2/3 pb-20">
        <div className="p-4">
          <CourseVideoPlayer
            title={course.title}
            courseId={params.courseId}
            playbackId={course.muxData?.playbackId!}
            src={course.introUrl!}
          />
        </div>
        <div>
          <div className="p-4 flex flex-col md:flex-row items-center justify-between ">
            <h2 className="text-2xl font-semibold mb-2">{course.title}</h2>
            {!purchase && (
              <CourseEnrollButton
                courseId={params.courseId}
                price={course.price!}
              />
            )}
            {purchase && (
              <Button className="w-full md:w-auto" size="sm">
                <Link
                  href={`/courses/${course.id}/chapters/${course.chapters[0].id}`}
                >
                  Start the course
                </Link>
              </Button>
            )}
          </div>
          <Separator />
          <div>
            <Preview value={course.description!} />
          </div>
          {purchase && !!course.attachments.length && (
            <>
              <Separator />
              <div>
                {course.attachments.map((attachment) => (
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
      <div className="w-full xl:w-2/5 2xl:w-1/3 p-4">
        <Card className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-md">
          <CardHeader className="text-xl font-semibold   ">
            Ready to Start Learning
          </CardHeader>
          <CardContent className="w-full">
            {!purchase ? (
              <CourseEnrollButton courseId={course.id} price={course.price!} />
            ) : (
              <div className="flex text-xl gap-x-2 bg-green-500 w-fit px-2 py-1 rounded-md ">
                Already Enrolled
                <CheckCircle />
              </div>
            )}
          </CardContent>
          <CardFooter>
            <div className="grid grid-cols-4 lg:grid-cols-5 xl:grid-cols-3 lg gap-x-2 gap-y-2 w-full ">
              {course.socials.map((item) => {
                const Icon = iconMap[item.socialsType.name];
                return (
                  <div
                    key={item.id}
                    className="relative bg-white rounded-md h-28 w-full flex flex-col p-1 group "
                  >
                    {!purchase && item.isLocked && (
                      <div className="absolute rounded-md inset-0 hidden items-center justify-center group-hover:flex transition-all duration-1000 ease-in-out bg-purple-500">
                        <Lock className="h-8 w-8" />
                      </div>
                    )}
                    <Link
                      href={item.link}
                      target="_blank"
                      className="h-4/5 transition"
                    >
                      <Icon
                        className={cn(
                          'h-full w-full',
                          colorMap[item.socialsType.name]
                        )}
                      />
                    </Link>
                    <p className="text-center text-sm truncate">{item.name}</p>
                  </div>
                );
              })}
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default CourseIdPage;
