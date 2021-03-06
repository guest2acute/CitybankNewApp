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
            CURRENCYCODE: ""
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
            Utility.alert(error);
            console.log("error", error);
            return reject(error);
        });

    });
}


export const AddBeneficiary = (accountRes, userDetails, NICK_NAME, MOBILE_NO, EMAIL_ID, props) => {
    return new Promise(async (resolve, reject) => {
        let request = {
            ACTION: "ADDBENF",
            USER_ID: userDetails.USER_ID,
            BENF_TYPE: "I",
            AUTH_FLAG:userDetails.AUTH_FLAG,
            DEVICE: Platform.OS,
            ACTIVITY_CD: userDetails.ACTIVITY_CD,
            BENE_LIST: [{
                LIMIT_AMT: "0",
                TO_ACCT_NO: accountRes.ACCOUNT,
                NICK_NAME: NICK_NAME,
                TO_ADD1: accountRes.ADDRESS,
                TO_CONTACT_NO: accountRes.CONTACTNUMBER,
                TO_MOBILE_NO: MOBILE_NO,
                TO_EMAIL_ID: EMAIL_ID,
                TO_IFSCODE: "",
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
            Utility.alert(error);
            console.log("error", error);
            return reject(error);
        });

    });


}

