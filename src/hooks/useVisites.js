import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import * as STATIC from '../data/static-data';

export function useVisites() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        if (!supabase) throw new Error('No Supabase');

        const [daily, services, statuts, monthly, conseillers] = await Promise.all([
          supabase.from('v_stats_daily').select('*'),
          supabase.from('v_stats_services').select('*'),
          supabase.from('v_stats_statuts').select('*'),
          supabase.from('v_stats_monthly').select('*'),
          supabase.from('v_stats_conseillers').select('*'),
        ]);

        if (daily.error || services.error || statuts.error || monthly.error) {
          throw new Error('Supabase query error');
        }

        const totalVisites = monthly.data.reduce((s, m) => s + m.total, 0);
        const totalJours = daily.data.length;

        setData({
          MONTHLY: monthly.data.map(m => ({
            mois: m.mois_court,
            total: m.total,
            rdv: m.rdv,
            sans_rdv: m.sans_rdv,
            nouveau: m.nouveau,
            existant: m.existant,
          })),
          DAILY: daily.data.map(d => ({ date: d.date, count: d.total })),
          SERVICES: services.data.map(s => ({
            name: s.service,
            value: s.total,
            pct: `${s.pct}%`,
          })),
          STATUTS: statuts.data.map(s => ({
            name: s.statut,
            value: s.total,
          })),
          totalVisites,
          totalJours,
          conseillers: conseillers.data || [],
        });
        setIsLive(true);
      } catch {
        setData(STATIC);
        setIsLive(false);
      }
      setLoading(false);
    }
    load();
  }, []);

  return { data, loading, isLive };
}
