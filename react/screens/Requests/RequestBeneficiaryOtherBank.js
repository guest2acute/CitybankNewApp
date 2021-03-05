import Config from "../../config/Config";
import ApiRequest from "../../config/ApiRequest";
import Utility from "../../utilize/Utility";

export const GetBeneBank = async (isCard, actNo, cardPin, expiryDate, props) => {
    let request = {
        ACCT_NO: actNo,
        ACTION: isCard ? "VERIFYCARDGETUID" : "GETUSERALLEXISTS",
        AUTHORIZATION: Config.AUTH,
        REG_WITH: isCard ? "C" : "A",
        ...Config.commonReq
    }

    if (isCard) {
        request = {
            ...request,
            CARD_PIN: cardPin,
            EXPIRY_DATE: expiryDate.replace("/", ""),
        }
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
            Utility.alert(error);
            console.log("error", error);
            return reject(error);
        });
    });
}

