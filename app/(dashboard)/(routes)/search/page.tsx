import { db } from '@/lib/db';
import { Categories } from './_components/categories';
import { SearchInput } from '@/components/search-input';
import { getCourses } from '@/actions/get-courses';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { CoursesList } from '@/components/courses-list';
import { Preference } from './_components/preferences';
import { PreferredCoursesList } from '@/components/preferred-courses-list';

interface SearchPageProps {
  searchParams: {
    title: string;
    categoryId: string;
  };
}

const SearchPage = async ({ searchParams }: SearchPageProps) => {
  const session = await auth();

  const userId = session?.user.id;

  if (!userId) {
    return redirect('/');
  }

  const categories = await db.category.findMany({
    orderBy: {
      name: 'asc',
    },
  });

  const categoryPreference = await db.categoryPreference.findMany({
    where: {
      userId,
    },
  });
  // console.log(categoryPreference);

  const courses = await getCourses({
    userId,
    ...searchParams,
  });

  const preferredCourses = courses.filter((item) => {
    if (
      categoryPreference.some((item2) => item2.categoryId === item.categoryId)
    )
      return item;
  });

  return (
    <>
      {categoryPreference.length === 0 ? (
        <Preference items={categories} />
      ) : (
        <>
          <div className="px-6 pt-6 md:hidden md:mb-0 block">
            <SearchInput />
          </div>
          <div className="p-6 space-y-4">
            <Categories items={categories} />
            <CoursesList items={courses} />
            <PreferredCoursesList items={preferredCourses} />
          </div>
        </>
      )}
    </>
  );
};

export default SearchPage;
