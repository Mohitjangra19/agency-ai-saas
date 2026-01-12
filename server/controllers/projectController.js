import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export const getProjects = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('projects')
            .select('*, clients(name)')
            .order('created_at', { ascending: false });

        if (error) throw error;
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const createProject = async (req, res) => {
    try {
        const { client_id, name, description, start_date, estimated_end_date, budget } = req.body;
        const { data, error } = await supabase
            .from('projects')
            .insert([{ client_id, name, description, start_date, estimated_end_date, budget }])
            .select();

        if (error) throw error;
        res.status(201).json(data[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
