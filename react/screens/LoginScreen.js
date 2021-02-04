import React, {Component} from "react";
import {
    SafeAreaView,
    View,
    Text,
    StatusBar,
    TextInput,
    Platform, TouchableOpacity, Image, ScrollView
} from "react-native";
import themeStyle from "../resources/theme.style";
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from "react-native-responsive-screen";
import dimen from "../resources/Dimens";
import Icon from "react-native-vector-icons/FontAwesome";
import FontSize from "../resources/ManageFontSize";
import {BusyIndicator} from "../resources/busy-indicator";
import {connect} from "react-redux";
import {actions} from "../redux/actions";
import fontStyle from "../resources/FontStyle";
import Utility from "../utilize/Utility";
import CommonStyle from "../resources/CommonStyle";

class LoginScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userid: "",
            passwordTxt: "",
            isProgress: false,
            passwordVisible: false,
            errorTextUid: "",
            errorTextPwd: ""
        };
    }

    /**
     * onSubmit button action
     */

    async onSubmit(language) {
        if (this.state.userid === "") {
            this.setState({errorTextUid: language.require_user_id});
        } else if (this.state.userid.length < 8) {
            this.setState({errorTextUid: language.require_length_user_id});
        } else if (this.state.passwordTxt === "") {
            this.setState({errorTextPwd: language.require_pwd});
        } else {
            /*this.setState({isProgress: true}, () => {
                this.loginRequest(this.state.userid, this.state.passwordTxt);
            })*/
        }
    }

    changeLanguage(langCode) {
        console.log("langCode", langCode);
        this.props.dispatch({
            type: actions.account.CHANGE_LANG,
            payload: {
                langId: langCode,
            },
        });
    }

    userInput(text) {
        if (text.indexOf(" ") !== -1)
            text = text.replace(/\s/g, '');
        this.setState({userid: text, errorTextUid: ""})
    }

    passwordChange(text) {
        if (text.indexOf(" ") !== -1)
            text = text.replace(/\s/g, '');
        this.setState({passwordTxt: text, errorTextPwd: ""})
    }

    render() {
        let language = this.props.language;
        return (
            <View style={{flex: 1, backgroundColor: themeStyle.BG_COLOR}}>
                <SafeAreaView/>
                <View style={CommonStyle.toolbar}>
                    <Text style={{
                        fontFamily: fontStyle.RobotoBold,
                        fontSize: FontSize.getSize(14),
                        flex: 1, color: themeStyle.WHITE
                    }}>{language.login}</Text>
                    <View style={CommonStyle.headerLabel}>
                        <TouchableOpacity
                            onPress={() => this.changeLanguage("en")}
                            style={{
                                height: "100%",
                                justifyContent: "center",
                                backgroundColor: this.props.langId !== "en" ? themeStyle.THEME_COLOR : themeStyle.WHITE,
                            }}>
                            <Text style={[styles.langText, {
                                color: this.props.langId === "en" ? themeStyle.THEME_COLOR : themeStyle.WHITE
                            }]}>{language.language_english}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => this.changeLanguage("bangla")}
                            style={{
                                height: "100%",
                                justifyContent: "center",
                                backgroundColor: this.props.langId === "en" ? themeStyle.THEME_COLOR : themeStyle.WHITE,
                            }}>
                            <Text style={[styles.langText, {
                                color: this.props.langId !== "en" ? themeStyle.THEME_COLOR : themeStyle.WHITE
                            }]}>{language.language_bangla}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <ScrollView style={{flex: 1}}>
                    <View style={{alignItems: "center", justifyContent: "center", marginTop: Utility.setHeight(25)}}>
                        <Image style={{
                            height: Utility.setHeight(50),
                            width: Utility.getDeviceWidth() / 3,
                            marginBottom: Utility.setHeight(30),
                            marginTop: Utility.setHeight(10)
                        }}
                               resizeMode={"contain"}
                               source={require("../resources/images/logo.png")}/>

                        <View style={{
                            borderColor: themeStyle.BORDER,
                            width: Utility.getDeviceWidth() - 30,
                            paddingLeft: Utility.setWidth(20),
                            paddingRight: Utility.setWidth(20),
                            paddingBottom: Utility.setWidth(20),
                            borderRadius: 5,
                            overflow: "hidden",
                            borderWidth: 2,

                        }}>
                            <TextInput
                                selectionColor={themeStyle.THEME_COLOR}
                                style={{
                                    fontSize: FontSize.getSize(13),
                                    fontFamily: fontStyle.RobotoRegular,
                                    paddingBottom: -10
                                }}
                                placeholder={language.user_ID}
                                onChangeText={text => this.userInput(text)}
                                value={this.state.userid}
                                multiline={false}
                                numberOfLines={1}
                                contextMenuHidden={true}
                                placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                                autoCorrect={false}
                                maxLength={12}/>
                            <View style={{borderBottomWidth: 1, borderBottomColor: themeStyle.THEME_COLOR}}/>
                            {this.state.errorTextUid !== "" ?
                                <Text style={{marginLeft:5,color: themeStyle.THEME_COLOR,fontSize: FontSize.getSize(11),
                                    fontFamily: fontStyle.RobotoRegular,}}>{this.state.errorTextUid}</Text> : null}

                            <View style={{
                                height: hp(dimen.dim_h50),
                                marginTop: hp(dimen.dim_h20),
                                flexDirection: "row",
                                borderBottomColor: themeStyle.THEME_COLOR,
                                borderBottomWidth: 1,
                                alignItems: "center",
                            }}>
                                <TextInput
                                    selectionColor={themeStyle.THEME_COLOR}
                                    style={{
                                        fontSize: FontSize.getSize(13),
                                        flex: 1,
                                        fontFamily: fontStyle.RobotoRegular,
                                        paddingBottom: -10
                                    }}

                                    placeholder={language.passwordTxt}
                                    onChangeText={text => this.passwordChange(text)}
                                    value={this.state.passwordTxt}
                                    multiline={false}
                                    numberOfLines={1}
                                    contextMenuHidden={true}
                                    secureTextEntry={!this.state.passwordVisible}
                                    placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                                    autoCorrect={false}
                                />

                                <Icon style={{marginEnd: 10, marginBottom: -10}}
                                      name={this.state.passwordVisible ? "eye" : "eye-slash"}
                                      size={20}
                                      color="#000000" onPress={() => {
                                    this.setState({passwordVisible: !this.state.passwordVisible});
                                }}/>
                            </View>
                            {this.state.errorTextPwd !== "" ?
                                <Text style={{marginLeft:5,color: themeStyle.THEME_COLOR,fontSize: FontSize.getSize(11),
                                    fontFamily: fontStyle.RobotoRegular,}}>{this.state.errorTextPwd}</Text> : null}

                            <View style={{
                                marginTop: hp(dimen.dim_h40),
                                backgroundColor: themeStyle.THEME_COLOR,
                                height: hp(dimen.dim_h48),
                                borderRadius: 5,
                                justifyContent: "center",
                                shadowColor: themeStyle.RED_COLOR,
                                shadowOpacity: 0.5,
                                shadowRadius: 16,
                                shadowOffset: {
                                    height: 6,
                                    width: 2,
                                },
                            }}>
                                <TouchableOpacity
                                    style={{flexDirection: "row", justifyContent: "center", alignItems: "center"}}
                                    disabled={this.state.isProgress}
                                    onPress={() =>
                                        this.onSubmit(language)
                                    }>
                                    <Text style={{
                                        color: "#fff",
                                        fontSize: FontSize.getSize(14),
                                        textAlign: "center",
                                        fontFamily: fontStyle.RobotoBold,
                                    }}>{language.login}</Text>
                                </TouchableOpacity>
                            </View>

                            <Text style={{
                                marginTop: Utility.setHeight(15),
                                alignSelf: "center",
                                fontFamily: fontStyle.RobotoMedium,
                                fontSize: FontSize.getSize(13),
                                color: "#7E4645",
                                textAlign: "center"
                            }}>{language.new_signup}
                                <Text style={{
                                    fontSize: FontSize.getSize(13),
                                    color: "#7E4645",
                                    fontFamily: fontStyle.RobotoMedium,
                                    textDecorationLine: "underline"
                                }}>{language.sign_up_now}
                                </Text>
                            </Text>
                            <Text style={{
                                marginTop: 10, alignSelf: "center", fontFamily: fontStyle.RobotoMedium,
                                fontSize: FontSize.getSize(13), color: "#7E4645", textAlign: "center"
                            }}>{language.fgt_uid_pwd_pin}</Text>

                        </View>
                        <Image style={{
                            alignSelf: "center",
                            marginTop: Utility.setHeight(20),
                            height: Utility.setHeight(80),
                            width: Utility.setWidth(80),
                            marginBottom: Utility.setHeight(20)
                        }} resizeMode={"contain"}
                               source={require("../resources/images/qr_login.jpg")}/>

                    </View>
                </ScrollView>
                <View style={{alignItems: "center", justifyContent: "center"}}>
                    <View
                        style={{flexDirection: "row", alignItems: "center", justifyContent: "center", marginBottom: 5}}>
                        <Text style={styles.optionText}>{language.faqs}</Text>
                        <Text style={styles.dashStyle}>|</Text>
                        <Text style={styles.optionText}>{language.atm_branch}</Text>
                        <Text style={styles.dashStyle}>|</Text>
                        <Text style={styles.optionText}>{language.info}</Text>
                    </View>

                    <View style={{flexDirection: "row"}}>
                        <Text style={styles.optionText}>{language.privacy}</Text>
                        <Text style={styles.dashStyle}>|</Text>
                        <Text style={styles.optionText}>{language.contact}</Text>
                    </View>

                    <Text style={styles.rightReserved}>{language.right_reserved}
                    </Text>
                </View>

                <BusyIndicator visible={this.state.isProgress}/>
            </View>
        );
    }

    componentDidMount() {
        if (Platform.OS === "android") {
            this.focusListener = this.props.navigation.addListener("focus", () => {
                StatusBar.setTranslucent(false);
                StatusBar.setBackgroundColor(themeStyle.THEME_COLOR);
                StatusBar.setBarStyle("light-content");
            });
        }
    }

}

const
    styles = {
        langText: {
            fontFamily: fontStyle.RobotoRegular,
            fontSize: FontSize.getSize(12),
            textAlign: 'center',
            width: Utility.setWidth(45),
        },
        optionText: {
            fontFamily: fontStyle.RobotoMedium, fontSize: FontSize.getSize(12), color: themeStyle.THEME_COLOR
        },
        dashStyle: {
            marginLeft: Utility.setWidth(20),
            fontSize: FontSize.getSize(12),
            marginRight: Utility.setWidth(20),
            color: themeStyle.PLACEHOLDER_COLOR
        },

        rightReserved: {
            marginTop: Utility.setHeight(30),
            marginLeft: Utility.setWidth(10),
            marginRight: Utility.setWidth(10),
            marginBottom: Utility.setHeight(20),
            fontFamily: fontStyle.RobotoRegular, fontSize: FontSize.getSize(9), color: themeStyle.PLACEHOLDER_COLOR
        }
    }


const mapStateToProps = (state) => {
    return {
        langId: state.accountReducer.langId,
        language: state.accountReducer.language,
    };
};

export default connect(mapStateToProps)(LoginScreen);
