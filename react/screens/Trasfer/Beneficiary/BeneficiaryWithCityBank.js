import {connect} from "react-redux";
import {
    I18nManager,
    Modal,
    SafeAreaView,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
    Image,
    TextInput, FlatList, Platform, StatusBar, BackHandler
} from "react-native";
import themeStyle from "../../../resources/theme.style";
import fontStyle from "../../../resources/FontStyle";
import FontSize from "../../../resources/ManageFontSize";
import CommonStyle from "../../../resources/CommonStyle";
import React, {Component} from "react";
import {BusyIndicator} from "../../../resources/busy-indicator";
import Utility from "../../../utilize/Utility";
import {GETACCTBALDETAIL, AddBeneficiary} from '../../Requests/RequestBeneficiary';
import {actions} from "../../../redux/actions";


class BeneficiaryWithCityBank extends Component {


    constructor(props) {
        super(props);
        this.state = {
            isProgress: false,
            nickname: "",
            account_holder_name: "",
            currency: "",
            accountNo: "",
            type_act: "",
            mobile_number: "",
            emailTxt: "",
            errorEmail: "",
            error_nickname: "",
            error_accountNo: "",
            stageVal: 0,
            accountDetails: null,
            title: props.route.params.title
        }

        this.resetScreen = this.resetScreen.bind(this);
    }

    userInput(text) {
        if (text.indexOf(" ") !== -1)
            text = text.replace(/\s/g, '');
        this.setState({nickname: text, error_nickname: ""})
    }

    accountChange(text) {
        if (text.indexOf(" ") !== -1)
            text = text.replace(/\s/g, '');
        this.setState({accountNo: text, error_accountNo: ""})
    }

    async onSubmit(language, navigation) {
        const {stageVal, nickname, accountNo, account_holder_name} = this.state;
        if (stageVal === 0) {
            if (nickname === "") {
                this.setState({error_nickname: language.require_nickname});
            } else if (accountNo.length !== 13) {
                this.setState({error_accountNo: language.require_accnumber}); 
            } else if (account_holder_name === "") {
                this.getActDetails(language);
            }
            else if (this.state.mobile_number !== "" && !Utility.ValidateMobileNumber(this.state.mobile_number)) {
                this.setState({errorMobileNo: language.invalidMobile});
            } else if (this.state.emailTxt !== "" && !Utility.validateEmail(this.state.emailTxt)) {
                this.setState({errorEmail: language.invalidEmail});
            }
            else {
                this.setState({stageVal: stageVal + 1});
            }
        } else if (stageVal === 1) {
            this.beneficiaryAdd();
        }
    }

    resetScreen = () => {
        this.setState({
            nickname: "",
            account_holder_name: "",
            currency: "",
            accountNo: "",
            type_act: "",
            mobile_number: "",
            emailTxt: "",
            stageVal: 0,
            accountDetails: null,
        })

    }

    beneficiaryAdd(language) {
        const {accountDetails, nickname, mobile_number, emailTxt} = this.state;
        this.setState({isProgress: true});
        AddBeneficiary(accountDetails, "I", this.props.userDetails, nickname, mobile_number, emailTxt, "", "", this.props, "A", this.state.currency).then(response => {
            console.log("response", response);
            this.setState({
                isProgress: false,
            }, () =>
                this.props.navigation.navigate("SecurityVerification", {
                    REQUEST_CD: response.REQUEST_CD,
                    transType: "I"
                }));
        }).catch(error => {
            this.setState({isProgress: false});
            console.log("error", error);
        });
    }


    getActDetails(language) {
        if (this.state.accountNo.length !== 13) {
            this.setState({error_accountNo: language.require_accnumber})
            return;
        }
        this.setState({isProgress: true});
        GETACCTBALDETAIL(this.state.accountNo, this.props).then(response => {
            console.log("response", response);
            this.setState({
                isProgress: false, account_holder_name: response.ACCOUNTNAME,
                currency: response.CURRENCYCODE, type_act: response.ACCTTYPE, accountDetails: response
            });
        }).catch(error => {
            this.setState({isProgress: false, error_accountNo: language.require_valid_actNumber});
            console.log("error", error);
        });
    }

    accountNoOption(language, flag) {
        return (
            <View>
                <View style={{
                    flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                    marginEnd: 10,
                }}>
                    <Text style={[CommonStyle.textStyle]}>
                        {language.nick_name}
                        <Text style={{color: themeStyle.THEME_COLOR}}>{flag ? "*" : ""}</Text>
                    </Text>
                    <TextInput
                        selectionColor={themeStyle.THEME_COLOR}
                        style={[CommonStyle.textStyle, {
                            alignItems: "flex-end",
                            textAlign: 'right',
                            flex: 1,
                            marginLeft: 10
                        }]}
                        placeholder={language.et_placeholder}
                        onChangeText={text => this.setState({
                            error_nickname: "",
                            nickname: text
                        })}
                        value={this.state.nickname}
                        multiline={false}
                        numberOfLines={1}
                        editable={flag}
                        contextMenuHidden={true}
                        placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                        autoCorrect={false}
                        returnKeyType={"next"}
                        onSubmitEditing={(event) => {
                            this.accountNoRef.focus();
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
                        {language.actNo}
                        <Text style={{color: themeStyle.THEME_COLOR}}>{flag ? "*" : ""}</Text>
                    </Text>
                    <TextInput
                        ref={(ref) => this.accountNoRef = ref}
                        selectionColor={themeStyle.THEME_COLOR}
                        style={[CommonStyle.textStyle, {
                            alignItems: "flex-end",
                            textAlign: 'right',
                            flex: 1,
                            marginLeft: 10
                        }]}
                        placeholder={language.et_placeholder}
                        onChangeText={text => this.accountChange(text)}
                        value={this.state.accountNo}
                        multiline={false}
                        numberOfLines={1}
                        contextMenuHidden={true}
                        keyboardType={"number-pad"}
                        editable={flag}
                        placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                        autoCorrect={false}
                        onSubmitEditing={(event) => {
                            this.getActDetails(language);
                        }}
                        maxLength={13}/>
                </View>
                {this.state.error_accountNo !== "" ?
                    <Text style={CommonStyle.errorStyle}>{this.state.error_accountNo}</Text> : null}
                <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
                <View>
                    <View style={{
                        flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                        marginEnd: 10,
                    }}>
                        <Text style={[CommonStyle.textStyle, {flex: 1}]}>
                            {language.account_holder_name}
                        </Text>
                        <TextInput
                            selectionColor={themeStyle.THEME_COLOR}
                            style={[CommonStyle.textStyle, {
                                alignItems: "flex-end",
                                textAlign: 'right',
                                marginLeft: 10
                            }]}
                            // placeholder={language.et_placeholder}
                            onChangeText={text => this.setState({account_holder_name: Utility.userInput(text)})}
                            value={this.state.account_holder_name}
                            multiline={false}
                            numberOfLines={1}
                            contextMenuHidden={true}
                            placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                            editable={false}
                            autoCorrect={false}/>
                    </View>
                </View>
                <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
                <View>
                    <View style={{
                        flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                        marginEnd: 10,
                    }}>
                        <Text style={[CommonStyle.textStyle, {flex: 1}]}>
                            {language.currency}
                        </Text>
                        <TextInput
                            selectionColor={themeStyle.THEME_COLOR}
                            style={[CommonStyle.textStyle, {
                                alignItems: "flex-end",
                                textAlign: 'right',
                                marginLeft: 10
                            }]}
                            //placeholder={language.et_placeholder}
                            onChangeText={text => this.setState({currency: Utility.input(text, "0123456789")})}
                            value={this.state.currency}
                            multiline={false}
                            numberOfLines={1}
                            contextMenuHidden={true}
                            placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                            autoCorrect={false}
                            editable={false}
                            maxLength={13}/>
                    </View>
                </View>
                <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>

                <View style={{
                    flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                    marginEnd: 10,
                }}>
                    <Text style={[CommonStyle.textStyle]}>
                        {language.type_act}
                    </Text>
                    <TextInput
                        selectionColor={themeStyle.THEME_COLOR}
                        style={[CommonStyle.textStyle, {
                            alignItems: "flex-end",
                            textAlign: 'right',
                            flex: 1,
                            marginLeft: 10
                        }]}
                        onChangeText={text => this.setState({type_act: text})}
                        value={this.state.type_act}
                        multiline={false}
                        numberOfLines={1}
                        contextMenuHidden={true}
                        placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                        autoCorrect={false}
                        editable={false}
                    />
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
                            {language.beneficiary_mobile_number}
                        </Text>
                        {/*<TouchableOpacity onPress={() => this.props.navigation.navigate("BeneficiaryMobileNumber")}>
                    <Image style={{
                        height: Utility.setHeight(20),
                        width: Utility.setWidth(20),
                        marginLeft: Utility.setWidth(10),
                        marginRight: Utility.setWidth(10),
                    }} resizeMode={"contain"}
                           source={require("../../resources/images/ic_beneficiary.png")}/>
                </TouchableOpacity>*/}
                        <TextInput
                            selectionColor={themeStyle.THEME_COLOR}
                            style={[CommonStyle.textStyle, {
                                alignItems: "flex-end",
                                textAlign: 'right',
                                flex: 1,
                                marginLeft: 10
                            }]}
                            placeholder={flag ? "01********" : ""}
                            onChangeText={text => this.setState({mobile_number: Utility.input(text, "0123456789")})}
                            value={this.state.mobile_number}
                            multiline={false}
                            numberOfLines={1}
                            contextMenuHidden={true}
                            keyboardType={"number-pad"}
                            editable={flag}
                            placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                            autoCorrect={false}
                            returnKeyType={"next"}
                            onSubmitEditing={(event) => {
                                this.emailRef.focus();
                            }}
                            maxLength={11}/>
                    </View>
                    {this.state.errorMobileNo !== "" ?
                        <Text style={CommonStyle.errorStyle
                        }>{this.state.errorMobileNo}</Text> : null}
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
                            {language.beneficiary_Email_Address}
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
                            placeholder={flag ? "a********@gmail.com" : ""}
                            onChangeText={text => this.setState({emailTxt: Utility.userInput(text)})}
                            value={this.state.emailTxt}
                            multiline={false}
                            numberOfLines={1}
                            editable={flag}
                            contextMenuHidden={true}
                            placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                            autoCorrect={false}/>
                    </View>
                    {this.state.errorEmail !== "" ?
                        <Text style={{
                            marginLeft: 5,
                            marginRight: 10,
                            color: themeStyle.THEME_COLOR,
                            fontSize: FontSize.getSize(11),
                            fontFamily: fontStyle.RobotoRegular,
                            alignSelf: "flex-end",
                            marginBottom: 10,
                        }}>{this.state.errorEmail}</Text> : null}
                </View>
                <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
                <Text
                    style={{
                        display: flag ? "flex" : "none",
                        marginStart: 10,
                        marginTop: 20,
                        color: themeStyle.THEME_COLOR
                    }}>*{language.mark_field_mandatory}
                </Text>
            </View>)
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
                    <Text style={CommonStyle.title}>{this.state.title}</Text>
                    <TouchableOpacity onPress={() => Utility.logout(this.props.navigation, language)}
                                      style={{
                                          width: Utility.setWidth(35),
                                          height: Utility.setHeight(35),
                                          position: "absolute",
                                          right: Utility.setWidth(10),
                                      }}
                                      onPress={() => Utility.logout(this.props.navigation, language)}>
                        <Image resizeMode={"contain"} style={{
                            width: Utility.setWidth(30),
                            height: Utility.setHeight(30),
                        }}
                               source={require("../../../resources/images/ic_logout.png")}/>
                    </TouchableOpacity>
                </View>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{flex: 1, paddingBottom: 30}}>
                        {this.state.stageVal === 0 ? this.accountNoOption(language, true) : this.accountNoOption(language, false)}
                        <View style={{
                            flexDirection: "row",
                            marginStart: Utility.setWidth(10),
                            marginRight: Utility.setWidth(10),
                            marginTop: Utility.setHeight(20)
                        }}>
                            <TouchableOpacity style={{flex: 1}} onPress={() => this.backEvent()}>
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
                                }}>
                                    <Text
                                        style={[CommonStyle.midTextStyle, {color: themeStyle.WHITE}]}>{this.state.stageVal === 0 ? language.next : language.confirm}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
                <BusyIndicator visible={this.state.isProgress}/>
            </View>
        )
    }

    componentDidMount() {
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

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.langId !== this.props.langId) {
            this.props.navigation.setOptions({
                tabBarLabel: this.props.language.transfer
            });
        }

        if (this.props.isReset && this.props.beneType === "I") {
            this.resetScreen();
            this.props.dispatch({
                type: actions.account.RESET_BENEFICIARY,
                payload: {
                    isReset: false,
                    beneType: "",
                },
            });
        }
    }

    backAction = () => {
        this.backEvent();
        return true;
    }

    backEvent() {
        const {stageVal} = this.state;
        console.log("log", stageVal);
        if (stageVal === 0)
            this.props.navigation.goBack();
        else
            this.setState({stageVal: stageVal - 1});
    }

    componentWillUnmount() {
        if (Platform.OS === "android") {
            BackHandler.removeEventListener("hardwareBackPress", this.backAction);
        }
    }
}


const mapStateToProps = (state) => {
    return {
        beneType: state.accountReducer.beneType,
        isReset: state.accountReducer.isReset,
        userDetails: state.accountReducer.userDetails,
        langId: state.accountReducer.langId,
        language: state.accountReducer.language,
    };
};

export default connect(mapStateToProps)(BeneficiaryWithCityBank);
