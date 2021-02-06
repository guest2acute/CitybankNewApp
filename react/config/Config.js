/**
 * class store important keys and data object
 */

import {Dimensions, Platform} from "react-native";

export default class Config {


    /**
     * API Base url
     * @type {string}
     */

    static base_url = "https://uat01.aiplservices.com/EasyNetProAPIV5Wrapper-1.0/easynetpro-serv/request";

    /**
     * API Action
     * @type {string}
     */
    static appName = "CityTouch";
    static onBoardURl = "https://uatonboardportal.thecitybank.com/self-onboarding?mn=decrypted&tn=123456789&ln=en";
    static termConditionURl = "https://www.citytouch.com.bd/signup/terms-and-condition#!";
    static faqURl = "";
    static atmBranchURl = "";
    static infoURl = "";
    static contactURl = "";
    static privacyURl = "";
    /**
     * App Version
     */
    static iosAppVersion = "Version 1.0";
    static androidAppVersion = "Version 1.0";
    static apiVersion = "1.0";
    static ACCESS_TOKEN = {};

    static CP_AUTH_TYPE = "CP";
    static TP_AUTH_TYPE = "TP";

    static commonReq = {};


    /*local preference */

    static UserId = "userid";
    static LoginPref = "login_preference";
    static DeviceId = "deviceId";
    static isFirstTime = "isFirstTime";
    static ActivityCd = "ACTIVITY_CD";

    /*--- end --*/



    static Label = "label";
    static Text = "text";


}

