import * as dotenv from 'dotenv';
import { Request, Response } from 'express';
import HueUtility from '../utils/HueUtility';
dotenv.config();

enum PlexEvents {
    Play   = 'media.play',
    Pause  = 'media.pause',
    Stop   = 'media.stop',
    Resume = 'media.resume'
}

type RequestPayload = {
    event: PlexEvents
}

class PlexController {
    private hue: HueUtility;

    constructor() {
        this.hue = new HueUtility(process.env.HUE_BRIDGE_IP, process.env.HUE_USERNAME);
    }

    public handleStateChange(req: Request, res: Response): void {
        const payload: RequestPayload = JSON.parse(req.body.payload);

        switch(payload.event) {
            case PlexEvents.Play:
                this.handlePlayEvent();
                break;
            case PlexEvents.Stop:
                this.handleStopEvent();
                break;
            case PlexEvents.Resume:
                this.handleResumeEvent();
                break;
            case PlexEvents.Pause:
                this.handlePauseEvent();
                break;
        }
    }
    
    private handlePlayEvent(): void {
        this.hue.changeLivingRoomBrightness(100);
    }
    
    private handleStopEvent(): void {
        this.hue.changeLivingRoomBrightness(254);
    }
    
    private handleResumeEvent(): void {
        this.hue.changeLivingRoomBrightness(100);
    }
    
    private handlePauseEvent(): void {
        this.hue.changeLivingRoomBrightness(254);
    }
}

export default PlexController;