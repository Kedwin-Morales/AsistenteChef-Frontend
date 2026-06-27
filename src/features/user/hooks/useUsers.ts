import { useState, useEffect, useCallback } from "react";
import { getUsers, getRoles } from "../services/user.service";
import type { UserDTO, RolDTO } from "../types/user.types";

export function useUsers() {
  const [users, setUsers] = useState<UserDTO[]>([]);
  const [roles, setRoles] = useState<RolDTO[]>([]);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    setLoading(true);
    try {
      const [u, r] = await Promise.all([getUsers(), getRoles()]);
      setUsers(u);
      setRoles(r);
    } catch {
      // handled in page
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { users, roles, loading, refetch };
}
