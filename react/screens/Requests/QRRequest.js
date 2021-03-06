import Utility from "../../utilize/Utility";
import Config from "../../config/Config";
import ApiRequest from "../../config/ApiRequest";


export const CARDINSERT = async (userDetails, props) => {
    let request = {
        CUSTOMER_ID: userDetails.CUSTOMER_ID,
        USER_ID: userDetails.USER_ID,
        ACTION: "CARDINSERT",
        ACTIVITY_CD: userDetails.ACTIVITY_CD,
        KEY_ID: "VIEW",
        ...Config.commonReq
    }
    console.log("request", request);
    return new Promise(async (resolve, reject) => {
        await ApiRequest.apiRequest.callApi(request, {}).then(result => {
            console.log("responseVal", result);
            if (result.STATUS === "0") {
                console.log("successResponse", JSON.stringify(result));
                return resolve(result);
            } else {
                Utility.errorManage(result.STATUS, result.MESSAGE, props);
                console.log("errorResponse", JSON.stringify(result));
                return reject(result.STATUS);
            }
        }).catch(error => {
            Utility.alert(props.language.somethingWrong, props.language.ok);
            console.log("error", error);
            return reject(error);
        });
    });
}


export const CARDUPDATE = async (userDetails, details, ALLOW_AFTER_LOGIN, BEFORE_LOGIN_SCAN_CNT, props) => {
    let request = {
        CUSTOMER_ID: userDetails.CUSTOMER_ID,
        USER_ID: userDetails.USER_ID,
        ACTION: "CARDUPDATE",
        ACTIVITY_CD: userDetails.ACTIVITY_CD,
        ALLOW_AFTER_LOGIN: ALLOW_AFTER_LOGIN,
        REQUEST_CD: details.REQUEST_CD,
        BEFORE_LOGIN_SCAN_CNT: BEFORE_LOGIN_SCAN_CNT,
        KEY_ID: "VIEW",
        CARD_LIST: details.CARD_LIST,
        ...Config.commonReq
    }
    console.log("request", request);
    return new Promise(async (resolve, reject) => {
        await ApiRequest.apiRequest.callApi(request, {}).then(result => {
            console.log("responseVal", result);
            if (result.STATUS === "0") {
                console.log("successResponse", JSON.stringify(result));
                return resolve(result);
            } else {
                Utility.errorManage(result.STATUS, result.MESSAGE, props);
                console.log("errorResponse", JSON.stringify(result));
                return reject(result.STATUS);
            }
        }).catch(error => {
            Utility.alert(props.language.somethingWrong, props.language.ok);
            console.log("error", error);
            return reject(error);
        });
    });
}

export const QRSCANCODE = async (userDetails, REMARKS, DATA, TYPE,ISLOGGEDIN, props) => {
    let request = {
        TYPE: TYPE,
        USER_ID: userDetails ? userDetails.USER_ID : "",
        CUSTOMER_ID: userDetails ? userDetails.CUSTOMER_ID : "",
        ACTION: "QRSCANCODE",
        ACTIVITY_CD: userDetails ? userDetails.ACTIVITY_CD : "",
        REMARKS: REMARKS,
        DATA: DATA,
        KEY_ID: "SCAN",
        ISLOGGEDIN: ISLOGGEDIN,
        ...Config.commonReq
    }
    console.log("request", request);
    return new Promise(async (resolve, reject) => {
        await ApiRequest.apiRequest.callApi(request, {}).then(result => {
            console.log("responseVal", result);
            if (result.STATUS === "0") {
                console.log("successResponse", JSON.stringify(result));
                if(DATA === "")
                    return resolve(result);
                else
                    return resolve(result.RESPONSE[0]);
            } else {
                Utility.errorManage(result.STATUS, result.MESSAGE, props);
                console.log("errorResponse", JSON.stringify(result));
                return reject(result.STATUS);
            }
        }).catch(error => {
            Utility.alert(props.language.somethingWrong, props.language.ok);
            console.log("error", error);
            return reject(error);
        });
    });
}


export const QRPAYMENT = async (userDetails, QRSTRING,cardDetails, REMARKS,CON_AMOUNT,TIP_AMOUNT,
                                result, props) => {
    let request = {
        ...result,
        USER_ID: userDetails.USER_ID,
        CUSTOMER_ID: userDetails.CUSTOMER_ID,
        ACTION: "QRPAYMENT",
        ACTIVITY_CD: userDetails.ACTIVITY_CD,
        REMARKS: REMARKS,
        QRSTRING: QRSTRING,
        SOURCE_NO: cardDetails.UNMASK_CARD_NO,
        EMAIL_ID: userDetails.EMAIL_ID,
        CARD_TYPE: cardDetails.CARD_TYPE,
        CARD_NAME: cardDetails.CARD_NAME,
        CON_AMOUNT: CON_AMOUNT,
        TIP_AMOUNT: TIP_AMOUNT,
        ...Config.commonReq
    }
    console.log("request", request);
    return new Promise(async (resolve, reject) => {
        await ApiRequest.apiRequest.callApi(request, {}).then(result => {
            console.log("responseVal", result);
            if (result.STATUS === "0") {
                console.log("successResponse", JSON.stringify(result));
                return resolve(result.RESPONSE[0]);
            } else {
                Utility.errorManage(result.STATUS, result.MESSAGE, props);
                console.log("errorResponse", JSON.stringify(result));
                return reject(result.STATUS);
            }
        }).catch(error => {
            Utility.alert(props.language.somethingWrong, props.language.ok);
            console.log("error", error);
            return reject(error);
        });
    });
}

