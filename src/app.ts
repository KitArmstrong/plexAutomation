import * as express from 'express';
import { Application } from 'express';
import * as dotenv from 'dotenv';
import plexRouter from './routes/plex';
dotenv.config();

const app: Application = express();

app.use('/plex', plexRouter);

app.listen(process.env.PORT || 8051);
