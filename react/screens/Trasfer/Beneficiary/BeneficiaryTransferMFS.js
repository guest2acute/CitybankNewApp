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
    TextInput, FlatList, Platform, StatusBar
} from "react-native";
import themeStyle from "../../../resources/theme.style";
import fontStyle from "../../../resources/FontStyle";
import FontSize from "../../../resources/ManageFontSize";
import CommonStyle from "../../../resources/CommonStyle";
import React, {Component} from "react";
import {BusyIndicator} from "../../../resources/busy-indicator";
import Utility from "../../../utilize/Utility";
import {AddBeneficiary} from "../../Requests/RequestBeneficiary";

class BeneficiaryTransferMFS extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nickname: "",
            accountNo: "",
            mobile_number: "",
            emailTxt: "",
            errorEmail: "",
            error_nickname: "",
            error_accountNo: "",
            isMainScreen: true
        }
    }

    userInput(text) {
        if (text.indexOf(" ") !== -1)
            text = text.replace(/\s/g, '');

        this.setState({nickname: text, error_nickname: ""})
    }

    accountchange(text) {
        console.log("acccount change", text)
        if (text.indexOf(" ") !== -1)
            text = text.replace(/\s/g, '');
        this.setState({accountNo: text, error_accountNo: ""})
    }

    async onSubmit(language, navigation) {
        if (this.state.nickname === "") {
            this.setState({error_nickname: language.require_nickname});
        } else if (this.state.accountNo.length !== 13) {
            this.setState({error_accountNo: language.require_accnumber})
        } else if (this.state.isMainScreen) {
            this.setState({isMainScreen: false});
        } else {
            this.beneficiaryAdd();
        }
    }

    accountNoOption(language) {
        return (
            <View>
                <View style={{
                    flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                    marginEnd: 10,
                }}>
                    <Text style={[CommonStyle.textStyle]}>
                        {language.nick_name}
                        <Text style={{color: themeStyle.THEME_COLOR}}>{this.state.isMainScreen ? "*" : ""}</Text>
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
                            nickname: Utility.userInput(text)
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
                            this.accountNoRef.focus();
                        }}
                    />
                </View>
                {this.state.error_nickname !== "" ?
                    <Text style={{
                        marginStart: 10, color: themeStyle.THEME_COLOR, fontSize: FontSize.getSize(11),
                        fontFamily: fontStyle.RobotoRegular,
                    }}>{this.state.error_nickname}</Text> : null}
                <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
                <View style={{
                    flexDirection: "row",
                    height: Utility.setHeight(50),
                    marginStart: 10,
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginEnd: 10,
                }}>
                    <Text style={[CommonStyle.textStyle]}>
                        {language.bkash_account}
                        <Text style={{color: themeStyle.THEME_COLOR}}>{this.state.isMainScreen ? "*" : ""}</Text>
                    </Text>

                    {/*<TouchableOpacity onPress={() => this.props.navigation.navigate("BeneficiaryMobileNumber")}>
                    <Image style={{
                        height: Utility.setHeight(20),
                        width: Utility.setWidth(20),
                       marginLeft: Utility.setWidth(10),
                        marginRight: Utility.setWidth(10),
                       //alignItems: "flex-end",
                        //alignSelf:"flex-end"
                    }} resizeMode={"contain"}
                           source={require("../../resources/images/ic_beneficiary.png")}/>
                </TouchableOpacity>*/}
                    <TextInput
                        ref={(ref) => this.accountNoRef = ref}
                        selectionColor={themeStyle.THEME_COLOR}
                        style={[CommonStyle.textStyle, {marginLeft: 10}]}
                        placeholder={this.state.isMainScreen ? language.bkash_account : ""}
                        onChangeText={text => this.accountchange(text)}
                        value={this.state.accountNo}
                        multiline={false}
                        editable={this.state.isMainScreen}
                        numberOfLines={1}
                        contextMenuHidden={true}
                        keyboardType={"number-pad"}
                        placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                        autoCorrect={false}
                        maxLength={13}/>
                </View>
                {this.state.error_accountNo !== "" ?
                    <Text style={{
                        marginLeft: 5, color: themeStyle.THEME_COLOR, fontSize: FontSize.getSize(11),
                        fontFamily: fontStyle.RobotoRegular,
                    }}>{this.state.error_accountNo}</Text> : null}

                <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>

                {this.state.isMainScreen ? <View><Text style={{
                    marginStart: 10,
                    marginTop: 20,
                    color: themeStyle.THEME_COLOR
                }}>*{language.mark_field_mandatory}
                </Text>
                    <Text style={styles.textView}>{language.notes}:</Text>
                    <Text style={{marginStart: 10, color: themeStyle.THEME_COLOR}}>Only bkash Customer Account can be
                        added</Text></View> : null}
            </View>)
    }

   /* beneficiaryAdd(language, navigation) {
        const {selectTypeVal} = this.state;
        this.setState({isProgress: true});
        let accountDetails = {
            ACCOUNT: accountNo,
            ADDRESS: "",
            CONTACTNUMBER: "",
            ACCOUNTNAME: account_holder_name
        }

        AddBeneficiary(accountDetails,"O", this.props.userDetails, nickname, mobile_number, emailTxt, selectTypeVal === 0 ? details.branchDetails.ROUTING_NO : details.bankDetails.BANK_CD, this.props).then(response => {
            console.log("response", response);
            this.setState({
                isProgress: false,
            }, () =>
                this.props.navigation.navigate("SecurityVerification", {
                    REQUEST_CD: response.REQUEST_CD,
                    transType: "O",
                    actNo: this.state.accountNo
                }));
        }).catch(error => {
            this.setState({isProgress: false});
            console.log("error", error);
        });
    }*/

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
                                   require("../../../resources/images/ic_back_android.png") : require("../../../resources/images/ic_back_ios.png")}/>
                    </TouchableOpacity>
                    <Text style={CommonStyle.title}>{language.add_beneficiary_transfer}</Text>
                    <TouchableOpacity onPress={() => Utility.logout(this.props.navigation, language)}
                                      style={{
                                          width: Utility.setWidth(35),
                                          height: Utility.setHeight(35),
                                          position: "absolute",
                                          right: Utility.setWidth(10),
                                      }}
                    >
                        <Image resizeMode={"contain"} style={{
                            width: Utility.setWidth(30),
                            height: Utility.setHeight(30),
                        }}
                               source={require("../../../resources/images/ic_logout.png")}/>
                    </TouchableOpacity>
                </View>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{flex: 1, paddingBottom: 30}}>
                        {this.accountNoOption(language)}
                        <View style={{
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
                                        style={[CommonStyle.midTextStyle, {color: themeStyle.WHITE}]}>{this.state.stateVal === 3 ? language.submit_txt : this.state.isMainScreen ? language.next : language.confirm}</Text>
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
        }

        this.props.navigation.setOptions({
            tabBarLabel: this.props.language.more
        });
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
        maxHeight: Utility.getDeviceHeight() - 100,
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
    textView: {
        marginStart: 10, marginTop: 20, color: themeStyle.THEME_COLOR
    }
}

const mapStateToProps = (state) => {
    return {
        langId: state.accountReducer.langId,
        language: state.accountReducer.language,
    };
};

export default connect(mapStateToProps)(BeneficiaryTransferMFS);
