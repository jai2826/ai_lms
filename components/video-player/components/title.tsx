export function Title({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block flex-1 overflow-hidden text-ellipsis whitespace-nowrap px-2 text-sm font-medium ">
      <span className="mr-1">|</span>
      {children}
    </span>
  );
}
