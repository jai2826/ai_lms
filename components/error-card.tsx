
import { CardWrapper } from './auth/card-wrapper';
import { FaExclamationTriangle } from 'react-icons/fa';

export const ErrorCard = () => {
  return (
    <CardWrapper
      headerLabel="Oops! Something went wrong!"
      backButtonhref="/auth/login"
      backButtonLabel="Back to login"
    >
      <div className="w-full items-center flex  justify-center">
        <FaExclamationTriangle className="text-destructive" />
      </div>
    </CardWrapper>
  );
};
