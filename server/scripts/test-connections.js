import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import path from 'path';
import { fileURLToPath } from 'url';

// Load env vars
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

async function testConnections() {
    console.log('Testing connections...');

    // Test OpenAI
    try {
        if (!process.env.OPENAI_API_KEY) throw new Error('OPENAI_API_KEY not found in .env');

        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        await openai.models.list(); // Simple API call
        console.log('✅ OpenAI Connection Successful');
    } catch (error) {
        console.error('❌ OpenAI Connection Failed:', error.message);
    }

    // Test Supabase
    try {
        if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
            throw new Error('SUPABASE_URL or SUPABASE_KEY not found in .env');
        }

        const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
        // Simple auth check (no tables needed yet)
        const { error } = await supabase.auth.getSession();

        if (error) throw error;
        console.log('✅ Supabase Connection Successful');
    } catch (error) {
        console.error('❌ Supabase Connection Failed:', error.message);
    }
}

testConnections();
