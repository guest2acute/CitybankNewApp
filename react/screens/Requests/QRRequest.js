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
            Utility.alert(props.language.somethingWrong,props.language.ok);
            console.log("error", error);
            return reject(error);
        });
    });
}