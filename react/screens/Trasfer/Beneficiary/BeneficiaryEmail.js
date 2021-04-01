import React, {Component} from "react";
import {
    BackHandler,
    Image,
    Platform,
    SafeAreaView,
    ScrollView,
    StatusBar,
    Text, TextInput,
    TouchableOpacity,
    View
} from "react-native";
import themeStyle from "../../../resources/theme.style";
import CommonStyle from "../../../resources/CommonStyle";
import Utility from "../../../utilize/Utility";
import {connect} from "react-redux";
import {AddBeneficiary} from "../../Requests/RequestBeneficiary";
import {BusyIndicator} from "../../../resources/busy-indicator";

class BeneficiaryEmail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            updateTitle: props.route.params.title,
            isProgress: false,
            nickname: "",
            error_nickname: "",
            isMainScreen: true,
            emailTxt: "",
            errorEmail: "",
            mobileNo: "",
            errorMobileNo: ""
        }

        this.resetScreen =  this.resetScreen.bind(this);
    }

    onSubmit(language, navigation) {
        if (this.state.isMainScreen) {
            if (this.state.nickname === "") {
                this.setState({error_nickname: language.require_nickname});
            } else if (this.state.emailTxt === "") {
                this.setState({errorEmail: language.require_email})
            } else if (!Utility.validateEmail(this.state.emailTxt)) {
                this.setState({errorEmail: language.email_not_valid})
            } else if (this.state.mobileNo.length < 11) {
                this.setState({errorMobileNo: language.invalidMobile})
            } else {
                this.setState({isMainScreen: false});
            }
        } else {
            this.beneficiaryAdd();
        }
    }

    resetScreen = (flag) => {
        if (flag) {
            this.setState({
                nickname: "",
                isMainScreen: true,
                emailTxt: "",
                mobileNo: "",
            });
        }
    }


    beneficiaryAdd() {
        const {mobileNo, nickname, emailTxt} = this.state;
        this.setState({isProgress: true});
        let accountDetails = {ACCOUNT: emailTxt, ADDRESS: "", CONTACTNUMBER: mobileNo, ACCOUNTNAME: nickname};
        AddBeneficiary(accountDetails, "E", this.props.userDetails, nickname, mobileNo, emailTxt, "", this.props, "A","").then(response => {
            console.log("response", response);
            this.setState({
                isProgress: false,
            }, () => this.props.navigation.navigate("SecurityVerification", {
                REQUEST_CD: response.REQUEST_CD,
                transType: "E",
                resetScreen: this.resetScreen
            }));
        }).catch(error => {
            this.setState({isProgress: false});
            console.log("error", error);
        });
    }

    backAction = () => {
        this.backEvent();
        return true;
    }

    backEvent() {
        const {isMainScreen} = this.state;
        if (isMainScreen) {
            console.log("1");
            this.props.navigation.goBack();
        } else {
            console.log("2");
            this.setState({isMainScreen: true})
        }
    }

    render() {
        let language = this.props.language;
        return (
            <View style={{flex: 1, backgroundColor: themeStyle.BG_COLOR}}>
                <SafeAreaView/>
                <View style={CommonStyle.toolbar}>
                    <TouchableOpacity
                        style={CommonStyle.toolbar_back_btn_touch}
                        onPress={() => this.backEvent()}>
                        <Image style={CommonStyle.toolbar_back_btn}
                               source={Platform.OS === "android" ?
                                   require("../../../resources/images/ic_back_android.png") : require("../../../resources/images/ic_back_ios.png")}/>
                    </TouchableOpacity>
                    <Text style={CommonStyle.title}>{this.state.updateTitle}</Text>
                    <TouchableOpacity onPress={() => Utility.logout(this.props.navigation, language)}
                                      style={{
                                          width: Utility.setWidth(35),
                                          height: Utility.setHeight(35),
                                          position: "absolute",
                                          right: Utility.setWidth(10),
                                      }}>
                        <Image resizeMode={"contain"} style={{
                            width: Utility.setWidth(30),
                            height: Utility.setHeight(30),
                        }} source={require("../../../resources/images/ic_logout.png")}/>
                    </TouchableOpacity>
                </View>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{flex: 1, paddingBottom: 30}}>
                        <View style={{
                            flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                            marginEnd: 10,
                        }}>
                            <Text style={[CommonStyle.textStyle]}>
                                {language.nick_name}
                                <Text
                                    style={{color: themeStyle.THEME_COLOR}}>{this.state.isMainScreen ? "*" : ""}</Text>
                            </Text>
                            <TextInput
                                selectionColor={themeStyle.THEME_COLOR}
                                style={[CommonStyle.textStyle, {
                                    alignItems: "flex-end",
                                    textAlign: 'right',
                                    flex: 1,
                                    marginLeft: 10
                                }]}
                                placeholder={this.state.isMainScreen ? language.please_enter : ""}
                                onChangeText={text => this.setState({
                                    error_nickname: "",
                                    nickname: text
                                })}
                                value={this.state.nickname}
                                multiline={false}
                                editable={this.state.isMainScreen}
                                numberOfLines={1}
                                contextMenuHidden={true}
                                placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                                autoCorrect={false}
                                returnKeyType={"next"}
                                onSubmitEditing={(event) => {
                                    this.emailRef.focus();
                                }}
                            />
                        </View>
                        {this.state.error_nickname !== "" ?
                            <Text style={CommonStyle.errorStyle}>{this.state.error_nickname}</Text> : null}
                        <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
                        <View style={{
                            flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                            marginEnd: 10,
                        }}>
                            <Text style={[CommonStyle.textStyle]}>
                                {language.email}
                                <Text
                                    style={{color: themeStyle.THEME_COLOR}}>{this.state.isMainScreen ? "*" : ""}</Text>
                            </Text>
                            <TextInput
                                ref={(ref) => this.emailRef = ref}
                                selectionColor={themeStyle.THEME_COLOR}
                                style={[CommonStyle.textStyle, {
                                    alignItems: "flex-end",
                                    textAlign: 'right',
                                    flex: 1,
                                    marginLeft: 10
                                }]}
                                placeholder={this.state.isMainScreen ? language.please_enter : ""}
                                onChangeText={text => this.setState({
                                    errorEmail: "",
                                    emailTxt: Utility.userInput(text)
                                })}
                                value={this.state.emailTxt}
                                multiline={false}
                                editable={this.state.isMainScreen}
                                numberOfLines={1}
                                contextMenuHidden={true}
                                placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                                autoCorrect={false}
                                returnKeyType={"next"}
                                onSubmitEditing={(event) => {
                                    this.mobileRef.focus();
                                }}
                            /></View>
                        {this.state.errorEmail !== "" ?
                            <Text style={CommonStyle.errorStyle}>{this.state.errorEmail}</Text> : null}
                        <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
                        <View style={{
                            flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                            marginEnd: 10,
                        }}>
                            <Text style={[CommonStyle.textStyle]}>
                                {language.mobile}
                                <Text
                                    style={{color: themeStyle.THEME_COLOR}}>{this.state.isMainScreen ? "*" : ""}</Text>
                            </Text>
                            <TextInput
                                ref={(ref) => this.mobileRef = ref}
                                selectionColor={themeStyle.THEME_COLOR}
                                style={[CommonStyle.textStyle, {
                                    alignItems: "flex-end",
                                    textAlign: 'right',
                                    flex: 1,
                                    marginLeft: 10
                                }]}
                                placeholder={this.state.isMainScreen ? language.please_enter : ""}
                                onChangeText={text => this.setState({
                                    errorMobileNo: "",
                                    mobileNo: Utility.input(text, "0123456789")
                                })}
                                value={this.state.mobileNo}
                                multiline={false}
                                editable={this.state.isMainScreen}
                                numberOfLines={1}
                                contextMenuHidden={true}
                                keyboardType={"number-pad"}
                                placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                                autoCorrect={false}
                                maxLength={11}
                            /></View>
                        {this.state.errorMobileNo !== "" ?
                            <Text style={CommonStyle.errorStyle}>{this.state.errorMobileNo}</Text> : null}
                        <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>

                        <View style={{
                            flexDirection: "row",
                            marginStart: Utility.setWidth(10),
                            marginRight: Utility.setWidth(10),
                            marginTop: Utility.setHeight(20)
                        }}>
                            <TouchableOpacity style={{flex: 1}}
                                              onPress={() => this.backEvent()}>
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
                                        style={[CommonStyle.midTextStyle, {color: themeStyle.THEME_COLOR}]}>{language.back_txt}</Text>
                                </View>
                            </TouchableOpacity>
                            <View style={{width: Utility.setWidth(20)}}/>

                            <TouchableOpacity style={{flex: 1}}
                                              onPress={() => this.onSubmit(language, this.props.navigation)}>
                                <View style={{
                                    alignItems: "center",
                                    justifyContent: "center",
                                    height: Utility.setHeight(46),
                                    borderRadius: Utility.setHeight(23),
                                    backgroundColor: themeStyle.THEME_COLOR
                                }}><Text
                                    style={[CommonStyle.midTextStyle, {color: themeStyle.WHITE}]}>{this.state.isMainScreen ? language.next : language.confirm}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
                <BusyIndicator visible={this.state.isProgress}/>
            </View>
        )
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
            tabBarLabel: this.props.language.transfer
        });

    }

    componentWillUnmount() {
        if (Platform.OS === "android") {
            BackHandler.removeEventListener(
                "hardwareBackPress", this.backAction)
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        console.log("this.props.language.account", this.props.language.account);
        if (prevProps.langId !== this.props.langId) {
            this.props.navigation.setOptions({
                tabBarLabel: this.props.language.transfer
            });
        }
    }
}

const mapStateToProps = (state) => {
        return {
            userDetails: state.accountReducer.userDetails,
            langId: state.accountReducer.langId,
            language: state.accountReducer.language,
        };
    }
;

export default connect(mapStateToProps)(BeneficiaryEmail);