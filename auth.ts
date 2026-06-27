import { auth as betterAuth } from "@/lib/auth";
import { headers } from "next/headers";

export const auth = async () => {
  const session = await betterAuth.api.getSession({
    headers: await headers(),
  });
  return session;
};
