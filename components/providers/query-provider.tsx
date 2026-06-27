// "use client";

// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { AuthProvider } from "@/components/auth/auth-provider";
// import { authClient } from "@/lib/auth-client";
// import Link from "next/link";
// import { useState } from "react";
// import { useRouter } from "next/navigation";

// export function AppProviders({ children }: { children: React.ReactNode }) {
//   const [queryClient] = useState(() => new QueryClient());
//   const router = useRouter();

//   const navigate = ({ to, replace }: { to: string; replace?: boolean }) => {
//     if (replace) {
//       router.replace(to);
//     } else {
//       router.push(to);
//     }
//   };

//   return (
//     <QueryClientProvider client={queryClient}>
//       <AuthProvider authClient={authClient} Link={Link as any} navigate={navigate}>
//         {children}
//       </AuthProvider>
//     </QueryClientProvider>
//   );
// }
