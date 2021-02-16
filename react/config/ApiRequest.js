import axios from "axios";
import Config from "./Config";

export default class ApiRequest {


    callApi = (tokenReq) => {
        return new Promise((resolve, reject) => {
            axios.post(Config.base_url, tokenReq, {
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(response => {
                console.log("response", response.data)
                return resolve(response.data);
            }).catch(error => {
                console.log("error", error);
                return reject(error);
            });
        });
    }


    static apiRequest = new ApiRequest();

}

