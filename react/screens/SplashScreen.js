import React, {Component} from "react";
import {Platform, StatusBar, View, Image} from "react-native";

import {actions} from "../redux/actions";
import {connect} from "react-redux";
import Config from "../config/Config";
import themeStyle from "../resources/theme.style";
import Utility from "../utilize/Utility";
import {StackActions} from "@react-navigation/native";
import StorageClass from "../utilize/StorageClass";
import * as DeviceInfo from "react-native-device-info";

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
     redirectScreen(loginPref) {
        let screenName = "LoginScreen";
        if (loginPref !== null && parseInt(loginPref) > -1) {
            screenName = "PinLogin";
        }
        this.props.navigation.dispatch(
            StackActions.replace(screenName, {loginPref: loginPref})
        )
    }

     changeLanguage(language) {
        if (language !== null) {
            this.props.dispatch({
                type: actions.account.CHANGE_LANG,
                payload: {
                    langId: language,
                },
            });
            Config.commonReq = {...Config.commonReq,DISPLAY_LANGUAGE: language}
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
            DISPLAY_LANGUAGE: this.props.langId,
            DEVICE_ID: await Utility.getDeviceID(),
        }
        console.log("Config.commonReq ", Config.commonReq);
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

    async initSetup() {
        let loginPref = await StorageClass.retrieve(Config.LoginPref);
        let language = await StorageClass.retrieve(Config.Language);
        await this.callToken();
        await this.changeLanguage(language);
        await this.redirectScreen(loginPref);
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

