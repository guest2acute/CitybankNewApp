import Utility from "../../utilize/Utility";
import Config from "../../config/Config";
import ApiRequest from "../../config/ApiRequest";

export const GetUserAuthByUid = async (cityTouchUserId, props) => {
    let request = {
        DEVICE_ID: await Utility.getDeviceID(),
        USER_ID: cityTouchUserId,
        ACTION: "USERVERIFY",
        REQ_FLAG: "R",
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
            Utility.alert(error);
            console.log("error", error);
            return reject(error);
        });
    });
}


export const VerifyAccountCard = async (isCard, actNo, cardPin, expiryDate, props) => {
    let request = {
        ACCT_NO: actNo,
        ACTION: isCard ? "VERIFYCARDGETUID" : "GETUSERALLEXISTS",
        REG_WITH: isCard ? "C" : "A",
        ...Config.commonReq
    }

    if (isCard) {
        request = {
            ...request,
            CARD_DETAIL: {
                ACCT_NO: actNo,
                CARD_PIN: cardPin,
                EXPIRY_DATE: expiryDate.replace("/", ""),
            }
        }
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
            Utility.alert(error);
            console.log("error", error);
            return reject(error);
        });
    });

}


export const MoreDetails = (language) => {
    console.log("moredetails", language.personalise_profile)
    return [
        {
            id: "profile",
            title: language.personalise_profile,
            icon: require("../../resources/images/ic_profile.png"),
            redirectScreen: "Profile",
            subCategory: [],
        },
        {
            id: "UploadDoc",
            title: language.upload_documents,
            icon: require("../../resources/images/ic_credential_management.png"),
            subCategory: [],
            redirectScreen: "UploadSupportDoc"
        },
        {
            id: "Settings",
            title: language.settings,
            icon: require("../../resources/images/ic_settings.png"),
            redirectScreen: "MySettings",
            subCategory: [
                {
                    id: "PINCode",
                    title: language.pin_code,
                    icon: require("../../resources/images/ic_pin_code.png"),
                },
                {
                    id: "UserId",
                    title: language.user_id,
                    icon: require("../../resources/images/ic_login_id.png"),
                    redirectScreen: ""
                },
                {
                    id: "Retina",
                    title: language.retina,
                    icon: require("../../resources/images/ic_credential_management.png"),
                    redirectScreen: ""
                },
                {
                    id: "qrMerchantPayment",
                    title: language.qr_merchant_payment,
                    icon: require("../../resources/images/ic_qr_selected.png"),
                    redirectScreen: ""
                },
            ],
        },
        {
            id: "AccountServices",
            title: language.account_services,
            icon: require("../../resources/images/ic_account_services.png"),
            redirectScreen: "AccountServices",
            subCategory: [
                {
                    id: "FixedDeposit",
                    title: language.fixed_deposit,
                    icon: require("../../resources/images/ic_credit_card.png"),
                    redirectScreen: ""
                },
                {
                    id: "Monthly Deposit",
                    title: language.monthly_Dps,
                    icon: require("../../resources/images/ic_credit_card.png"),
                    redirectScreen: ""
                },
                {
                    id: "Pay Order",
                    title: language.pay_order,
                    icon: require("../../resources/images/ic_credit_card.png"),
                    redirectScreen: ""
                },
                {
                    id: "Positive Pay",
                    title: language.positive_pay,
                    icon: require("../../resources/images/ic_credit_card.png"),
                    redirectScreen: ""
                },
                {
                    id: "ChequeBookManagement",
                    title: language.cheque_book_management,
                    icon: require("../../resources/images/ic_credit_card.png"),
                    redirectScreen: ""
                },
                {
                    id: "TagAccountCityTouch",
                    title: language.tag_account_cityTouch,
                    icon: require("../../resources/images/ic_credit_card.png"),
                    redirectScreen: ""
                },
                {
                    id: "EditAccountPreview",
                    title: language.edit_account_preview,
                    icon: require("../../resources/images/ic_credit_card.png"),
                    redirectScreen: ""
                },
                {
                    id: "RequestMonitor",
                    title: language.request_monitor,
                    icon: require("../../resources/images/ic_credit_card.png"),
                    redirectScreen: ""
                },
            ],
        },
        {
            id: "CardServices",
            title: language.card_services,
            icon: require("../../resources/images/ic_credit_card.png"),
            subCategory: [],
            redirectScreen: "CardServices"
        },
        {
            id: "LoanServices",
            title: language.loan_services,
            icon: require("../../resources/images/ic_bank_loan.png"),
            subCategory: [],
            redirectScreen: "LoanServices"
        },
        {
            id: "credentialManagement",
            title: language.credential_management,
            icon: require("../../resources/images/ic_credential_management.png"),
            redirectScreen: "CredentialManagement",
            subCategory: [
                {
                    id: "changeLoginPassword",
                    title: language.change_login_password,
                    icon: require("../../resources/images/ic_login_password_change.png"),
                    redirectScreen: "ChangeLoginCredential"
                },
                {
                    id: "ChangeTransPin",
                    title: language.change_transaction_password,
                    icon: require("../../resources/images/ic_pin_code.png"),
                    redirectScreen: "ChangeTransPin"
                },
                /*  {
                      id: "forgotTransactionPassword",
                      title: language.forgot_transaction_password,
                      icon: require("../../resources/images/ic_credit_card.png"),
                      redirectScreen: ""
                  },*/
                {
                    id: "changeMobilePin",
                    title: language.change_mobile_pin,
                    icon: require("../../resources/images/ic_pin_code_change.png"),
                    redirectScreen: "ChangeLoginCredential",
                },
            ],
        },
        {
            id: "otherQrFeature",
            title: language.other_qr_feature,
            icon: require("../../resources/images/ic_other_qr.png"),
            subCategory: [],
            redirectScreen: ""
        },
        {
            id: "ChangeContactDetails",
            title: language.change_contact_details,
            icon: require("../../resources/images/contact_icon.png"),
            subCategory: [],
            redirectScreen: "ChangeLoginCredential"
        },
        {
            id: "otpLockUnlock",
            title: language.otp_lock_unlock,
            icon: require("../../resources/images/ic_otp_status_change.png"),
            subCategory: [],
            redirectScreen: ""
        },
        {
            id: "OnlinePurchase",
            title: language.online_purchase,
            icon: require("../../resources/images/ic_shopping_cart.png"),
            subCategory: [],
            redirectScreen: ""
        },
        {
            id: "Enquiry",
            title: language.enquiry,
            icon: require("../../resources/images/ic_enquiry_icon.png"),
            subCategory: [],
            redirectScreen: ""
        },
        {
            id: "RateCityTouch",
            title: language.rate_cityTouch,
            icon: require("../../resources/images/icon_facourite_transfer.png"),
            subCategory: [],
            redirectScreen: ""
        },
        {
            id: "TermCondition",
            title: language.term_condition,
            icon: require("../../resources/images/ic_documents.png"),
            subCategory: [],
            redirectScreen: ""
        },

    ];

}