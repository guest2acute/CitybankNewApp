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

    async componentDidMount() {
        if (Platform.OS === "android") {
            this.focusListener = this.props.navigation.addListener("focus", () => {
                StatusBar.setTranslucent(false);
                StatusBar.setBackgroundColor(themeStyle.WHITE);
                StatusBar.setBarStyle("dark-content");
            });
        }
        await this.changeLanguage();
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

