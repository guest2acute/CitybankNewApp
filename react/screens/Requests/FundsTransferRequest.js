import Utility from "../../utilize/Utility";
import Config from "../../config/Config";
import ApiRequest from "../../config/ApiRequest";

export const OPERATIVETRNACCT = async (userDetails,SERVICE_TYPE, props) => {
    let request = {
        CUSTOMER_ID: userDetails.CUSTOMER_ID,
        USER_ID: userDetails.USER_ID,
        ACTIVITY_CD: userDetails.ACTIVITY_CD,
        AUTH_FLAG: userDetails.AUTH_FLAG,
        ACTION: "OPERATIVETRNACCT",
        SERVICE_TYPE: SERVICE_TYPE,
        ...Config.commonReq
    }
    console.log("request", request);
    return new Promise(async (resolve, reject) => {
        await ApiRequest.apiRequest.callApi(request, {}).then(result => {
            console.log("responseVal", result)
            if (result.STATUS === "0") {
                console.log("successResponse", JSON.stringify(result));
                return resolve(result.RESPONSE);
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

export const FUNDTRF = async (userDetails, TO_ACCT_NO, SERVICE_CHARGE, TRN_AMT,
                              REMARKS, ACCT_NO, NICK_NAME, TO_EMAIL_ID,
                              VAT_CHARGE, TO_IFSCODE, TO_MOBILE_NO, BEN_TYPE, TRN_TYPE, APP_INDICATOR,
                              OTP_TYPE,TO_ACCT_NM, props) => {
    let request = {
        CUSTOMER_ID: userDetails.CUSTOMER_ID,
        USER_ID: userDetails.USER_ID,
        ACTIVITY_CD: userDetails.ACTIVITY_CD,
        TO_ACCT_NO: TO_ACCT_NO,
        SERVICE_CHARGE: SERVICE_CHARGE,
        ACTION: "FUNDTRF",
        TRN_AMT: TRN_AMT,
        REMARKS: REMARKS,
        ACCT_NO: ACCT_NO,
        TO_ACCT_NM: TO_ACCT_NM,
        NICK_NAME: NICK_NAME,
        REQ_FLAG: "R",
        REQ_TYPE: "I",
        TRN_TYPE: TRN_TYPE,
        REF_NO: "",
        TO_MOBILE_NO: TO_MOBILE_NO,
        BEN_TYPE: BEN_TYPE,
        APP_INDICATOR: APP_INDICATOR,
        TO_EMAIL_ID: TO_EMAIL_ID,
        VAT_CHARGE: VAT_CHARGE,
        TO_IFSCODE: TO_IFSCODE,
        OTP_TYPE: OTP_TYPE,
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

export const CHARGEVATAMT = async (userDetails, TRAN_TYPE, SOURCE, ACCT_NO, AMOUNT, props) => {
    let request = {
        USER_ID: userDetails.USER_ID,
        ACTIVITY_CD: userDetails.ACTIVITY_CD,
        TRAN_TYPE: TRAN_TYPE,
        ACTION: "CHARGEVATAMT",
        SOURCE: SOURCE,
        ACCT_NO: ACCT_NO,
        AMOUNT: AMOUNT,
        ...Config.commonReq
    }
    console.log("request", request);
    return new Promise(async (resolve, reject) => {
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
            Utility.alert(props.language.somethingWrong, props.language.ok);
            console.log("error", error);
            return reject(error);
        });
    });
}


export const FUNDTRFOTP = async (userDetails, REQUEST_CD, authFlag, actNo, cPin, tPin, props) => {
    let request = {
        USER_ID: userDetails.USER_ID,
        ACTIVITY_CD: userDetails.ACTIVITY_CD,
        CUSTOMER_ID: userDetails.CUSTOMER_ID,
        AUTH_FLAG: userDetails.AUTH_FLAG,
        ACTION: "SENTOTP",
        SERVICE:"FUNDTRF",
        REQUEST_CD: REQUEST_CD,
        ...Config.commonReq
    }

    if (userDetails.AUTH_FLAG === "CP") {
        request = {
            ...request, CARD_DETAIL: {
                ACCT_NO: actNo,
                CARD_PIN: cPin,
            }
        }
    } else {
        request = {
            ...request, TRANSACTION_PIN: tPin
        }
    }
    console.log("request", request);
    return new Promise(async (resolve, reject) => {
        await ApiRequest.apiRequest.callApi(request, {"CARD_VERIFY": authFlag === "CP" ? "P" : "N"}).then(result => {
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
            Utility.alert(props.language.somethingWrong, props.language.ok);
            console.log("error", error);
            return reject(error);
        });
    });
}

export const FUNDTRFVERIFY = async (userDetails, REQUEST_CD, OTP_NO, props) => {
    let request = {
        USER_ID: userDetails.USER_ID,
        ACTIVITY_CD: userDetails.ACTIVITY_CD,
        CUSTOMER_ID: userDetails.CUSTOMER_ID,
        ACTION: "FUNDTRFVERIFY",
        REQUEST_CD: REQUEST_CD,
        OTP_NO: OTP_NO,
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