import React, {Component} from "react";
import {Text, Platform, StatusBar, View, Animated, Easing, Image, ImageBackground} from "react-native";

import {actions} from "../redux/actions";
import {connect} from "react-redux";
import theme from "../resources/theme.style";
import Config from "../config/Config";

import themeStyle from "../resources/theme.style";
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from "react-native-responsive-screen";
import dimen from "../resources/Dimens";
import FontSize from "../resources/ManageFontSize";
import {BusyIndicator} from "../resources/busy-indicator";
import {LoginScreen} from "./LoginScreen";
import User from "../utilize/User";
import IMEI from "react-native-imei";
import DeviceInfo from "react-native-device-info";
import Utility from "../utilize/Utility";


/**
 * splash page
 */
let imeiNo = "";

class SplashScreen extends Component {

    constructor(props) {
        super(props);

        /*  IMEI.getImei().then(imeiList => {
              console.log(imeiList)
              imeiNo = imeiList[0];
          });*/
    }

    /**
     * redirect to landing screen
     */
    async redirectScreen(userIdVal) {
        console.log("userIdVal", userIdVal);
        if (userIdVal !== null && userIdVal !== "")
            this.props.navigation.replace("SecondTimeLogin");
        else
            this.props.navigation.replace("LoginScreen");
    }


    async componentDidMount() {
        let userIdVal = await User.retrieve(Config.UserId);
        let deviceId = await User.retrieve(Config.DeviceId);
        this.callToken(userIdVal, deviceId);
    }

    async callToken(userIdVal, deviceId) {
        if (deviceId === undefined || deviceId === null || deviceId === "") {
            let uniqueId = await DeviceInfo.getUniqueId();
            if (uniqueId === undefined || uniqueId === null || uniqueId === "") {
                uniqueId = Utility.getCurrentTimeStamp();
            }
            deviceId = uniqueId;
            await User.store(Config.DeviceId, uniqueId);
        }


        Config.commonReq = {
            BROWSER: Platform.OS + " native",
            LATITUDE: "0.0",
            LONGITUDE: '0.0',
            DEVICE: Platform.OS.toUpperCase(),
            IMEI: deviceId,
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

        if (Platform.OS === "android") {
            this.list = [
                this.props.navigation.addListener("focus", () => {
                    StatusBar.setTranslucent(false);
                    StatusBar.setBackgroundColor(theme.OFF_WHITE_COLOR);
                    StatusBar.setBarStyle("dark-content");
                }),
            ];
        }
        await this.getAccessToken(userIdVal);
    }

    async getAccessToken(userIdVal) {
        this.setState({isProgress: true});
        let tokenReq = {
            ACTION: "GET_AUTH_CRED",
        }
        fetch(Config.base_url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(tokenReq),
        })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log('responseJson', responseJson);
                this.setState({isProgress: false});
                if (responseJson != null) {
                    Config.ACCESS_TOKEN = responseJson;
                    console.log("Config.ACCESS_TOKEN", Config.ACCESS_TOKEN);
                    this.redirectScreen(userIdVal);
                }
            })
            .catch((error) => {
                this.setState({isProgress: false});
                return "";
            });
    }

    render() {
        return (
            <View style={styles.viewStyles}>

                <Image
                    source={require("../resources/images/logo_transparent.png")}
                    resizeMode="contain"
                    style={{
                        height: Config.getDeviceWidth() - Config.getDeviceWidth() / 2,
                        width: Config.getDeviceWidth() - Config.getDeviceWidth() / 2,
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
        language: state.accountReducer.lang,
    };
};

export default connect(mapStateToProps)(SplashScreen);

