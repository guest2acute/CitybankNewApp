import Utility from "../../utilize/Utility";
import Config from "../../config/Config";
import ApiRequest from "../../config/ApiRequest";
import {Platform} from "react-native";

export const GETACCTBALDETAIL = (accountNo, props) => {
    return new Promise(async (resolve, reject) => {
        let request = {
            ACCT_NO: accountNo,
            RES_FLAG: "D",
            ACTION: "GETACCTBALDETAIL",
            SOURCE: "FINACLE",
            CURRENCYCODE: "",
            ...Config.commonReq
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
            Utility.alert(props.language.somethingWrong, props.language.ok);
            console.log("error", error);
            return reject(error);
        });

    });
}


export const AddBeneficiary = (accountRes, beneType, userDetails, NICK_NAME, MOBILE_NO, EMAIL_ID, ifscCode, props, reqFlag,currency) => {
    console.log("accountRes", accountRes);
    return new Promise(async (resolve, reject) => {
        let request = {
            ACTION: "ADDBENF",
            USER_ID: userDetails.USER_ID,
            BENF_TYPE: beneType,
            DEVICE: Platform.OS,
            ACTIVITY_CD: userDetails.ACTIVITY_CD,
            ...Config.commonReq,
            BENE_LIST: [{
                REQ_FLAG: reqFlag,
                LIMIT_AMT: "0",
                TO_CURRENCY: currency,
                TO_ACCT_NO: accountRes.ACCOUNT,
                NICK_NAME: NICK_NAME,
                TO_ADD1: accountRes.ADDRESS,
                TO_CONTACT_NO: accountRes.CONTACTNUMBER,
                TO_MOBILE_NO: MOBILE_NO,
                TO_EMAIL_ID: EMAIL_ID,
                TO_IFSCODE: ifscCode,
                TO_ACCT_NM: accountRes.ACCOUNTNAME
            }]
        }
        console.log("addBeneficiary", request);
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

export const GETBANKDETAILS = async (userDetails, props, requestType, isCard) => {
    let request = {
        ACTION: "GETBENFBANK",
        ACTIVITY_CD: userDetails.ACTIVITY_CD,
        REQ_TYPE: requestType,
        MOD_TRAN: isCard ? "NPSB" : "ALL",
        USER_ID: userDetails.USER_ID,
        ...Config.commonReq
    }

    if (requestType === "DIST") {
        request = {...request, BANK_CD: userDetails.BANK_CD};
    } else if (requestType === "BRANCH") {
        request = {...request, BANK_CD: userDetails.BANK_CD, DIST_CD: userDetails.DIST_CD};
    }

    console.log("request ", request);

    return new Promise(async (resolve, reject) => {
        await ApiRequest.apiRequest.callApi(request, {}).then(result => {
            console.log("responseVal", result);
            if (result.STATUS === "0") {
                console.log("successResponse", JSON.stringify(result));
                let itemArr = [];
                result.RESPONSE.map((item) => {
                    if (requestType === "DIST")
                        itemArr.push({label: item.DIST_NM, value: item.DIST_CD, details: item});
                    else if (requestType === "BRANCH")
                        itemArr.push({label: item.BRANCH_NM, value: item.BRANCH_CD, details: item});
                    else
                        itemArr.push({label: item.BANK_NM, value: item.BANK_CD, details: item});
                });
                return resolve(itemArr);
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

export const ADDBENFVERIFY = async (userDetails, REQUEST_CD, props, transType, actNo, authFlag, cPin, tPin) => {
    let request = {
        ACCT_NO: actNo,
        ACTION: "ADDBENFVERIFY",
        TRN_TYPE: transType,
        ACTIVITY_CD: userDetails.ACTIVITY_CD,
        REQUEST_CD: REQUEST_CD,
        USER_ID: userDetails.USER_ID,
        AUTH_FLAG: authFlag,
        ...Config.commonReq
    }

    if (authFlag === "CP") {
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


export const VERIFYBKASHAC = async (userDetails, mobileNumber, props) => {
    let request = {
        MOBILE_NUMBER: mobileNumber,
        ACTION: "VERIFYBKASHAC",
        USER_ID: userDetails.USER_ID,
        ACTIVITY_CD: userDetails.ACTIVITY_CD,
        ...Config.commonReq
    }

    console.log("VERIFYBKASHAC", request);
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


export const GETBENF = async (userDetails, benfType, props) => {
    let request = {
        BENF_TYPE: benfType,
        ACTION: "GETBENF",
        USER_ID: userDetails.USER_ID,
        ACTIVITY_CD: userDetails.ACTIVITY_CD,
        ...Config.commonReq
    }

    console.log("GETBENF", request);
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


export const DELETEBENF = async (userDetails, transType, item, props) => {
    let request = {
        TRN_TYPE: transType,
        ACTION: "DELETEBENF",
        USER_ID: userDetails.USER_ID,
        TO_ACCT_NO: item.TO_ACCT_NO,
        TO_IFSCCODE: item.TO_IFSCODE,
        REF_NO: item.REF_NO,
        ACTIVITY_CD: userDetails.ACTIVITY_CD,
        ...Config.commonReq
    }

    console.log("DELETEBENF", request);
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
            Utility.alert(error, language.ok);
            console.log("error", error);
            return reject(error);
        });
    });
}

