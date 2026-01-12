import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes/api.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Mount API routes
app.use('/api', apiRoutes);

app.get('/', (req, res) => {
    res.send('Agency AI SaaS API is running');
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
