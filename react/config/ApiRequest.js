import axios from "axios";
import Config from "./Config";
import Utility from "../utilize/Utility";

export default class ApiRequest {
    callApi = (tokenReq, header) => {
        return new Promise((resolve, reject) => {
            axios.post(Config.base_url, tokenReq, {
                headers: {
                    "Content-Type": "application/json",
                    ...header
                }
            }).then(response => {
                console.log("response", response.data)
                let result = response.data;
                if(Object.prototype.toString.call(result) === '[object Array]')
                    result = result[0];
                return resolve(result);
            }).catch(error => {
                console.log("error", error);
                return reject(error);
            });
        });
    }

    getAccountDetails = (userDetails, header) => {
        return new Promise(async (resolve, reject) => {
            let actRequest = {
                CUSTOMER_DTL: userDetails.CUSTOMER_DTL_LIST,
                USER_ID: userDetails.USER_ID,
                LOGIN_TYPE: "P",
                ACTION: "GETOPERATIVEACCT",
                DEVICE_ID: await Utility.getDeviceID(),
                AUTH_FLAG: "A"
            }
            console.log("actRequest", actRequest);
            let result = await ApiRequest.apiRequest.callApi(actRequest, header);
            console.log("result", result);
            return resolve(result);
        });
        /* if (result.STATUS === "0") {
             let response = result.RESPONSE[0];
             console.log("response", response);
             this.setState({actNoList: response.ACCOUNT_DTL, isProgress: false});
         } else {
             this.setState({isProgress: false});
             Utility.errorManage(result.STATUS, result.MESSAGE, this.props);
         }*/
    }


    static apiRequest = new ApiRequest();
}

