const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full flex items-center flex-col justify-center bg-gradient-to-br from-indigo-500 from-15% via-purple-500 via-40% to-rose-500 to-90%">
      <h1 className="text-2xl font-semibold text-white">
        Please read prerequisite in the project report to access full
        functionality
      </h1>
      {children}
    </div>
  );
};

export default AuthLayout;
