import { useState, useEffect, useCallback } from "react";
import { getRoles } from "../services/role.service";
import type { RoleDTO } from "../types/role.types";

export function useRoles() {
    const [roles, setRoles] = useState<RoleDTO[]>([]);
    const [loading, setLoading] = useState(true);

    const refetch = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getRoles();
            setRoles(data);
        } catch {
            // handled in page
        } finally {
            setLoading(false);
        }
    }, []);

    // useEffect(() => { refetch(); }, [refetch]);
    useEffect(() => {
        let alive = true;
    
        const load = async () => {
          if (!alive) return;
          await refetch();
        };
    
        load();
    
        return () => {
          alive = false;
        };
    }, [refetch]);
    return { roles, loading, refetch };
}
