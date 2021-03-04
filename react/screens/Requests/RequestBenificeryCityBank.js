import Utility from "../../utilize/Utility";
import Config from "../../config/Config";
import ApiRequest from "../../config/ApiRequest";

export const GETACCTBALDETAIL = (accountNo, props) => {
    return new Promise(async (resolve, reject) => {
        let request = {
            ACCT_NO: accountNo,
            RES_FLAG: "D",
            ACTION: "GETACCTBALDETAIL",
            SOURCE: "FINACLE",
            CURRENCYCODE: ""
        }
        console.log("GETACCTBALDETAIL", request);
        await ApiRequest.apiRequest.callApi(request, {}).then(result => {
            console.log("responseVal", result)
            if (result.STATUS === "0") {
                console.log("successResponse", JSON.stringify(result));
                return resolve(result.RESPONSE[0]);
            } else {
                Utility.errorManage(result.STATUS, result.MESSAGE, props);
                console.log("errorResponse", JSON.stringify(result));
                return reject(result.STATUS);
            }
        }).catch(error => {
            Utility.alert(error);
            console.log("error", error);
            return reject(error);
        });

    });


}


export const ADDBENFVERIFY = (accountNo, props) => {
    return new Promise(async (resolve, reject) => {
        let request = {
            USER_ID: accountNo,
            REQUEST_CD: "256",
            TRN_TYPE:"",
            ACTION:"",
            ACTIVITY_CD:""
        }
        console.log("GETACCTBALDETAIL", request);
        await ApiRequest.apiRequest.callApi(request, {}).then(result => {
            console.log("responseVal", result)
            if (result.STATUS === "0") {
                console.log("successResponse", JSON.stringify(result));
                return resolve(result.RESPONSE[0]);
            } else {
                Utility.errorManage(result.STATUS, result.MESSAGE, props);
                console.log("errorResponse", JSON.stringify(result));
                return reject(result.STATUS);
            }
        }).catch(error => {
            Utility.alert(error);
            console.log("error", error);
            return reject(error);
        });

    });


}

