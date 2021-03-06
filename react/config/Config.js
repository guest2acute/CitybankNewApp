/**
 * class store important keys and data object
 */

export default class Config {

    /**
     * API Base url
     * @type {string}
     */
    //static base_url = "https://api-ibmb.thecitybank.com/EasyNetProAPIV5-1.0/easynetpro-serv/request";
    //static base_url = "http://192.168.96.174:8085/EasyNetProAPIV5-1.0/easynetpro-serv/request";

    static base_url = "https://uat01.aiplservices.com/EasyNetProAPIV5Wrapper-1.0_dev/easynetpro-serv/request";
    //for qr code check
   // static base_url =  "https://uat01.aiplservices.com/EasyNetProAPIV5Wrapper-1.0_mtz/easynetpro-serv/request";

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

    static ExpiryDateFormat: "MM/YY"

    static CP_AUTH_TYPE = "CP";
    static TP_AUTH_TYPE = "TP";

    static commonReq = {};

    static userRequest = {};

    /*local preference */

    static UserId = "userid";
    static UserName = "userName";
    static LoginPref = "login_preference";
    static BioPinPref = "bio_pin_pref";
    static DeviceId = "deviceId";
    static isFirstTime = "isFirstTime";
    static ActivityCd = "ACTIVITY_CD";
    static Language = "LANGUAGE";


    /*--- end --*/


    static Label = "label";
    static Text = "text";

    static EN = "en";
    static BN = "bn";




}

