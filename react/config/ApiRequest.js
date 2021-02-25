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
                AUTH_FLAG: "A"
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
                MOBILE_NO: response.MOBILE_NO,
                REQ_TYPE: REQ_TYPE,
                ACTION: action, ...Config.commonReq
            };

            if (action === "GENUPDEMAILMBOTPVERIFY") {
                otpVerifyRequest = {
                    ...otpVerifyRequest, USER_ID: response.USER_ID,
                    REQUEST_CD: response.REQUEST_CD, ACTIVITY_CD: response.ACTIVITY_CD
                };
            } else {
                otpVerifyRequest = {...otpVerifyRequest, ACTIVATION_CD: response.ACTIVATION_CD}
            }

            console.log("otpVerifyRequest", otpVerifyRequest);
            let result = await ApiRequest.apiRequest.callApi(otpVerifyRequest, {});
            if (result.STATUS === "0") {
                console.log("successResponse",JSON.stringify(result));
                return resolve("success");
            } else {
                Utility.errorManage(result.STATUS, result.MESSAGE, props);
                return reject(result.STATUS);
            }

        });

    }


    static apiRequest = new ApiRequest();
}

