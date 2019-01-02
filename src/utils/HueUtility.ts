import axios from 'axios';
import * as dotenv from 'dotenv';
dotenv.config();

class HueUtility {
    private hue_api_ip: string;
    private hue_api_username: string;
    private hue_api_endpoint: string;

    constructor(hue_api_ip: string, hue_api_username: string) {
        this.hue_api_ip = hue_api_ip;
        this.hue_api_username = hue_api_username;
        this.hue_api_endpoint = this.hue_api_ip + '/api/' + this.hue_api_username;
    }

    public changeLivingRoomBrightness(brightness: number): boolean {
        let success: boolean;

        axios.put(this.hue_api_endpoint + '/groups/' + process.env.LIVINGROOM_GROUP_ID + '/action', {
            bri: brightness
        })
        .then(response => {
            console.log(response.data);
            success = true;
        })
        .catch(error => {
            console.log(error);
            success = false;
        });
    
        return success;
    }
}

export default HueUtility;