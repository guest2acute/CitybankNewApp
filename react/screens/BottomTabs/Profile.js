import {connect} from "react-redux";
import {
    SafeAreaView,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
    Image,
    TextInput, FlatList, Platform, StatusBar, BackHandler
} from "react-native";
import themeStyle from "../../resources/theme.style";
import CommonStyle from "../../resources/CommonStyle";
import React, {Component} from "react";
import {BusyIndicator} from "../../resources/busy-indicator";
import Utility from "../../utilize/Utility";
import StorageClass from "../../utilize/StorageClass";
import Config from "../../config/Config";
import {actions} from "../../redux/actions";
import FingerprintScanner from "react-native-fingerprint-scanner";
import ApiRequest from "../../config/ApiRequest";

class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            transactionPin: "",
            confirmTransactionPin: "",
            alias: "",
            customerName: "",
            mobileNo: "",
            emailTxt: "",
            loginPin: "",
            errorLoginPIN: "",
            conf_loginPin: "",
            errorConfLoginPIN: "",
            errorTransPIN: "",
            errorConfTransPIN: "",
            biometryType: null,
            prefOption: true
        }
        this.checkFingerTouch();
    }

    checkFingerTouch() {
        FingerprintScanner.isSensorAvailable()
            .then((biometryType) => {
                this.setState({prefOption: true});
            })
            .catch((error) => {
                this.setState({prefOption: false});
                console.log("isSensorAvailable error => ", error)
            });
    }

    accountNoOption(language) {
        return (<View key={"accountNoOption"}>
            <View style={{
                flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                marginEnd: 10,
            }}>
                <Text style={[CommonStyle.textStyle]}>
                    {language.alias}
                </Text>
                <TextInput
                    selectionColor={themeStyle.THEME_COLOR}
                    style={[CommonStyle.textStyle, {
                        alignItems: "flex-end",
                        textAlign: 'right',
                        flex: 1,
                        marginLeft: 10
                    }]}
                    placeholder={language.et_alias}
                    onChangeText={text => this.setState({alias: text})}
                    value={this.state.alias}
                    multiline={false}
                    numberOfLines={1}
                    contextMenuHidden={true}
                    placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                    autoCorrect={false}
                />
            </View>

            <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
            <View>
                <View style={{
                    flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                    marginEnd: 10,
                }}>
                    <Text style={[CommonStyle.textStyle]}>
                        {language.customerName}
                    </Text>
                    <TextInput
                        selectionColor={themeStyle.THEME_COLOR}
                        style={[CommonStyle.textStyle, {
                            alignItems: "flex-end",
                            textAlign: 'right',
                            flex: 1,
                            marginLeft: 10
                        }]}
                        editable={false}
                        value={this.state.customerName}
                        multiline={false}
                        numberOfLines={1}
                        contextMenuHidden={true}
                        placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                        autoCorrect={false}/>
                </View>
            </View>
            <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
            <View>
                <View style={{
                    flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                    marginEnd: 10,
                }}>
                    <Text style={[CommonStyle.textStyle]}>
                        {language.mobileNo}
                    </Text>
                    <TextInput
                        selectionColor={themeStyle.THEME_COLOR}
                        style={[CommonStyle.textStyle, {
                            alignItems: "flex-end",
                            textAlign: 'right',
                            flex: 1,
                            marginLeft: 10
                        }]}
                        editable={false}
                        value={this.state.mobileNo}
                        multiline={false}
                        numberOfLines={1}
                        contextMenuHidden={true}
                        keyboardType={"number-pad"}
                        autoCorrect={false}
                        maxLength={13}/>
                </View>
            </View>
            <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
            <View>
                <View style={{
                    flexDirection: "row",
                    marginStart: 10,
                    height: Utility.setHeight(50),
                    alignItems: "center",
                    marginEnd: 10,
                }}>
                    <Text style={[CommonStyle.textStyle]}>
                        {language.email_txt}
                    </Text>
                    <TextInput
                        selectionColor={themeStyle.THEME_COLOR}
                        style={[CommonStyle.textStyle, {
                            alignItems: "flex-end",
                            textAlign: 'right',
                            flex: 1,
                            marginLeft: 10
                        }]}
                        editable={false}
                        value={this.state.emailTxt}
                        multiline={false}
                        numberOfLines={1}
                        contextMenuHidden={true}
                        autoCorrect={false}/>
                </View>
            </View>
            <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>

        </View>)
    }


    async onSubmit(language, navigation) {
        await this.updateUserRequest(navigation);
    }

    async updateUserRequest(navigation) {
        let userDetails = this.props.userDetails;
        this.setState({isProgress: true});
        let userRequest = {
            PERSON_NICKNAME: this.state.alias,
            CUSTOMER_ID: userDetails.CUSTOMER_ID.toString(),
            USER_ID: userDetails.USER_ID,
            UPD_FLAG: "N",
            REQ_FLAG: "R",
            PROFILE_IMG: userDetails.USER_ID,
            ACTION: "USERPROFILEUPDATE",
            ACTIVITY_CD: userDetails.ACTIVITY_CD,
            LANGUAGE: this.props.langId === "en" ? "E" : "B",
            ...Config.commonReq
        };
        console.log("request", userRequest);
        let result = await ApiRequest.apiRequest.callApi(userRequest, {});
        console.log("result", result);
        // result = result[0];
        this.setState({isProgress: false});
        if (result.STATUS === "0") {
            //await StorageClass.store(Config.LoginPref, this.state.loginPrefVal);
            Utility.alert(result.MESSAGE,this.props.language.ok);
        } else {
            Utility.errorManage(result.STATUS, result.MESSAGE, this.props);
        }
    }

    async getUserDetails() {
        let userDetails = this.props.userDetails;
        this.setState({isProgress: true});
        let getUserRequest = {
            CUSTOMER_ID: userDetails.CUSTOMER_ID.toString(),
            USER_ID: userDetails.USER_ID,
            MOBILE_NO: "",
            REQUEST_CD: userDetails.REQUEST_CD,
            REQ_FLAG: "R",
            ACTIVITY_CD: userDetails.ACTIVITY_CD,
            ACTION: "GETUSERPROFILEDTL",
            ...Config.commonReq
        };
        console.log("request", getUserRequest);
        let result = await ApiRequest.apiRequest.callApi(getUserRequest, {});

        //result = result[0];
        this.setState({isProgress: false});
        if (result.STATUS === "0") {
            let response = result.RESPONSE[0];
            console.log("result", result.RESPONSE[0]);
            this.setState({
                alias: response.PERSON_NICKNAME,
                customerName: response.PERSON_NAME,
                mobileNo: response.MOBILE_NO,
                emailTxt: response.EMAIL_ID,
            });
        } else {
            Utility.errorManage(result.STATUS, result.MESSAGE, this.props);
        }
    }


    async changeLanguage(props, langCode) {
        console.log("langCode", langCode);
        await StorageClass.store(Config.Language, langCode);
        props.dispatch({
            type: actions.account.CHANGE_LANG,
            payload: {
                langId: langCode,
            },
        });
        Config.commonReq = {...Config.commonReq,DISPLAY_LANGUAGE: langCode}
    }

    render() {
        let language = this.props.language;
        return (
            <View style={{flex: 1, backgroundColor: themeStyle.BG_COLOR}}>
                <SafeAreaView/>
                <View style={CommonStyle.toolbar}>
                    <TouchableOpacity
                        style={CommonStyle.toolbar_back_btn_touch}
                        onPress={() => this.props.navigation.goBack(null)}>
                        <Image style={CommonStyle.toolbar_back_btn}
                               source={Platform.OS === "android" ?
                                   require("../../resources/images/ic_back_android.png") : require("../../resources/images/ic_back_ios.png")}/>
                    </TouchableOpacity>
                    <Text style={CommonStyle.title}>{language.personalise_profile}</Text>

                    <View style={CommonStyle.headerLabel}>
                        <TouchableOpacity
                            onPress={() => this.changeLanguage(this.props, Config.EN)}
                            style={{
                                height: "100%",
                                justifyContent: "center",
                                backgroundColor: this.props.langId !== "en" ? themeStyle.THEME_COLOR : themeStyle.WHITE,
                            }}>
                            <Text style={[CommonStyle.langText, {
                                color: this.props.langId === "en" ? themeStyle.THEME_COLOR : themeStyle.WHITE
                            }]}>{language.language_english}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => this.changeLanguage(this.props, Config.BN)}
                            style={{
                                height: "100%",
                                justifyContent: "center",
                                backgroundColor: this.props.langId === "en" ? themeStyle.THEME_COLOR : themeStyle.WHITE,
                            }}>
                            <Text style={[CommonStyle.langText, {
                                color: this.props.langId !== "en" ? themeStyle.THEME_COLOR : themeStyle.WHITE
                            }]}>{language.language_bangla}</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{flex: 1, paddingBottom: 30}}>
                        <Text style={[CommonStyle.labelStyle, {
                            color: themeStyle.THEME_COLOR,
                            marginStart: 10,
                            marginEnd: 10,
                            marginTop: 6,
                            marginBottom: 4
                        }]}>
                            {language.config_information}
                        </Text>
                        {this.accountNoOption(language)}
                        <View style={{
                            flexDirection: "row",
                            marginStart: Utility.setWidth(10),
                            marginRight: Utility.setWidth(10),
                            marginTop: Utility.setHeight(20)
                        }}>
                            <TouchableOpacity style={{flex: 1}}
                                              onPress={() => this.onSubmit(language, this.props.navigation)}>
                                <View style={{
                                    flex: 1,
                                    alignSelf: "center",
                                    justifyContent: "center",
                                    height: Utility.setHeight(46),
                                    width: Utility.getDeviceWidth() / 2.5,
                                    borderRadius: Utility.setHeight(23),
                                    backgroundColor: themeStyle.THEME_COLOR
                                }}>
                                    <Text
                                        style={[CommonStyle.midTextStyle, {
                                            color: themeStyle.WHITE,
                                            textAlign: "center"
                                        }]}>{language.submit}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
                <BusyIndicator visible={this.state.isProgress}/>
            </View>
        )
    }

    backAction = () => {
        this.props.navigation.goBack();
        return true;
    }

    async componentDidMount() {
        if (Platform.OS === "android") {
            this.focusListener = this.props.navigation.addListener("focus", () => {
                StatusBar.setTranslucent(false);
                StatusBar.setBackgroundColor(themeStyle.THEME_COLOR);
                StatusBar.setBarStyle("light-content");
            });

            BackHandler.addEventListener(
                "hardwareBackPress",
                this.backAction
            );
        }
        this.props.navigation.setOptions({
            tabBarLabel: this.props.language.more
        });
        await this.getUserDetails();
    }

    componentWillUnmount() {
        if (Platform.OS === "android") {
            BackHandler.removeEventListener(
                "hardwareBackPress", this.backAction)
        }
    }

}

const styles = {
    arrowStyle: {
        tintColor: themeStyle.BLACK,
        width: Utility.setWidth(35),
        height: Utility.setHeight(30)
    },
    selectionBg: {
        paddingStart: 10,
        paddingBottom: 4,
        paddingTop: 4,
        paddingEnd: 10,
        flexDirection: "row",
        backgroundColor: themeStyle.SELECTION_BG,
        alignItems: "center"
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalView: {
        width: Utility.getDeviceWidth() - 30,
        overflow: "hidden",
        borderRadius: 10,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },

}

const mapStateToProps = (state) => {
    return {
        userDetails: state.accountReducer.userDetails,
        langId: state.accountReducer.langId,
        language: state.accountReducer.language,
    };
};

export default connect(mapStateToProps)(Profile);
