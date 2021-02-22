import React, {Component} from "react";
import {
    Text,
    Platform,
    StatusBar,
    View,
    Animated,
    Easing,
    Image,
    ImageBackground,
    SafeAreaView,
    TouchableOpacity,
} from "react-native";
import {WebView} from "react-native-webview";

import {actions} from "../redux/actions";
import {connect} from "react-redux";
import theme from "../resources/theme.style";
import Config from "../config/Config";
import themeStyle from "../resources/theme.style";
import {heightPercentageToDP as hp} from "react-native-responsive-screen";
import dimen from "../resources/Dimens";
import fontStyle from "../resources/FontStyle";
import FontSize from "../resources/ManageFontSize";
import Utility from "../utilize/Utility";
import CommonStyle from "../resources/CommonStyle";
import {StackActions} from "@react-navigation/native";

let showButton = true, deviceChangeRes;

class TermConditionScreen extends Component {

    constructor(props) {
        super(props);
        showButton = props.route.params.showButton;
        deviceChangeRes = props.route.params.deviceChangeRes ? props.route.params.deviceChangeRes : null;
    }


    async componentDidMount() {
        if (Platform.OS === "android") {
            this._navListener = this.props.navigation.addListener("focus", () => {
                StatusBar.setTranslucent(false);
                StatusBar.setBackgroundColor(theme.THEME_COLOR);
                StatusBar.setBarStyle("light-content");
            });
        }
    }


    render() {
        let language = this.props.language;
        return (
            <View style={styles.viewStyles}>
                <SafeAreaView/>

                <View style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    height: hp(dimen.dim_h60),
                    backgroundColor: theme.THEME_COLOR,
                    alignItems: "center",
                }}>
                    <TouchableOpacity
                        style={{marginStart: 10, width: 40, height: 25, alignItems: "center", justifyContent: "center"}}
                        onPress={() => this.props.navigation.goBack(null)}>
                        <Image style={{width: 15, height: 17, tintColor: theme.WHITE}}
                               source={Platform.OS === "android" ?
                                   require("../resources/images/ic_back_android.png") : require("../resources/images/ic_back_ios.png")}/>
                    </TouchableOpacity>
                    <Text style={{
                        flex: 1,
                        color: theme.WHITE,
                        fontFamily: fontStyle.RobotoMedium,
                        fontSize: FontSize.getSize(16),
                    }}>{language.termsCondition}</Text>
                </View>

                <WebView
                    source={{
                        uri: Config.termConditionURl
                    }}
                    scalesPageToFit={true}
                    /*onLoadEnd={this._onLoadEnd}*/
                />
                {showButton ? <View style={{
                    flexDirection: "row",
                    marginStart: Utility.setWidth(10),
                    marginRight: Utility.setWidth(10),
                    marginTop: Utility.setHeight(20)
                }}>
                    <TouchableOpacity style={{flex: 1}} onPress={() => this.props.navigation.goBack()}>
                        <View style={{
                            flex: 1,
                            alignItems: "center",
                            justifyContent: "center",
                            height: Utility.setHeight(46),
                            borderRadius: Utility.setHeight(23),
                            borderWidth: 1,
                            borderColor: themeStyle.THEME_COLOR
                        }}>
                            <Text
                                style={[CommonStyle.midTextStyle, {color: themeStyle.THEME_COLOR}]}>{language.decline}</Text>
                        </View>
                    </TouchableOpacity>
                    <View style={{width: Utility.setWidth(20)}}/>

                    <TouchableOpacity style={{flex: 1}}
                                      onPress={() =>
                                          this.props.navigation.dispatch(
                                              StackActions.replace("OTPVerification", {deviceChangeRes})
                                          )}>
                        <View style={{
                            alignItems: "center",
                            justifyContent: "center",
                            height: Utility.setHeight(46),
                            borderRadius: Utility.setHeight(23),
                            backgroundColor: themeStyle.THEME_COLOR
                        }}>
                            <Text
                                style={[CommonStyle.midTextStyle, {color: themeStyle.WHITE}]}>{language.accept}</Text>
                        </View>
                    </TouchableOpacity>
                </View> : null}

            </View>

        );
    }
}


const styles = {
    viewStyles: {
        flex: 1,
        backgroundColor: themeStyle.BG_COLOR,
    },

};


const mapStateToProps = (state) => {
    return {
        langId: state.accountReducer.langId,
        language: state.accountReducer.language,
    };
};

export default connect(mapStateToProps)(TermConditionScreen);

