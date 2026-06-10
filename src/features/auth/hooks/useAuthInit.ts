import { useEffect } from "react";
import { useAuthStore } from "../store/auth.store";

export const useAuthInit = () => {
  const accessToken = useAuthStore(s => s.accessToken);
  const setUser = useAuthStore(s => s.setUser);
  const logout = useAuthStore(s => s.logout);

  useEffect(() => {
    if (!accessToken) {
      logout();
      return;
    }
  }, [accessToken, logout, setUser]);
};
