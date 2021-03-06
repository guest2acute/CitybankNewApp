import Config from "../../config/Config";
import ApiRequest from "../../config/ApiRequest";
import Utility from "../../utilize/Utility";

export const GetBeneBank = async (userDetails, props, requestType) => {
    let request = {
        ACTION: "GETBENFBANK",
        ACTIVITY_CD: userDetails.ACTIVITY_CD,
        REQ_TYPE: "BANK",
        MOD_TRAN: "ALL",
        USER_ID: userDetails.USER_ID,
        ...Config.commonReq
    }

    console.log("request", request);

    return new Promise(async (resolve, reject) => {
        await ApiRequest.apiRequest.callApi(request, {}).then(result => {
            console.log("responseVal", result)
            if (result.STATUS === "0") {
                console.log("successResponse", JSON.stringify(result));
                return resolve(result);
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

