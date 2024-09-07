import express, { Application } from 'express';
import { initializeModels } from './models';
import routes from './routes';
import cors from "cors";

const app: Application = express();

app.use(express.json());
app.use(cors());

app.use(routes);

initializeModels();

export default app;
