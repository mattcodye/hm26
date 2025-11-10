import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';

const app = express();
app.use(cors());
app.use(express.json());

// Supabase config
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://toglkupqryevqyvrnexo.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRvZ2xrdXBxcnlldnF5dnJuZXhvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDEyNzE2MywiZXhwIjoyMDY5NzAzMTYzfQ.pek3NZAY5lqgVGJWRYMkCRDJ14_ziNRIiAv7Zmb97M0';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Health check
app.get('/', (req, res) => {
  res.json({ status: '✅ API running', message: 'Hollywood Mogul 2026 API' });
});

// READ
app.post('/api/read', async (req, res) => {
  try {
    const { table, filters, limit = 1000 } = req.body;
    
    let query = supabase.from(table).select('*');
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        query = query.eq(key, value);
      });
    }
    
    const { data, error, count } = await query.limit(limit);
    
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    
    res.json({ success: true, data, count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// COUNT
app.post('/api/count', async (req, res) => {
  try {
    const { table } = req.body;
    
    const { count, error } = await supabase
      .from(table)
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    
    res.json({ success: true, count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE
app.post('/api/create', async (req, res) => {
  try {
    const { table, data } = req.body;
    
    const { data: insertedData, error } = await supabase
      .from(table)
      .insert(data)
      .select();
    
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    
    res.json({ success: true, data: insertedData });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE
app.post('/api/update', async (req, res) => {
  try {
    const { table, id, data } = req.body;
    
    const { data: updatedData, error } = await supabase
      .from(table)
      .update(data)
      .eq('id', id)
      .select();
    
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    
    res.json({ success: true, data: updatedData });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE
app.post('/api/delete', async (req, res) => {
  try {
    const { table, id } = req.body;
    
    const { error } = await supabase
      .from(table)
      .delete()
      .eq('id', id);
    
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    
    res.json({ success: true, deleted: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🎬 Hollywood Mogul API running on port ${PORT}`);
  console.log(`📡 http://localhost:${PORT}`);
});
