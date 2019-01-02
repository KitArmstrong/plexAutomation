import { Request, Response, NextFunction } from 'express';
import * as dotenv from 'dotenv';
dotenv.config();

function isCorrectPlexClient(req: Request, res: Response, next: NextFunction) {
    const payload = JSON.parse(req.body.payload);

    if(payload.Player.uuid === process.env.PLEX_CLIENT_ID) {
        next();
    }
    else {
        res.status(401);
    }
}

export default isCorrectPlexClient;