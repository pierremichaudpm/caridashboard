import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export function useMembres() {
  const [membres, setMembres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMembres = async () => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data, error: err } = await supabase
      .from("membres")
      .select("*")
      .order("nom", { ascending: true });

    if (err) {
      setError(err.message);
    } else {
      setMembres(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMembres();
  }, []);

  return { membres, loading, error, refetch: fetchMembres };
}
