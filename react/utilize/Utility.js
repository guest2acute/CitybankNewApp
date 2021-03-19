import {Alert, BackHandler, Dimensions, Platform, ToastAndroid} from "react-native";
import Config from "../config/Config";
import axios from "axios";
import moment from "moment";
import NetInfo from "@react-native-community/netinfo";
import base64 from 'react-native-base64';
import DeviceInfo from "react-native-device-info";
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from "react-native-responsive-screen";
import {CommonActions} from "@react-navigation/native";
import StorageClass from "./StorageClass";

export default class Utility {
    static alert(msg) {
        Alert.alert(Config.appName, msg);
    }

    static alertWithBack(btn_txt, msg, navigation) {
        Alert.alert(
            Config.appName,
            msg,
            [
                {
                    text: btn_txt, onPress: () => {
                        try {
                            navigation.goBack();
                        } catch (e) {
                            console.log("back button error");
                        }
                    }
                },
            ]
        );
    }

    static verifyUserId(id, language) {
        if (id === "") {
            return language.errorUserId;
        }
        id = id.toLowerCase();
        let number = "0123456789";
        let alphabet = "abcdefghijklmnopqrstuvwxyz";

        let value = "";
        let cn = 0;
        let ca = 0;
        let csp = 0;
        for (let k = 0; k < id.length; k++) {
            if (number.indexOf(id[k]) === -1 && alphabet.indexOf(id[k]) === -1) {
                csp = csp + 1;
            } else if (number.indexOf(id[k]) !== -1) {
                cn = cn + 1;
            } else if (alphabet.indexOf(id[k]) !== -1) {
                ca = ca + 1;
            }
        }
        if (id.length < 8 || id.length > 12) {
            return language.errorLUserID;
        } else if (ca === 0) {
            return language.errorAUserID;
        }
        return "";

    }

    static verifyAccountHolder(text){
        if (text.indexOf("&") !== -1)
            text = text.replace(/&/g, '');
        return text;
    }

    static maskString(value) {
        let updatedStr = "";
        for (let l = 0; l < value.length; l++) {
            if (l > 2 && l < value.length - 3)
                updatedStr += '*';
            else
                updatedStr += value[l];
        }
        return updatedStr;
    }

    static alertConfirm(positive_txt, negative_txt, msg, navigation) {
        Alert.alert(
            Config.appName,
            msg,
            [
                {text: positive_txt, onPress: () => navigation.goBack(null)},
                {text: negative_txt, onPress: () => navigation.goBack(null)},
            ]
        );
    }

    static logout(navigation, language) {
        Alert.alert(
            Config.appName,
            language.logout_confirm,
            [
                {text: language.no_txt},
                {
                    text: language.yes_txt, onPress: async () => {
                        navigation.dispatch(
                            CommonActions.reset({
                                index: 0,
                                routes: [{name: "PinLogin"}],
                            })
                        )
                    }
                },
            ]
        );
    }

    static sessionTimeout(message, language, navigation) {
        Alert.alert(
            Config.appName,
            message,
            [
                {
                    text: language.ok, onPress: async () => {
                        navigation.dispatch(
                            CommonActions.reset({
                                index: 0,
                                routes: [{name: "PinLogin"}],
                            })
                        )
                    }
                },
            ]
        );
    }


    static exitApp(language) {
        Alert.alert(
            Config.appName,
            language.exitConfirm,
            [
                {text: language.no_txt},
                {text: language.yes_txt, onPress: () => BackHandler.exitApp()},
            ]
        );
    }

    static getImage(baseString) {
        return base64.decode("data:image/png;base64," + baseString);
    }

    static validateEmail(text) {
        console.log(text);
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        return reg.test(text);
    }

    static validateUserId(text) {
        let reg = /^(?=.*[A-Za-z])(?=.*\d)$/;
        return reg.test(text);
    }

    static validPassword(text) {
        console.log(text);
        let reg= /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
        return reg.test(text);
    }

    static errorManage(status, message, props) {
        if (status === "99" || status === "1") {
            Utility.alert(message);
        } else if (status === "9") {
            Utility.sessionTimeout(message, props.language, props.navigation);
        } else if (status === "999") {
            Utility.alertWithBack(props.language.ok, message, props.navigation);
        }

    }

    /*  static async makePostApiCall(url,postRequest) {
        const response = await axios.post(Config.base_url+url, {
          email : "cb@gmail.com",
          password: '12346'
        });
      } */

    static userInput(text) {
        if (text.indexOf(" ") !== -1)
            text = text.replace(/\s/g, '');
        return text;
    }


    static input(text, filter) {
        let value = "";
        for (let k = 0; k < text.length; k++) {
            if (filter.indexOf(text[k]) !== -1) {
                value = value + text[k];
            }
        }
        return value;
    }

    static userDecimalInput(text) {
        let numbers = '0123456789.';
        if (text.indexOf(" ") !== -1)
            text = text.replace(/\s/g, '');
        return text;
    }


    static setWidth(val) {
        return wp((val / Utility.getDeviceWidth()) * 100);
    }

    static setHeight(val) {
        return hp((val / Utility.getDeviceHeight()) * 100);
    }


    static async parseResponse(response) {
        console.log("response", response);
    }

    static async makeGetApiCall(url) {
        const response = await axios.get(
            Config.base_url + url,
        );
    }

    static getCurrentTimeStamp() {
        return moment(new Date()).format('DD-MM-YYYY-HH-ss');
    }

    static reverseString(str) {
        let strArr = str.split("/")
        return strArr[1] + strArr[0];
    }

    static dateInFormat(dateVal, formatType) {
        console.log("formatType", formatType);
        return moment(dateVal).format(formatType);
    }

    static isConnected() {
        NetInfo.fetch().then(state => {
            console.log("Connection type", state.type);
            console.log("Is connected?", state.isConnected);
            return state.isConnected;
        });

    }

    static async getDeviceID() {
        let deviceId = await StorageClass.retrieve(Config.DeviceId);
        if (deviceId === undefined || deviceId === null || deviceId === "") {
            let randomNumber = Math.floor(Math.random() * 100) + 1;
            let uniqueId = await DeviceInfo.getUniqueId();
            if (uniqueId === undefined || uniqueId === null || uniqueId === "") {
                uniqueId = Utility.getCurrentTimeStamp() + randomNumber;
            }
            deviceId = uniqueId;
            await StorageClass.store(Config.DeviceId, uniqueId);
        }
        return deviceId;
    }


    static getDeviceWidth() {
        return Math.round(Dimensions.get("window").width);
    }

    static getDeviceHeight() {
        return Math.round(Dimensions.get("window").height);
    }

}
