import React, {Component} from "react";
import {Platform, StatusBar, View, Image} from "react-native";

import {actions} from "../redux/actions";
import {connect} from "react-redux";
import Config from "../config/Config";
import themeStyle from "../resources/theme.style";
import {LoginScreen} from "./LoginScreen";
import Utility from "../utilize/Utility";
import {StackActions} from "@react-navigation/native";
import StorageClass from "../utilize/StorageClass";
import ApiRequest from "../config/ApiRequest";
import * as DeviceInfo from "react-native-device-info";
/*import CryptoJS from "react-native-crypto-js";*/

/**
 * splash page
 */
let imeiNo = "";

class SplashScreen extends Component {

    constructor(props) {
        super(props);
    }

    /**
     * redirect to landing screen
     */
    async redirectScreen() {
        let loginPref = await StorageClass.retrieve(Config.LoginPref);
        let screenName = "LoginScreen";
        if (loginPref !== null && parseInt(loginPref) > -1) {
            screenName = "PinLogin";
        }

        new Promise((resolve) =>
            setTimeout(
                async () => {
                    this.props.navigation.dispatch(
                        StackActions.replace(screenName, {loginPref: loginPref})
                    )
                },
                1000
            ));

    }

    async changeLanguage() {
        let language = await StorageClass.retrieve(Config.Language);
        if (language !== null) {
            this.props.dispatch({
                type: actions.account.CHANGE_LANG,
                payload: {
                    langId: language,
                },
            });
        }
    }

    async callToken(deviceId) {
        Config.commonReq = {
            BROWSER: Platform.OS + " native",
            LATITUDE: "0.0",
            LONGITUDE: '0.0',
            DEVICE: Platform.OS.toUpperCase(),
            IMEI: await Utility.getDeviceID(),
            DEVICE_IP: await DeviceInfo.getIpAddress(),
            DEVICE_IPV6: await DeviceInfo.getIpAddress(),
            DEVICE_MAC: await DeviceInfo.getMacAddress(),
            DEVICE_NM: await DeviceInfo.getDeviceName(),
            CHANNEL: "M",
            REQ_FLAG: "R",
            DEVICE_USER_NM: await DeviceInfo.getCarrier(),
            VERSION: Config.apiVersion,
        }
        console.log("Config.commonReq ", Config.commonReq);
    }

    async getAuth() {
        let tokenReq = JSON.stringify({
            ACTION: "GET_AUTH_CRED",
        });
        let result = await ApiRequest.apiRequest.callApi(tokenReq, {});
        console.log("result", result);
        Config.AUTH = result;
    }

    async componentDidMount() {
        if (Platform.OS === "android") {
            this.focusListener = this.props.navigation.addListener("focus", () => {
                StatusBar.setTranslucent(false);
                StatusBar.setBackgroundColor(themeStyle.WHITE);
                StatusBar.setBarStyle("dark-content");
            });
        }
        await this.initSetup();
    }

   /* encryptWithKey(){
        let encrypted = CryptoJS.AES.encrypt("Test123", Config.key);
        console.log("Ciphertext (Base64):\n" + encrypted.toString());
        let output = CryptoJS.enc.Hex.parse(encrypted);
        console.log("hex",output);

        // Ciphertext
       // let decrypted = CryptoJS.AES.decrypt(encrypted.toString(), Config.key, { mode: CryptoJS.mode.ECB });
       // console.log("Decrypted:\n" + CryptoJS.enc.Utf8.parse(decrypted)); // Plaintext
    }*/

/*
    encryptFun() {
        let data = "123456";
        let key  = CryptoJS.enc.Latin1.parse(Config.key);
        let iv   = CryptoJS.enc.Latin1.parse(Config.key);
        let encrypted = CryptoJS.AES.encrypt(
            data,
            key,
            {iv:iv,mode:CryptoJS.mode.CBC,padding:CryptoJS.pad.ZeroPadding
            });
        console.log('encrypted: ' + encrypted) ;
        let decrypted = CryptoJS.AES.decrypt(encrypted,key,{iv:iv,padding:CryptoJS.pad.ZeroPadding});
        console.log('decrypted: '+decrypted.toString(CryptoJS.enc.Utf8));
    }
*/


    async initSetup() {
       // let key = CryptoJS.enc.Base64.parse(Config.key);
      // this.encryptWithKey();

        await this.callToken();
        await this.changeLanguage();
        await this.getAuth();
        await this.redirectScreen();
    }

    render() {
        return (
            <View style={styles.viewStyles}>
                <Image
                    source={require("../resources/images/logo_transparent.png")}
                    resizeMode="contain"
                    style={{
                        height: Utility.getDeviceWidth() - Utility.getDeviceWidth() / 2,
                        width: Utility.getDeviceWidth() - Utility.getDeviceWidth() / 2,
                    }}
                />
            </View>
        );
    }
}


const styles = {
    viewStyles: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: themeStyle.BG_COLOR,
    },

};


const mapStateToProps = (state) => {
    return {
        langId: state.accountReducer.langId,
        language: state.accountReducer.language,
    };
};

export default connect(mapStateToProps)(SplashScreen);

