import { Separator } from '@/components/ui/separator';
import { TeacherSettingsSidebar } from './_components/TeacherSettingsSidebar';

const TeacherSettingsLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col lg:flex-row md:p-5 justify-center mx-auto">
      <TeacherSettingsSidebar />
      <Separator orientation="vertical" className="h-[600px] hidden lg:block" />
      <Separator orientation="horizontal" className=" lg:hidden " />
      <div className="p-2">{children}</div>
    </div>
  );
};

export default TeacherSettingsLayout;
