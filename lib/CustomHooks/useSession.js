import { useEffect, useState } from "react";
import { useSession as nextAuthSession } from "next-auth/react";

export const useSession = () => {
  const { data: session, status } = nextAuthSession();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (status !== "loading" && status === "authenticated") {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, [status]);

  return { session: session?.user?.userData, status, isAuthenticated };
};
