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
import {GETACCTBALDETAIL, AddBeneficiary} from '../../Requests/RequestBeneficiary';


class BeneficiaryOtherCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isProgress: false,
            nickname: "",
            account_holder_name: "",
            currency: "",
            accountNo: "2251657635001",
            cardNumber:"",
            type_act: "",
            mobile_number: "",
            emailTxt: "",
            errorEmail: "",
            error_nickname: "",
            error_cardNo: "",
            focusUid: false,
            focusPwd: false,
            isMainForm: true,
            stageVal: 0,
            accountDetails: null,
            title:props.route.params.title,
            cardStatus:"",
            cardType:""
        }
    }

    userInput(text) {
        if (text.indexOf(" ") !== -1)
            text = text.replace(/\s/g, '');

        this.setState({nickname: text, error_nickname: ""})
    }

    cardChange(text) {
        if (text.indexOf(" ") !== -1)
            text = text.replace(/\s/g, '');
        this.setState({cardNumber: text, error_cardNo: ""})
    }

    async onSubmit(language, navigation) {
        const {stageVal, nickname, cardNumber, account_holder_name} = this.state;
        if (stageVal === 0) {
            if (nickname === "") {
                this.setState({error_nickname: language.require_nickname});
            } else if (cardNumber.length !== 13) {
                this.setState({error_cardNo: language.error_card_number});
            }else {

            }
        }
    }


    accountNoOption(language, flag) {
        return (<View>
            <View style={{
                flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                marginEnd: 10,
            }}>
                <Text style={[CommonStyle.textStyle]}>
                    {language.nick_name}
                    <Text style={{color: themeStyle.THEME_COLOR}}> *</Text>
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
                        nickname: Utility.userInput(text)
                    })}
                    value={this.state.nickname}
                    multiline={false}
                    onFocus={() => this.setState({focusUid: true})}
                    onBlur={() => this.setState({focusUid: false})}
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
                <Text style={{
                    marginStart: 10, color: themeStyle.THEME_COLOR, fontSize: FontSize.getSize(11),
                    fontFamily: fontStyle.RobotoRegular,
                }}>{this.state.error_nickname}</Text> : null}
            <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>

            <View style={{
                flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                marginEnd: 10,
            }}>
                <Text style={[CommonStyle.textStyle]}>
                    {language.card_number}
                    <Text style={{color: themeStyle.THEME_COLOR}}> *</Text>
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
                    onChangeText={text => this.cardChange(text)}
                    value={this.state.cardNumber}
                    multiline={false}
                    numberOfLines={1}
                    onFocus={() => this.setState({focusUid: true})}
                    onBlur={() => this.setState({focusUid: false})}
                    contextMenuHidden={true}
                    keyboardType={"number-pad"}
                    editable={flag}
                    placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                    autoCorrect={false}
                    maxLength={13}/>
            </View>
            {this.state.error_cardNo !== "" ?
                <Text style={{
                    marginStart: 10, color: themeStyle.THEME_COLOR, fontSize: FontSize.getSize(11),
                    fontFamily: fontStyle.RobotoRegular,
                }}>{this.state.error_cardNo}</Text> : null}
            <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
            <View>
                <View style={{
                    flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                    marginEnd: 10,
                }}>
                    <Text style={[CommonStyle.textStyle]}>
                        {language.cardHolderName}
                    </Text>
                    <TextInput
                        selectionColor={themeStyle.THEME_COLOR}
                        style={[CommonStyle.textStyle, {
                            alignItems: "flex-end",
                            textAlign: 'right',
                            flex: 1,
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
            { this.state.title===language.beneficiary_bank_card_title?
            <View>
                <View style={{
                    flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                    marginEnd: 10,
                }}>
                    <Text style={[CommonStyle.textStyle]}>
                        {language.card_status}
                    </Text>
                    <TextInput
                        selectionColor={themeStyle.THEME_COLOR}
                        style={[CommonStyle.textStyle, {
                            alignItems: "flex-end",
                            textAlign: 'right',
                            flex: 1,
                            marginLeft: 10
                        }]}
                        // placeholder={language.et_placeholder}
                        onChangeText={text => this.setState({cardStatus: Utility.userInput(text)})}
                        value={this.state.cardStatus}
                        multiline={false}
                        numberOfLines={1}
                        contextMenuHidden={true}
                        placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                        editable={false}
                        autoCorrect={false}/>
                </View>
                <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
            </View>:
                null}
            {/*<View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>*/}
            <View>
                <View style={{
                    flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                    marginEnd: 10,
                }}>
                    <Text style={[CommonStyle.textStyle]}>
                        {language.card_type}
                    </Text>
                    <TextInput
                        selectionColor={themeStyle.THEME_COLOR}
                        style={[CommonStyle.textStyle, {
                            alignItems: "flex-end",
                            textAlign: 'right',
                            flex: 1,
                            marginLeft: 10
                        }]}
                        // placeholder={language.et_placeholder}
                        onChangeText={text => this.setState({cardType: Utility.userInput(text)})}
                        value={this.state.cardType}
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
                        maxLength={14}/>
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

    tPinView(language) {
        return (<View key={"tPinView"}>


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
                        onPress={() => this.props.navigation.goBack(null)}>
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
                        {this.state.stageVal === 0 ? this.accountNoOption(language, true) :
                            this.state.stageVal === 1 ? this.accountNoOption(language, false) : this.tPinView(language)}
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
                                        style={[CommonStyle.midTextStyle, {color: themeStyle.WHITE}]}>{this.state.stateVal === 3 ? language.submit_txt : language.next}</Text>
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
            tabBarLabel: this.props.language.transfer
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
        alignItems: "center",
        maxHeight: Utility.getDeviceHeight() - 100,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    }
}

const mapStateToProps = (state) => {
    return {
        userDetails: state.accountReducer.userDetails,
        langId: state.accountReducer.langId,
        language: state.accountReducer.language,
    };
};

export default connect(mapStateToProps)(BeneficiaryOtherCard);
