import axios from 'axios';
import toast from 'react-hot-toast';

export const onSubmitUpdateData = async (values: any, courseId: string) => {
  try {
    await axios.patch(`/api/courses/${courseId}`, values);
    return { success: true };
    // toast.success('Course updated');
    // toggleEdit();
    // router.refresh();
  } catch (error) {
    // toast.error('Something went wrong');
    console.log(error);
    return { success: false };
  }
};
