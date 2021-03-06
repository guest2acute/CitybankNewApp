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
                if (Object.prototype.toString.call(result) === '[object Array]')
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
                AUTH_FLAG: "A",
                ...Config.commonReq,
                ...Config.userRequest
            }
            console.log("actRequest", actRequest);
            let result = await ApiRequest.apiRequest.callApi(actRequest, header);
            console.log("result", result);
            return resolve(result);
        });
    }


    veryAccountRequest = (reg_with, card_details, signupDetails, authFlag, otp_value, date_of_birth,
                          user_id, uniqueId, account_no, card_pin, expiry_date, fatherName, motherName, debitCardNo) => {
        console.log("signupDetailsIn", signupDetails);
        return new Promise(async (resolve, reject) => {
            let signupRequest = {
                ...signupDetails,
                OTP_TYPE: otp_value,
                REG_WITH: reg_with,
                CARD_DETAIL: {
                    ACCT_NO: debitCardNo,
                    CARD_PIN: card_pin,
                    EXPIRY_DATE: expiry_date.replace(/\//g, ''),
                    AUTHORIZATION: Config.AUTH
                },
                AUTH_FLAG: authFlag,
                ACCT_NO: account_no,
                REQ_FLAG: "R",
                CARD_VERIFY: card_details,
                CUSTOM_USER_NM: user_id,
                ACTION: "REGUSER",
                PAN_NO: "",
                DEVICE_ID: uniqueId,
                ENTERED_MOBILE_NO: signupDetails.MOBILE_NO,
                ENTERED_EMAIL_ID: signupDetails.MAIL_ID,
                ENTERED_BIRTHDATE: date_of_birth,
                ENTERED_FATHER_NAME: fatherName,
                ENTERED_MOTHER_NAME: motherName,
                ...Config.commonReq
            };

            console.log("signupRequest", signupRequest);
            let result = await ApiRequest.apiRequest.callApi(signupRequest, {});
            console.log("resultAPI", JSON.stringify(result));
            return resolve(result);
        });
    }

    requestSignup = (LOGIN_PIN, TRANSACTION_PIN, CUSTOMER_ID, ACTIVATION_CD, authFlag, MOBILE_NO, REQ_TYPE, PASSWORD, props) => {
        return new Promise(async (resolve, reject) => {
            let request = {
                LOGIN_PIN: LOGIN_PIN,
                TRANSACTION_PIN: TRANSACTION_PIN,
                CUSTOMER_ID: CUSTOMER_ID,
                ACTIVATION_CD: ACTIVATION_CD,
                AUTH_FLAG: authFlag,
                REQ_FLAG: "R",
                MOBILE_NO: MOBILE_NO,
                REQ_TYPE: REQ_TYPE,
                PASSWORD: PASSWORD,
                ACTION: "REGUSERVERIFY", ...Config.commonReq
            };
            console.log("request", request);
            let result = await ApiRequest.apiRequest.callApi(request, {});
            console.log("resultAPI", JSON.stringify(result));
            if (result.STATUS === "21" || result.STATUS === "0") {
                return resolve(result.MESSAGE);
            } else {
                Utility.errorManage(result.STATUS, result.MESSAGE, props);
                return reject(result.STATUS);
            }
        });
    }

    accountVerifyRequest = async (act_no, type, props) => {
        return new Promise(async (resolve, reject) => {
            let request = {
                ACCT_NO: act_no,
                REQ_FLAG: "",
                REG_WITH: type,
                RES_TYPE: "D",
                ACTION: "VERIFYUSERACCT"
            };
            console.log("body", request);

            let result = await ApiRequest.apiRequest.callApi(request, {});
            if (result.STATUS === "0") {
                return resolve(result.RESPONSE[0]);
            } else {
                Utility.errorManage(result.STATUS, result.MESSAGE, props);
                return reject(result.STATUS);
            }
        });
    }


    getOTPCall = async (otpVal, reqFlag, response, AUTH_FLAG, action, REQ_TYPE, props) => {

        return new Promise(async (resolve, reject) => {
            let otpVerifyRequest = {
                OTP_NO: otpVal,
                CUSTOMER_ID: response.CUSTOMER_ID,
                AUTH_FLAG: AUTH_FLAG,
                REQ_FLAG: reqFlag,
                REQ_TYPE: REQ_TYPE,
                ACTIVITY_CD: response.ACTIVITY_CD,
                USER_ID: response.USER_ID?response.USER_ID:"",
                MOBILE_NO: response.MOBILE_NO?response.MOBILE_NO:"",
                REQUEST_CD: response.REQUEST_CD?response.REQUEST_CD:"",
                DEVICE_ID: await Utility.getDeviceID(),
                ACTION: action, ...Config.commonReq
            };

            console.log("otpVerifyRequest", otpVerifyRequest);
            let result = await ApiRequest.apiRequest.callApi(otpVerifyRequest, {});
            if (result.STATUS === "0") {
                console.log("successResponse", JSON.stringify(result));
                return resolve("success");
            } else {
                Utility.errorManage(result.STATUS, result.MESSAGE, props);
                return reject(result.STATUS);
            }

        });

    }


    verifyAccountCard = async (isCard, actCardNumber, pin, expiryDate, response,passType, props) => {
        return new Promise(async (resolve, reject) => {
            let verifyReq = {
                CUSTOMER_ID: response.CUSTOMER_ID.toString(),
                MOBILE_NO:response.MOBILE_NO,
                EMAIL_ID: selectRes.EMAIL_ID,
                USER_ID: response.USER_ID,
                REQ_FLAG: "R",
                PASS_TYPE: passType,
                REQ_TYPE: "A",
                ACCOUNT_NO: actCardNumber,
                DEVICE_ID: await Utility.getDeviceID(),
                ACTIVITY_CD: response.ACTIVITY_CD,
                ACTION: "CHANGEPWD",
                ...Config.commonReq
            }

            if (isCard) {
                verifyReq = {
                    ...verifyReq, CARD_DETAIL: {
                        ACCT_NO: actCardNumber, CARD_PIN: pin,
                        EXPIRY_DATE: expiryDate,
                        AUTHORIZATION: Config.AUTH
                    }, AUTH_FLAG: "CP"
                };
            } else {
                verifyReq = {...verifyReq, TRANSACTION_PIN: pin, AUTH_FLAG: "TP"};
            }
            console.log("verifyReq", verifyReq);
            let result = await ApiRequest.apiRequest.callApi(verifyReq,  {"CARD_VERIFY": isCard ? "Y" : "N"});
            if (result.STATUS === "0") {
                console.log("successResponse", JSON.stringify(result));
                return resolve(result.RESPONSE[0]);
            } else {
                Utility.errorManage(result.STATUS, result.MESSAGE, props);
                return reject(result.STATUS);
            }
        });

    }

    changeCredential = async (isCard, credential, response,passType, props) => {
        return new Promise(async (resolve, reject) => {
            let changeReq = {
                CUSTOMER_ID: response.CUSTOMER_ID.toString(),
                USER_ID: response.USER_ID,
                ACTIVITY_CD: response.ACTIVITY_CD,
                AUTH_FLAG: isCard ? "CP" : "TP",
                REQ_FLAG: "R",
                REQ_TYPE: "P",
                PASS_TYPE: passType,
                REQUEST_CD: response.REQUEST_CD,
                ACTION: "CHANGEPWD",
                PASSWORD: credential,
                ...Config.commonReq
            }

            console.log("changeReq", changeReq);
            let result = await ApiRequest.apiRequest.callApi(changeReq, {});
            if (result.STATUS === "0") {
                console.log("successResponse", JSON.stringify(result));
                return resolve(result);
            } else {
                Utility.errorManage(result.STATUS, result.MESSAGE, props);
                return reject(result.STATUS);
            }
        });

    }


    blockProcess = async (ACCT_NO,response,description,props) => {
        return new Promise(async (resolve, reject) => {
            let blockReq = {
                ACTION: "BLOCK_CP_PROCESS",
                BLOCK_PROCESS_TYPE:"UPDATE_BLOCK_STATUS",
                ACTUAL_ACTION:"USER_REG_REQ",
                BLOCK_ACTIVITY_DECRIPTION:description,
                ACCT_NO:ACCT_NO,
                UPDATE_BLOCK_STATUS:"Y",
                ACTIVITY_CD:"",
                AUTH_FLAG:"USERAUTH",
                REQUEST_CD:"0",
                BLOCK_STATUS_CHECK:"Y",
                BLOCK_AUTH_STATUS:"N"
            }

            console.log("blockReq", blockReq);
            let result = await ApiRequest.apiRequest.callApi(blockReq, {});
            if (result.STATUS === "0") {
                console.log("successResponse", JSON.stringify(result));
                return resolve(result);
            } else {
                Utility.errorManage(result.STATUS, result.MESSAGE, props);
                return reject(result.STATUS);
            }
        });

    }




    static apiRequest = new ApiRequest();
}

