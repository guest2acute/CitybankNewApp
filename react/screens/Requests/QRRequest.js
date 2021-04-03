import Utility from "../../utilize/Utility";
import Config from "../../config/Config";
import ApiRequest from "../../config/ApiRequest";


export const QRSCANCODE = async (CUSTOMER_DTL_LIST, props) => {
    let request = {
        TYPE: "",
        DATA: "",
        ACTION: "QRSCANCODE",
        CUSTOMER_ID: "45",
        USER_ID: "45",
        ACTIVITY_CD: "14268189",
        REMARKS: "TEST",
        CHANNEL: "M",
        KEY_ID: "SCAN",
        ISLOGGEDIN: "Y",
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
            Utility.alert(props.language.somethingWrong, props.language.ok);
            console.log("error", error);
            return reject(error);
        });
    });
}

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
        CARD_LIST:details.CARD_LIST,
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

