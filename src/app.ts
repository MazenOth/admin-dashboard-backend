import express, { Application } from 'express';
import { initializeModels } from './models';
import routes from './routes'; 

const app: Application = express();

app.use(express.json());

app.use(routes);

initializeModels();

export default app;
