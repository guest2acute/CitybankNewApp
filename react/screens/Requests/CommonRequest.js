import Utility from "../../utilize/Utility";
import Config from "../../config/Config";
import ApiRequest from "../../config/ApiRequest";
import {Alert} from "react-native";


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
            Utility.alert(props.language.somethingWrong, props.language.ok);
            console.log("error", error);
            return reject(error);
        });
    });
}


export const VerifyAccountCard = async (isCard, actNo, cardPin, expiryDate, otp_type, props) => {
    let request = {
        ACCT_NO: actNo,
        ACTION: isCard ? "VERIFYCARDGETUID" : "GETUSERALLEXISTS",
        REG_WITH: isCard ? "C" : "A",
        OTP_TYPE: otp_type === 0 ? "S" : "E",
        ...Config.commonReq
    }

    if (isCard) {
        request = {
            ...request,
            CARD_DETAIL: {
                ACCT_NO: actNo,
                CARD_PIN: cardPin,
                EXPIRY_DATE: Utility.reverseString(expiryDate),
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
            Utility.alert(props.language.somethingWrong, props.language.ok);
            console.log("error", error);
            return reject(error);
        });
    });
}


export const blockProcess = async (ACCT_NO, userId, description, props, authFlag, actualAction) => {
    console.log("userId", userId);
    return new Promise(async (resolve, reject) => {
        let blockReq = {
            USER_ID: userId ? userId : "",
            ACTION: "BLOCK_CP_PROCESS",
            BLOCK_PROCESS_TYPE: "UPDATE_BLOCK_STATUS",
            ACTUAL_ACTION: "USER_REG_REQ",
            BLOCK_ACTIVITY_DECRIPTION: description,
            ACCT_NO: ACCT_NO,
            UPDATE_BLOCK_STATUS: "Y",
            ACTIVITY_CD: "",
            AUTH_FLAG: authFlag,
            REQUEST_CD: "0",
            BLOCK_STATUS_CHECK: "Y",
            BLOCK_AUTH_STATUS: "N",
            ...Config.commonReq
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

export const RESENDOTP = async (userDetails, otpType, props) => {
    console.log("userDetails", userDetails);
    return new Promise(async (resolve, reject) => {
        let resendReq = {
            USER_ID: userDetails.USER_ID,
            ACTION: "RESENDOTP",
            ACTIVITY_CD: userDetails.ACTIVITY_CD,
            OTP_TYPE: otpType,
            REQUEST_CD: userDetails.REQUEST_CD,
            ...Config.commonReq
        }
        console.log("resendReq", resendReq);
        await ApiRequest.apiRequest.callApi(resendReq, {}).then(result => {
            console.log("resendReqVal", result);
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


export const GETBALANCE = async (accountNo, SOURCE, APPCUSTOMER_ID, props) => {
    return new Promise(async (resolve, reject) => {
        let balanceReq = {
            ACCT_NO: accountNo,
            ACTION: "GETACCTBALDETAIL",
            SOURCE: SOURCE,
            RES_FLAG: "D",
            CURRENCYCODE: "BDT",
            APPCUSTOMER_ID: APPCUSTOMER_ID,
            ...Config.commonReq,
        }

        console.log("balanceReq", balanceReq);
        await ApiRequest.apiRequest.callApi(balanceReq, {}).then(result => {
            console.log("resendReqVal", result);
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


export const MoreDetails = (language) => {
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
            redirectScreen: "SubCategories",
            subCategory: [
                {
                    id: "PINCode",
                    title: language.pin_code,
                    icon: require("../../resources/images/ic_pin_code.png"),
                    redirectScreen: ""
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
                    redirectScreen: "QRMerchantPayment"
                },
            ],
        },
        {
            id: "AccountServices",
            title: language.account_services,
            icon: require("../../resources/images/ic_account_services.png"),
            redirectScreen: "SubCategories",
            subCategory: [
                {
                    id: "FixedDeposit",
                    title: language.fixed_deposit,
                    icon: require("../../resources/images/ic_credit_card.png"),
                    redirectScreen: "FixedDeposit"
                },
                {
                    id: "Monthly Deposit",
                    title: language.monthly_Dps,
                    icon: require("../../resources/images/ic_credit_card.png"),
                    redirectScreen: "MonthlyDPS"
                },
                {
                    id: "Pay Order",
                    title: language.pay_order,
                    icon: require("../../resources/images/ic_pay_order.png"),
                    redirectScreen: "PayOrder"
                },
                {
                    id: "Positive Pay",
                    title: language.positive_pay,
                    icon: require("../../resources/images/ic_positive_pay.png"),
                    redirectScreen: "PositivePay"
                },
                {
                    id: "ChequeBookManagement",
                    title: language.cheque_book_management,
                    icon: require("../../resources/images/ic_cheque_book_management.png"),
                    redirectScreen: "ChequeBookManagement",
                    childCategory: [{
                        id: "ChequeLeafStatus",
                        title: language.cheque_leaf_status,
                        icon: require("../../resources/images/ic_positive_pay.png"),
                        redirectScreen: ""
                    }, {
                        id: "ChequeStopRequest",
                        title: language.Cheque_stop_request,
                        icon: require("../../resources/images/ic_positive_pay.png"),
                        redirectScreen: ""
                    }, {
                        id: "ChequeBookRequest",
                        title: language.cheque_book_request,
                        icon: require("../../resources/images/ic_positive_pay.png"),
                        redirectScreen: ""
                    }, {
                        id: "ChequeBookRequestStatus",
                        title: language.cheque_book_request_status,
                        icon: require("../../resources/images/ic_positive_pay.png"),
                        redirectScreen: ""
                    },
                    ]
                },
                {
                    id: "TagAccountCityTouch",
                    title: language.tag_account_cityTouch,
                    icon: require("../../resources/images/ic_tag_account.png"),
                    redirectScreen: "TagCreditCardInCityTouch"
                },
                {
                    id: "EditAccountPreview",
                    title: language.edit_account_preview,
                    icon: require("../../resources/images/ic_account_preview.png"),
                    redirectScreen: ""
                },
                {
                    id: "RequestMonitor",
                    title: language.request_monitor,
                    icon: require("../../resources/images/ic_credit_card.png"),
                    redirectScreen: "RequestMonitor"
                },
            ],
        },
        {
            id: "CardServices",
            title: language.card_services,
            icon: require("../../resources/images/ic_credit_card.png"),
            redirectScreen: "SubCategories",
            subCategory: [{
                id: "CreditCardActivation",
                title: language.creditCard_title,
                icon: require("../../resources/images/ic_card_active.png"),
                redirectScreen: "CreditCardActivation"
            }, {
                id: "DebitCardActivation",
                title: language.debit_card_activation,
                icon: require("../../resources/images/ic_debit_card_active.png"),
                redirectScreen: "CreditCardActivation"
            }, {
                id: "BlockCreditCard",
                title: language.block_credit_card,
                icon: require("../../resources/images/ic_credit_card_block.png"),
                redirectScreen: "cardBlock"
            }, {
                id: "BlockDebitCard",
                title: language.block_debit_card,
                icon: require("../../resources/images/ic_card_block.png"),
                redirectScreen: "cardBlock"
            }, {
                id: "CardPINReset",
                title: language.card_pin_reset,
                icon: require("../../resources/images/ic_pin_code_change.png"),
                redirectScreen: "CardPinReset"
            }, {
                id: "TagCreditCardInCityTouch",
                title: language.tag_credit_card,
                icon: require("../../resources/images/ic_credit_card.png"),
                redirectScreen: "TagCreditCardInCityTouch"
            }],
        },
        {
            id: "LoanServices",
            title: language.loan_services,
            icon: require("../../resources/images/ic_bank_loan.png"),
            redirectScreen: "SubCategories",
            subCategory:
                [
                    {
                        id: "QuickLoan",
                        title: language.quick_loan,
                        icon: require("../../resources/images/ic_credit_card.png"),
                        redirectScreen: ""
                    },
                    {
                        id: "LoanClosure",
                        title: language.loan_closure,
                        icon: require("../../resources/images/ic_loan_closure.png"),
                        redirectScreen: ""
                    },
                    {
                        id: "RequestMonitor",
                        title: language.request_monitor,
                        icon: require("../../resources/images/ic_monitor.png"),
                        redirectScreen: ""
                    },
                    {
                        id: "EmiCalculator",
                        title: language.emi_calculator,
                        icon: require("../../resources/images/ic_emi_calculator.png"),
                        redirectScreen: ""
                    }
                ],
        }, {
            id: "credentialManagement",
            title: language.credential_management,
            icon: require("../../resources/images/ic_credential_management.png"),
            redirectScreen: "SubCategories",
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
            redirectScreen: "ChangeContactDetails"
        },
        {
            id: "otpLockUnlock",
            title: language.otp_lock_unlock,
            icon: require("../../resources/images/ic_otp_status_change.png"),
            subCategory: [],
            redirectScreen: "OtpLockUnlock"
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
            redirectScreen: "SubCategories",
            subCategory: [
                {
                    id: "CustomerDetails",
                    title: language.customer_details,
                    icon: require("../../resources/images/ic_profile.png"),
                    redirectScreen: ""
                },
                {
                    id: "ScheduleCharges",
                    title: language.schedule_charges,
                    icon: require("../../resources/images/ic_products.png"),
                    redirectScreen: ""
                },
                {
                    id: "Products",
                    title: language.products,
                    icon: require("../../resources/images/ic_products.png"),
                    redirectScreen: ""
                },
                {
                    id: "SubmitQuery",
                    title: language.submit_query,
                    icon: require("../../resources/images/ic_product_services.png"),
                    redirectScreen: ""
                },
                {
                    id: "AtmBranchSearch",
                    title: language.atm_branch_search,
                    icon: require("../../resources/images/case_by_code.png"),
                    redirectScreen: ""
                },
                {
                    id: "ContactCallCenter",
                    title: language.contact_call_center,
                    icon: require("../../resources/images/ic_contact_call_center.png"),
                    redirectScreen: ""
                },
            ],
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
        }]
}

//luhan algorithm
export const validateCard = (cardNumber) => {
    let trimmed = String(cardNumber).replace(/[\s]/g, "")
        , length = trimmed.length
        , odd = false
        , total = 0
        , calc
        , calc2;

    if (!/^[0-9]+$/.test(trimmed)) {
        return false;
    }

    for (let i = length; i > 0; i--) {
        calc = parseInt(trimmed.charAt(i - 1));
        if (!odd) {
            total += calc;
        } else {
            calc2 = calc * 2;

            switch (calc2) {
                case 10:
                    calc2 = 1;
                    break;
                case 12:
                    calc2 = 3;
                    break;
                case 14:
                    calc2 = 5;
                    break;
                case 16:
                    calc2 = 7;
                    break;
                case 18:
                    calc2 = 9;
                    break;
            }
            total += calc2;
        }
        odd = !odd;
    }

    return (total !== 0 && (total % 10) === 0);
}

export const DeviceChange = (result, props) => {
    Alert.alert(
        Config.appName,
        unicodeToChar(result.MESSAGE),
        [
            {
                text: props.language.no_txt
            },
            {
                text: props.language.yes_txt, onPress: () =>
                    props.navigation.navigate("TermConditionScreen",
                        {
                            screen:"deviceChange",
                            showButton: true,
                            deviceChangeRes: result.RESPONSE[0],
                        })
            },
        ]
    );
}

export const unicodeToChar = (text) => {
    return text.replace(/\\u[\dA-F]{4}/gi,
        function (match) {
            return String.fromCharCode(parseInt(match.replace(/\\u/g, ''), 16));
        });
}

export const VERIFYCARDPINDETAIL = async (cardNo, cardPin, props) => {
    let request = {
        ACTION: "VERIFYCARDPINDETAIL",
        ACCT_NO: cardNo,
        CARD_DETAIL: {
            ACCT_NO: cardNo,
            CARD_PIN: cardPin,
        },
        ...Config.commonReq
    }

    console.log("request", request);

    return new Promise(async (resolve, reject) => {
        await ApiRequest.apiRequest.callApi(request, {CARD_VERIFY: "P"}).then(result => {
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



