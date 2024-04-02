import { redirect } from 'next/navigation';

const SettingsPage = () => {
  return redirect('/teacher/settings/profile');
};

export default SettingsPage;
