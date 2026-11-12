import { useEffect, useState } from "react";
import { api } from "../services/api";

export function useLanding() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.getLanding().then(setData).catch(setError);
  }, []);

  return { data, error };
}
