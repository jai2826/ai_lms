const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full flex items-center justify-center bg-gradient-to-br from-violet-500 via-violet-600 to-rose-500">
      {children}
    </div>
  );
};

export default AuthLayout;
