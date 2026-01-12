import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export const getTasks = async (req, res) => {
    try {
        const { project_id } = req.query;
        let query = supabase.from('tasks').select('*').order('created_at', { ascending: true });

        if (project_id) {
            query = query.eq('project_id', project_id);
        }

        const { data, error } = await query;
        if (error) throw error;
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const createTask = async (req, res) => {
    try {
        const { project_id, title } = req.body;
        const { data, error } = await supabase
            .from('tasks')
            .insert([{ project_id, title, status: 'todo' }])
            .select();

        if (error) throw error;
        res.status(201).json(data[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const { data, error } = await supabase
            .from('tasks')
            .update(updates)
            .eq('id', id)
            .select();

        if (error) throw error;
        res.json(data[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getAllPendingTasksCount = async (req, res) => {
    try {
        const { count, error } = await supabase
            .from('tasks')
            .select('*', { count: 'exact', head: true })
            .neq('status', 'done'); // Count where status is NOT done

        if (error) throw error;
        res.json({ count });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
