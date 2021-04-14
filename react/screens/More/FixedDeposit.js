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
import themeStyle from "../../resources/theme.style";
import CommonStyle from "../../resources/CommonStyle";
import React, {Component} from "react";
import {BusyIndicator} from "../../resources/busy-indicator";
import Utility from "../../utilize/Utility";
import FontSize from "../../resources/ManageFontSize";
import fontStyle from "../../resources/FontStyle";
import RadioForm from "react-native-simple-radio-button";


class FixedDeposit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isProgress: false,
            selectAccountNumberType: props.language.select_actNo,
            selectAccountType: props.language.select_type_account,
            selectTenureType: props.language.select_tenure_type,
            selectTenurePeriodType: props.language.select_tenure_period,
            selectBranchType: props.language.select_branch,
            selectTypeVal: -1,
            selectActCard: props.language.TypeOfTransferArr[0],
            modelSelection: "",
            modalVisible: false,
            modalTitle: "",
            modalData: [],
            title: props.route.params.title,
            accountTitle: "",
            availableBalance: "",
            amount: "",
            errorAmount: "",
            interestRate: "",
            emailTxt: "",
            errorEmail: "",
            MaturityDate: "",
            creditInterest: ""
        }
    }

    renderSeparator = () => {
        return (
            <View
                style={{
                    height: 1,
                    width: "100%",
                    marginStart: 5,
                    marginEnd: 5,
                    backgroundColor: themeStyle.SEPARATOR,
                }}
            />
        );
    };

    openModal(option, title, data, language) {
        if (data.length > 0) {
            this.setState({
                modelSelection: option,
                modalTitle: title,
                modalData: data, modalVisible: true
            });
        } else {
            Utility.alert(language.noRecord,language.ok);
        }
    }

    onSelectItem(item) {
        const {modelSelection} = this.state;
        if (modelSelection === "type") {
            this.setState({selectAccountNumberType: item.label, selectTypeVal: item.value, modalVisible: false})
        } else if (modelSelection === "accountType") {
            this.setState({selectAccountType: item.label, selectTypeVal: item.value, modalVisible: false})
        } else if (modelSelection === "tenureType") {
            this.setState({selectTenureType: item.label, selectTypeVal: item.value, modalVisible: false})
        } else if (modelSelection === "tenurePeriodType") {
            this.setState({selectTenurePeriodType: item.label, selectTypeVal: item.value, modalVisible: false})
        } else if (modelSelection === "branchType") {
            this.setState({selectBranchType: item.label, selectTypeVal: item.value, modalVisible: false})
        }
    }

    submit(language, navigation) {
        let otpMsg = "", successMsg = "";
        if (this.state.selectAccountNumberType === language.select_actNo) {
            Utility.alert(language.select_actNo,language.ok);
        } else if (this.state.selectAccountType === language.select_type_account) {
            Utility.alert(language.selectActType,language.ok);
        } else if (this.state.selectTenureType === language.select_tenure_type) {
            Utility.alert(language.selectTenureType,language.ok);
        } else if (this.state.selectTenurePeriodType === language.select_tenure_period) {
            Utility.alert(language.selectTenurePeriod,language.ok);
        } else if (this.state.amount === "") {
            this.setState({errorAmount: language.error_amount})
            return;
        } else if (this.state.selectBranchType === language.select_branch) {
            Utility.alert(language.error_select_branch_name,language.ok);
        } else {
            Utility.alertWithBack(language.ok_txt, language.success_saved, navigation)
        }
    }

    fixedDepositView(language) {
        return (
            <View style={{flex: 1, paddingBottom: 30}}>
                <Text style={[CommonStyle.labelStyle, {
                    color: themeStyle.THEME_COLOR,
                    marginStart: 10,
                    marginEnd: 10,
                    marginTop: 6,
                    marginBottom: 4
                }]}>
                    {language.acc_number}
                    <Text style={{color: themeStyle.THEME_COLOR}}> *</Text>
                </Text>
                <TouchableOpacity
                    onPress={() => this.openModal("type", language.select_actNo, language.cardNumber, language)}>
                    <View style={CommonStyle.selectionBg}>
                        <Text style={[CommonStyle.midTextStyle, {
                            color: this.state.selectAccountNumberType === language.select_actNo ? themeStyle.SELECT_LABEL : themeStyle.BLACK,
                            flex: 1
                        }]}>
                            {this.state.selectAccountNumberType}
                        </Text>
                        <Image resizeMode={"contain"} style={CommonStyle.arrowStyle}
                               source={require("../../resources/images/ic_arrow_down.png")}/>
                    </View>
                </TouchableOpacity>

                <View style={{
                    flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                    marginEnd: 10,
                }}>
                    <Text style={[CommonStyle.textStyle]}>
                        {language.account_title}
                    </Text>
                    <TextInput
                        selectionColor={themeStyle.THEME_COLOR}
                        style={[CommonStyle.textStyle, {
                            alignItems: "flex-end",
                            textAlign: 'right',
                            flex: 1,
                            marginLeft: 10
                        }]}
                        placeholder={""}
                        onChangeText={text => this.setState({
                            accountTitle: Utility.userInput(text)
                        })}
                        value={this.state.accountTitle}
                        multiline={false}
                        numberOfLines={1}
                        onFocus={() => this.setState({focusUid: true})}
                        onBlur={() => this.setState({focusUid: false})}
                        contextMenuHidden={true}
                        placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                        autoCorrect={false}
                        editable={false}
                        maxLength={13}/>
                </View>
                <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
                <View style={{
                    flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                    marginEnd: 10,
                }}>
                    <Text style={[CommonStyle.textStyle]}>
                        {language.avail_balance}
                    </Text>
                    <TextInput
                        selectionColor={themeStyle.THEME_COLOR}
                        style={[CommonStyle.textStyle, {
                            alignItems: "flex-end",
                            textAlign: 'right',
                            flex: 1,
                            marginLeft: 10
                        }]}
                        placeholder={""}
                        onChangeText={text => this.setState({
                            availableBalance: Utility.userInput(text)
                        })}
                        value={this.state.availableBalance}
                        multiline={false}
                        numberOfLines={1}
                        onFocus={() => this.setState({focusUid: true})}
                        onBlur={() => this.setState({focusUid: false})}
                        contextMenuHidden={true}
                        placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                        autoCorrect={false}
                        editable={false}
                        maxLength={13}/>
                </View>
                <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
                <Text style={[CommonStyle.labelStyle, {
                    color: themeStyle.THEME_COLOR,
                    marginStart: 10,
                    marginEnd: 10,
                    marginTop: 6,
                    marginBottom: 4
                }]}>
                    {language.type_act}
                    <Text style={{color: themeStyle.THEME_COLOR}}> *</Text>
                </Text>
                <TouchableOpacity
                    onPress={() => this.openModal("accountType", language.select_type_account, language.depositTypeArr, language)}>
                    <View style={CommonStyle.selectionBg}>
                        <Text style={[CommonStyle.midTextStyle, {
                            color: this.state.selectAccountType === language.select_type_account ? themeStyle.SELECT_LABEL : themeStyle.BLACK,
                            flex: 1
                        }]}>
                            {this.state.selectAccountType}
                        </Text>
                        <Image resizeMode={"contain"} style={CommonStyle.arrowStyle}
                               source={require("../../resources/images/ic_arrow_down.png")}/>
                    </View>
                </TouchableOpacity>

                <Text style={[CommonStyle.labelStyle, {
                    color: themeStyle.THEME_COLOR,
                    marginStart: 10,
                    marginEnd: 10,
                    marginTop: 6,
                    marginBottom: 4
                }]}>
                    {language.select_tenure_type}
                    <Text style={{color: themeStyle.THEME_COLOR}}> *</Text>
                </Text>
                <TouchableOpacity
                    onPress={() => this.openModal("tenureType", language.select_tenure_type, language.TenureTypeArr, language)}>
                    <View style={CommonStyle.selectionBg}>
                        <Text style={[CommonStyle.midTextStyle, {
                            color: this.state.selectTenureType === language.select_tenure_type ? themeStyle.SELECT_LABEL : themeStyle.BLACK,
                            flex: 1
                        }]}>
                            {this.state.selectTenureType}
                        </Text>
                        <Image resizeMode={"contain"} style={CommonStyle.arrowStyle}
                               source={require("../../resources/images/ic_arrow_down.png")}/>
                    </View>
                </TouchableOpacity>

                <Text style={[CommonStyle.labelStyle, {
                    color: themeStyle.THEME_COLOR,
                    marginStart: 10,
                    marginEnd: 10,
                    marginTop: 6,
                    marginBottom: 4
                }]}>
                    {language.tenure}
                    <Text style={{color: themeStyle.THEME_COLOR}}> *</Text>
                </Text>
                <TouchableOpacity
                    onPress={() => this.openModal("tenurePeriodType", language.select_tenure_period, language.TenureTypeArr, language)}>
                    <View style={CommonStyle.selectionBg}>
                        <Text style={[CommonStyle.midTextStyle, {
                            color: this.state.selectTenurePeriodType === language.select_tenure_period ? themeStyle.SELECT_LABEL : themeStyle.BLACK,
                            flex: 1
                        }]}>
                            {this.state.selectTenurePeriodType}
                        </Text>
                        <Image resizeMode={"contain"} style={CommonStyle.arrowStyle}
                               source={require("../../resources/images/ic_arrow_down.png")}/>
                    </View>
                </TouchableOpacity>
                <View style={{
                    flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                    marginEnd: 10
                }}>
                    <Text style={[CommonStyle.textStyle]}>
                        {language.auto_renewal}
                        <Text style={{color: themeStyle.THEME_COLOR}}>*</Text>
                    </Text>
                    <RadioForm
                        radio_props={language.auto_renewal_Type}
                        initial={0}
                        buttonSize={9}
                        selectedButtonColor={themeStyle.THEME_COLOR}
                        formHorizontal={true}
                        labelHorizontal={true}
                        borderWidth={1}
                        buttonColor={themeStyle.GRAY_COLOR}
                        labelColor={themeStyle.BLACK}
                        labelStyle={[CommonStyle.textStyle, {marginRight: 10}]}
                        style={{marginStart: 5, marginTop: 10, marginLeft: Utility.setWidth(20)}}
                        animation={true}
                        onPress={(value) => {
                            this.setState({otp_type: value});
                        }}
                    />
                </View>

                <View style={{
                    marginStart: 10, marginEnd: 10, marginTop: 10, borderColor: themeStyle.BORDER,
                    borderRadius: 5,
                    overflow: "hidden",
                    borderWidth: 2
                }}>
                    <Text style={[CommonStyle.textStyle, {marginStart: 10, marginTop: 10}]}>
                        {language.renewTitle}
                        <Text style={{color: themeStyle.THEME_COLOR}}>*</Text>
                    </Text>
                    <RadioForm
                        radio_props={language.renew}
                        initial={0}
                        buttonSize={9}
                        selectedButtonColor={themeStyle.THEME_COLOR}
                        formHorizontal={false}
                        labelHorizontal={true}
                        borderWidth={1}
                        buttonColor={themeStyle.GRAY_COLOR}
                        labelColor={themeStyle.BLACK}
                        labelStyle={[CommonStyle.textStyle, {marginRight: 15}]}
                        style={{marginStart: 5, marginTop: 5, marginLeft: Utility.setWidth(20)}}
                        animation={true}
                        onPress={(value) => {
                            this.setState({otp_type: value});
                        }}
                    />
                </View>

                <View style={{
                    flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                    marginEnd: 10,
                }}>
                    <Text style={[CommonStyle.textStyle]}>
                        {language.credit_interest_to}
                    </Text>
                    <TextInput
                        selectionColor={themeStyle.THEME_COLOR}
                        style={[CommonStyle.textStyle, {
                            alignItems: "flex-end",
                            textAlign: 'right',
                            flex: 1,
                            marginLeft: 10
                        }]}
                        placeholder={""}
                        onChangeText={text => this.setState({
                            creditInterest: Utility.userInput(text)
                        })}
                        value={this.state.creditInterest}
                        multiline={false}
                        numberOfLines={1}
                        onFocus={() => this.setState({focusUid: true})}
                        onBlur={() => this.setState({focusUid: false})}
                        contextMenuHidden={true}
                        keyboardType={"number-pad"}
                        placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                        editable={false}
                        autoCorrect={false}
                        maxLength={13}/>
                </View>
                <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>

                <View style={{
                    flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                    marginEnd: 10,
                }}>
                    <Text style={[CommonStyle.textStyle]}>
                        {language.amountTitle}
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
                            errorAmount: "",
                            amount: Utility.userInput(text)
                        })}
                        value={this.state.amount}
                        multiline={false}
                        numberOfLines={1}
                        onFocus={() => this.setState({focusUid: true})}
                        onBlur={() => this.setState({focusUid: false})}
                        contextMenuHidden={true}
                        keyboardType={"number-pad"}
                        placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                        autoCorrect={false}
                        maxLength={13}/>
                </View>
                {this.state.errorAmount !== "" ?
                    <Text style={CommonStyle.errorStyle}>{this.state.errorAmount}</Text> : null}
                <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>

                <View style={{
                    flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                    marginEnd: 10,
                }}>
                    <Text style={[CommonStyle.textStyle]}>
                        {language.interestRate}
                    </Text>
                    <TextInput
                        selectionColor={themeStyle.THEME_COLOR}
                        style={[CommonStyle.textStyle, {
                            alignItems: "flex-end",
                            textAlign: 'right',
                            flex: 1,
                            marginLeft: 10
                        }]}
                        placeholder={""}
                        onChangeText={text => this.setState({
                            interestRate: Utility.userInput(text)
                        })}
                        value={this.state.interestRate}
                        multiline={false}
                        numberOfLines={1}
                        onFocus={() => this.setState({focusUid: true})}
                        onBlur={() => this.setState({focusUid: false})}
                        contextMenuHidden={true}
                        keyboardType={"number-pad"}
                        placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                        autoCorrect={false}
                        maxLength={13}/>
                </View>
                <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
                <Text style={[CommonStyle.labelStyle, {
                    color: themeStyle.THEME_COLOR,
                    marginStart: 10,
                    marginEnd: 10,
                    marginTop: 6,
                    marginBottom: 4
                }]}>
                    {language.deposit_advice_branch}
                    <Text style={{color: themeStyle.THEME_COLOR}}> *</Text>
                </Text>
                <TouchableOpacity
                    onPress={() => this.openModal("branchType", language.select_branch, language.cardNumber, language)}>
                    <View style={CommonStyle.selectionBg}>
                        <Text style={[CommonStyle.midTextStyle, {
                            color: this.state.selectBranchType === language.select_branch ? themeStyle.SELECT_LABEL : themeStyle.BLACK,
                            flex: 1
                        }]}>
                            {this.state.selectBranchType}
                        </Text>
                        <Image resizeMode={"contain"} style={CommonStyle.arrowStyle}
                               source={require("../../resources/images/ic_arrow_down.png")}/>
                    </View>
                </TouchableOpacity>
                <View style={{
                    flexDirection: "row",
                    marginStart: 10,
                    height: Utility.setHeight(50),
                    alignItems: "center",
                    marginEnd: 10,
                }}>
                    <Text style={[CommonStyle.textStyle]}>
                        {language.emailAddress}
                    </Text>
                    <TextInput
                        selectionColor={themeStyle.THEME_COLOR}
                        style={[CommonStyle.textStyle, {
                            alignItems: "flex-end",
                            textAlign: 'right',
                            flex: 1,
                            marginLeft: 10
                        }]}
                        placeholder={"a********@gmail.com"}
                        onChangeText={text => this.setState({emailTxt: Utility.userInput(text)})}
                        value={this.state.emailTxt}
                        multiline={false}
                        numberOfLines={1}
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
                <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
                <View style={{
                    flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                    marginEnd: 10,
                }}>
                    <Text style={[CommonStyle.textStyle]}>
                        {language.maturity_Date}
                    </Text>
                    <TextInput
                        selectionColor={themeStyle.THEME_COLOR}
                        style={[CommonStyle.textStyle, {
                            alignItems: "flex-end",
                            textAlign: 'right',
                            flex: 1,
                            marginLeft: 10
                        }]}
                        placeholder={""}
                        onChangeText={text => this.setState({
                            MaturityDate: Utility.userInput(text)
                        })}
                        value={this.state.MaturityDate}
                        multiline={false}
                        numberOfLines={1}
                        onFocus={() => this.setState({focusUid: true})}
                        onBlur={() => this.setState({focusUid: false})}
                        contextMenuHidden={true}
                        placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                        autoCorrect={false}
                        editable={false}
                        maxLength={13}/>
                </View>
                <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
                <Text style={CommonStyle.mark_mandatory}>*{language.mark_field_mandatory}</Text>
                <View style={{marginStart: 10, marginEnd: 10, marginTop: 10}}>
                    <Text style={CommonStyle.themeMidTextStyle}>{language.notes}:</Text>
                    <Text style={CommonStyle.themeTextStyle}>{language.fixed_deposit_note1}</Text>
                    <Text style={CommonStyle.themeTextStyle}>{language.fixed_deposit_note2}</Text>
                    <Text style={CommonStyle.themeTextStyle}>{language.fixed_deposit_note3}</Text>
                    <Text style={CommonStyle.themeTextStyle}>{language.fixed_deposit_note4}</Text>
                    <Text style={CommonStyle.themeTextStyle}>{language.fixed_deposit_note5}</Text>
                    <Text style={CommonStyle.themeTextStyle}>{language.fixed_deposit_note6}</Text>
                    <Text style={CommonStyle.themeTextStyle}>{language.fixed_deposit_note7}</Text>
                    <Text style={CommonStyle.themeTextStyle}>{language.fixed_deposit_note8}</Text>
                    <Text style={CommonStyle.themeTextStyle}>{language.fixed_deposit_note9}</Text>
                    <Text style={CommonStyle.themeTextStyle}>{language.fixed_deposit_note10}</Text>
                    <Text style={CommonStyle.themeTextStyle}>{language.fixed_deposit_note11}</Text>
                    <Text style={CommonStyle.themeTextStyle}>{language.fixed_deposit_note12}</Text>
                    <Text style={CommonStyle.themeTextStyle}>{language.fixed_deposit_note13}</Text>
                </View>
            </View>
        )
    }

    render() {
        let language = this.props.language;
        return (<View style={{flex: 1, backgroundColor: themeStyle.BG_COLOR}}>
                <SafeAreaView/>
                <View style={CommonStyle.toolbar}>
                    <TouchableOpacity
                        style={CommonStyle.toolbar_back_btn_touch}
                        onPress={() => this.props.navigation.goBack(null)}>
                        <Image style={CommonStyle.toolbar_back_btn}
                               source={Platform.OS === "android" ?
                                   require("../../resources/images/ic_back_android.png") : require("../../resources/images/ic_back_ios.png")}/>
                    </TouchableOpacity>
                    <Text style={CommonStyle.title}>{this.state.title}</Text>
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
                        }}
                               source={require("../../resources/images/ic_logout.png")}/>
                    </TouchableOpacity>
                </View>
                <ScrollView showsVerticalScrollIndicator={false}>
                    {this.fixedDepositView(language)}
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
                                          onPress={() => this.submit(language, this.props.navigation)}>
                            <View style={{
                                alignItems: "center",
                                justifyContent: "center",
                                height: Utility.setHeight(46),
                                borderRadius: Utility.setHeight(23),
                                backgroundColor: themeStyle.THEME_COLOR
                            }}>
                                <Text
                                    style={[CommonStyle.midTextStyle, {color: themeStyle.WHITE}]}>{language.Confirm}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
                <Modal
                    animationType="none"
                    transparent={true}
                    visible={this.state.modalVisible}
                    onRequestClose={() => {
                        this.setState({modalVisible: false})
                    }}>
                    <View style={CommonStyle.centeredView}>
                        <View style={CommonStyle.modalView}>
                            <View style={{
                                width: "100%",
                                backgroundColor: themeStyle.THEME_COLOR,
                                height: Utility.setHeight(30),
                                justifyContent: "center"
                            }}>
                                <Text style={[CommonStyle.midTextStyle, {
                                    textAlign: "center",
                                    color: themeStyle.WHITE,

                                }]}>{this.state.modalTitle}</Text>
                            </View>

                            <FlatList style={{backgroundColor: themeStyle.WHITE, width: "100%"}}
                                      data={this.state.modalData} keyExtractor={(item, index) => item.key}
                                      renderItem={({item}) =>
                                          <TouchableOpacity onPress={() => this.onSelectItem(item)}>
                                              <View
                                                  style={{height: Utility.setHeight(35), justifyContent: "center"}}>
                                                  <Text
                                                      style={[CommonStyle.textStyle, {
                                                          color: themeStyle.THEME_COLOR,
                                                          marginStart: 10
                                                      }]}>{item.label}</Text>
                                              </View>
                                          </TouchableOpacity>
                                      }
                                      ItemSeparatorComponent={this.renderSeparator}/>
                        </View>
                    </View>
                </Modal>
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
        }
        this.props.navigation.setOptions({
            tabBarLabel: this.props.language.more
        });
    }

}

const styles = {
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
    }

}

const mapStateToProps = (state) => {
    return {
        langId: state.accountReducer.langId,
        language: state.accountReducer.language,
    };
};

export default connect(mapStateToProps)(FixedDeposit);
