import Utility from "../../utilize/Utility";
import Config from "../../config/Config";
import ApiRequest from "../../config/ApiRequest";

export const OPERATIVETRNACCT = async (userDetails, SERVICE_TYPE, props) => {
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

export const FUNDTRF = async (request, props) => {
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
        SERVICE: "FUNDTRF",
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
            if (result.STATUS === "0" || result.STATUS === "999") {
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

export const GETAMTLABEL = async (userDetails, TRN_TYPE, props) => {
    let request = {
        USER_ID: userDetails.USER_ID,
        ACTIVITY_CD: userDetails.ACTIVITY_CD,
        ACTION: "GETAMTLABEL",
        TRN_TYPE: TRN_TYPE,
        ...Config.commonReq
    }

    console.log("request", request);
    return new Promise(async (resolve, reject) => {
        await ApiRequest.apiRequest.callApi(request, {}).then(result => {
            console.log("responseVal", result)
            if (result.STATUS === "0" || result.STATUS === "999") {
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

export const EMAILWAITTRFREQ = async (userDetails, props) => {
    let request = {
        USER_ID: userDetails.USER_ID,
        ACTIVITY_CD: userDetails.ACTIVITY_CD,
        ACTION: "EMAILWAITTRFREQ",
        TRN_TYPE: "S",
        ...Config.commonReq
    }

    console.log("request", request);
    return new Promise(async (resolve, reject) => {
        await ApiRequest.apiRequest.callApi(request, {}).then(result => {
            console.log("responseVal", result);
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


export const EMAILRESEND = async (userDetails, REQUEST_CD, props) => {
    let request = {
        USER_ID: userDetails.USER_ID,
        ACTIVITY_CD: userDetails.ACTIVITY_CD,
        ACTION: "EMAILRESEND",
        REQUEST_CD: REQUEST_CD,
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

export const CANCELREQUEST = async (userDetails, REQUEST_CD, remarks, props) => {
    let request = {
        USER_ID: userDetails.USER_ID,
        ACTIVITY_CD: userDetails.ACTIVITY_CD,
        ACTION: "EMAILTRFCANCEL",
        REQUEST_CD: REQUEST_CD,
        REMARKS: remarks,
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
