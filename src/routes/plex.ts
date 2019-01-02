import { Router, Request, Response } from 'express';
import * as multer from 'multer';
import PlexController from '../controllers/plexController';
import plexSecurity from '../middleware/plexSecurity';

const upload = multer({ dest: '/tmp/' });
const plexRouter: Router = Router();
const plexController: PlexController = new PlexController();

// plexRouter.post('/statechange', [upload.single('thumb'), plexSecurity], (req: Request, res: Response) => {plexController.handleStateChange(req, res)});
plexRouter.post('/statechange', (req: Request, res: Response) => {
    console.log("test")});

export default plexRouter;