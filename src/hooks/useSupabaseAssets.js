import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

// DB(snake_case) → JS(camelCase)
const fromDB = (row) => ({
  id: row.id,
  assetNumber: row.asset_number,
  assetName: row.asset_name,
  acquiredDate: row.acquired_date || '',
  location: row.location || '',
  status: row.status,
  memo: row.memo || '',
  imageUrl: row.image_url || null,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

// JS(camelCase) → DB(snake_case)
const toDB = (item) => ({
  id: item.id,
  asset_number: item.assetNumber,
  asset_name: item.assetName,
  acquired_date: item.acquiredDate || null,
  location: item.location || '',
  status: item.status,
  memo: item.memo || '',
  image_url: item.imageUrl || null,
  created_at: item.createdAt,
  updated_at: item.updatedAt,
});

export function useSupabaseAssets() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('assets')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      console.error('fetchItems error:', error.message);
    } else {
      setItems(data.map(fromDB));
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const addItem = async (item) => {
    const { error } = await supabase.from('assets').insert([toDB(item)]);
    if (error) throw error;
    await fetchItems();
  };

  const updateItem = async (id, formData) => {
    const now = new Date().toISOString();
    const { error } = await supabase
      .from('assets')
      .update({
        asset_number: formData.assetNumber,
        asset_name: formData.assetName,
        acquired_date: formData.acquiredDate || null,
        location: formData.location || '',
        status: formData.status,
        memo: formData.memo || '',
        image_url: formData.imageUrl || null,
        updated_at: now,
      })
      .eq('id', id);
    if (error) throw error;
    await fetchItems();
  };

  const deleteItem = async (id) => {
    const { error } = await supabase.from('assets').delete().eq('id', id);
    if (error) throw error;
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const resetData = async () => {
    const { error } = await supabase.from('assets').delete().not('id', 'is', null);
    if (error) throw error;
    setItems([]);
  };

  const insertMany = async (rows) => {
    const { error } = await supabase.from('assets').insert(rows.map(toDB));
    if (error) throw error;
    await fetchItems();
  };

  return { items, loading, addItem, updateItem, deleteItem, resetData, insertMany };
}
