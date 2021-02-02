import {Alert, Dimensions, Platform, ToastAndroid} from "react-native";
import Config from "../../config/Config";
import axios from "axios";
import DeviceInfo from "react-native-device-info";
import Utility from "../../utilize/Utility";
import Actions from "./Actions";

export default class ApiRequest {

  /*  static refreshToken= () => {
        return new Promise(res => setTimeout(res, 4000));
    }
*/

    static loginRequest = async (user_id, password) => {
        let uniqueId = await DeviceInfo.getUniqueId();
        if (uniqueId === undefined || uniqueId === null || uniqueId === "") {
            uniqueId = user_id + "-" + Utility.getCurrentTimeStamp();
        }
        console.log("user_id", user_id);
        let loginReq = {
            DEVICE_ID: uniqueId,
            LOGIN_TYPE: "P",
            USER_ID: user_id,
            DUAL_AUTHENTIC: "N",
            ACTION: Actions.LOGIN_REQUEST,
            PASSWORD: password,
            ...Config.commonReq
        };
        await Utility.makePostApiCall(loginReq);
    }


    static veryAccountRequest(reg_with,card_details,signupDetails, authFlag, otp_value, date_of_birth, user_id, uniqueId,account_no,card_pin,expiry_date) {
       console.log("signupDetailsIn",signupDetails);
        return {
            NATIONALITY: signupDetails.NATIONALITY,
            OTP_TYPE: otp_value,
            REG_WITH: reg_with,
            CARD_DETAIL: {
                ACCT_NO: account_no,
                CARD_PIN: card_pin,
                EXPIRY_DATE: expiry_date,
                AUTHORIZATION: {
                    SCOPE: "read trust write",
                    ACCESS_TOKEN: "64b18421-62bf-40ba-9c6d-15883d179a16",
                    REFRESH_TOKEN: "3ace4ef3-6cb2-433c-a795-0dff3d0eb2fb",
                    EXPIRE_TOKEN: "42229"
                }
            },
            AUTH_FLAG: authFlag,
            ACCT_NO: account_no,
            REQ_FLAG: "R",
            BIRTH_DT: date_of_birth,
            CARD_VERIFY: card_details,
            GENDER: signupDetails.GENDER,
            CUSTOM_USER_NM: user_id,
            NID: signupDetails.NID,
            ALL_ACCOUNT_DETAIL: signupDetails.ALL_ACCOUNT_DETAIL,
            PREPAID_CARD: signupDetails.PREPAID_CARD,
            CREDIT_CARD: signupDetails.CREDIT_CARD,
            MAIL_ID: signupDetails.MAIL_ID,
            MOTHERS_NAME: signupDetails.MOTHERS_NAME,
            ACTION: Actions.REGUSER,
            MOBILE_NO: signupDetails.MOBILE_NO,
            CONTITUTION: signupDetails.CONTITUTION,
            TIN: signupDetails.TIN,
            DEBIT_CARD: signupDetails.DEBIT_CARD,
            FATHERS_NAME: signupDetails.FATHERS_NAME,
            CUST_NAME: signupDetails.CUST_NAME,
            PAN_NO: "",
            DEVICE_ID: uniqueId,
            ...Config.commonReq
        };

    }

    static sendOTpSignup(otp, CUSTOMER_ID, ACTIVATION_CD, authFlag, MOBILE_NO, REQ_TYPE) {
        return {
            OTP_NO: otp, CUSTOMER_ID: CUSTOMER_ID, ACTIVATION_CD: ACTIVATION_CD,
            AUTH_FLAG: authFlag, REQ_FLAG: "R", MOBILE_NO: MOBILE_NO,
            REQ_TYPE: REQ_TYPE, ACTION: Actions.REGUSERVERIFY, ...Config.commonReq
        };
    }

    static requestSignup(LOGIN_PIN, TRANSACTION_PIN, CUSTOMER_ID, ACTIVATION_CD, authFlag, MOBILE_NO, REQ_TYPE, PASSWORD) {
        return {
            LOGIN_PIN: LOGIN_PIN,
            TRANSACTION_PIN: TRANSACTION_PIN,
            CUSTOMER_ID: CUSTOMER_ID,
            ACTIVATION_CD: ACTIVATION_CD,
            AUTH_FLAG: authFlag,
            REQ_FLAG: "R",
            MOBILE_NO: MOBILE_NO,
            REQ_TYPE: REQ_TYPE,
            PASSWORD: PASSWORD,
            ACTION: Actions.REGUSERVERIFY, ...Config.commonReq
        };
    }
}
