import Utility from "../../utilize/Utility";
import Config from "../../config/Config";
import ApiRequest from "../../config/ApiRequest";

export const VerifyResetPwd = async (isCard, authToken, cityTouchUserId, actNo, resetBy,
                                     transactionPin, cardPin, expiryDate, props, actResult,OTP_TYPE) => {
    console.log("in1");
    let request = {
        DEVICE_ID: await Utility.getDeviceID(),
        USER_ID: cityTouchUserId,
        RESET_BY: resetBy,
        MOBILE_NO: actResult!== null?actResult.MOBILE_NO:"",
        EMAIL_ID: actResult!== null?actResult.EMAIL_ID:"",
        PASS_TYPE: "L",
        ACCT_NO: actNo,
        REQ_FLAG: "R",
        RESET_TYPE: "F",
        REQ_TYPE: "P",
        OTP_TYPE:OTP_TYPE === 0?"S":"E",
        ACTION: "RESETPWD",
        CARD_USER_ID: cityTouchUserId,
        AUTH_TYPE: isCard ? "CP" : "TP",
        AUTH_TOKEN: authToken,
        ...Config.commonReq
    }

    if (isCard) {
        request = {
            ...request,
            CARD_DETAIL: {
                ACCT_NO: actNo,
                CARD_PIN: cardPin,
                EXPIRY_DATE: Utility.reverseString(expiryDate),
            }
        }
    } else {
        request = {...request, TRANSACTION_PIN: transactionPin}
    }

    console.log("requestHello", request);
    return new Promise(async (resolve, reject) => {
        await ApiRequest.apiRequest.callApi(request, {CARD_VERIFY: isCard ? "Y" : "N"}).then(result => {
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


export const GETUSERDTLALLKEYS = async (CUSTOMER_DTL_LIST, props) => {
    let request = {
        DEVICE_ID: await Utility.getDeviceID(),
        CUSTOMER_DTL_LIST: CUSTOMER_DTL_LIST,
        ACTION: "GETUSERDTLALLKEYS",
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