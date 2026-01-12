import express from 'express';
import { predictTimeline, generateContractContent } from '../controllers/aiController.js';
import { getClients, createClient, updateClient } from '../controllers/clientController.js';
import { getProjects, createProject } from '../controllers/projectController.js';
import { getTasks, createTask, updateTask, getAllPendingTasksCount } from '../controllers/taskController.js';

const router = express.Router();
// AI Routes
router.post('/predict-timeline', predictTimeline);
router.post('/generate-contract-content', generateContractContent);

// Client Routes
router.get('/clients', getClients);
router.post('/clients', createClient);
router.put('/clients/:id', updateClient);

// Project Routes
router.get('/projects', getProjects);
router.post('/projects', createProject);

// Task Routes
router.get('/tasks', getTasks);
router.post('/tasks', createTask);
router.put('/tasks/:id', updateTask);
router.get('/tasks/pending-count', getAllPendingTasksCount);

export default router;
