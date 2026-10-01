import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { registerTourNavigation } from "./navigation";

export default function TourBridge() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    return registerTourNavigation(
      (to) => navigate(to),
      () => location.pathname
    );
  }, [navigate, location.pathname]);

  return null;
}
