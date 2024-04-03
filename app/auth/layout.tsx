const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full flex items-center justify-center bg-gradient-to-br from-indigo-500 from-15% via-purple-500 via-40% to-rose-500 to-90%">
      {children}
    </div>
  );
};

export default AuthLayout;
