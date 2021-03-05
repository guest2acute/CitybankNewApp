import Utility from "../../utilize/Utility";
import Config from "../../config/Config";
import ApiRequest from "../../config/ApiRequest";

export const VerifyResetPwd = async (isCard, cityTouchUserId, actNo, resetBy,transactionPin, props) => {
    console.log("in1");
    let request = {
        DEVICE_ID: await Utility.getDeviceID(),
        USER_ID: cityTouchUserId,
        RESET_BY: resetBy,
        AUTH_TOKEN: Config.AUTH!==null?Config.AUTH.ACCESS_TOKEN:"",
        PASS_TYPE: "L",
        ACCT_NO: actNo,
        REQ_FLAG: "R",
        RESET_TYPE: "F",
        REQ_TYPE: "P",
        ACTION: "RESETPWD",
        CARD_USER_ID: cityTouchUserId,
        AUTH_TYPE: isCard ? "CP" : "TP",
        ...Config.commonReq
    }
    if (!isCard) {
        request = {...request, TRANSACTION_PIN: transactionPin}
    }
    console.log("in2")
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