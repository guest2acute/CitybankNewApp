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
import fontStyle from "../../resources/FontStyle";
import FontSize from "../../resources/ManageFontSize";
import CommonStyle from "../../resources/CommonStyle";
import React, {Component} from "react";
import {BusyIndicator} from "../../resources/busy-indicator";
import Utility from "../../utilize/Utility";
import RadioForm from "react-native-simple-radio-button";

class EmailTransferScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nickname: "",
            bkash_name: "",
            accountNo: "",
            mobile_number:"",
            emailTxt: "",
            errorEmail: "",
            error_nickname:"",
            error_accountNo:"",
            errorbkashname:"",
            focusUid: false,
            focusPwd: false,
            isProgress: false,
            selectBeneficiaryType: props.language.select_beneficiary_type,
            selectAcctType: props.language.bkash_select_acct,
            selectDistrictType: props.language.select_district_type,
            selectBranchType: props.language.select_branch_type,
           // selectTypeAccount: props.language.select_type_account,
            selectTypeVal: -1,
            modelSelection: "",
            modalVisible: false,
            modalTitle: "",
            modalData: [],
            otp_type: 0,
            availablebalance:"",
            error_availablebal:"",
            paymentAmount:"",
            error_paymentAmount:"",
            servicescharge:"",
            error_servicescharge:"",
            grandtotal:"",
            error_grandtotal:"",
            remarks:"",
            error_remarks:"",
            mobile_number:"",
            securityQuestions: "",
            error_security:"",
            errorAnswer:"",
            answer:"",
        }
    }

    openModal(option, title, data, language) {
        if (data.length > 0) {
            this.setState({
                modelSelection: option,
                modalTitle: title,
                modalData: data, modalVisible: true
            });
        } else {
            Utility.alert(language.noRecord);
        }
    }

    onSelectItem(item) {
        const {modelSelection} = this.state;
        if (modelSelection === "type") {
            this.setState({selectBeneficiaryType: item.label, selectTypeVal: item.value, modalVisible: false})
        }
          else if (modelSelection === "bankType") {
            this.setState({selectAcctType: item.label, selectTypeVal: item.value, modalVisible: false})
          }
        else if (modelSelection === "district_type") {
            this.setState({selectDistrictType: item.label, selectTypeVal: item.value, modalVisible: false})
        }
        else if (modelSelection === "branch_type") {
            this.setState({selectBranchType: item.label, selectTypeVal: item.value, modalVisible: false})
        }
    }

    userInput(text) {
        if (text.indexOf(" ") !== -1)
            text = text.replace(/\s/g, '');
        this.setState({nickname: text, error_nickname: ""})
    }

    accountchange(text){
        if (text.indexOf(" ") !== -1)
            text = text.replace(/\s/g, '');
        this.setState({accountNo: text, error_accountNo: ""})
    }

    async onSubmit(language, navigation) {
        if (this.state.selectBeneficiaryType === "Select Beneficiary Type") {
            Utility.alert("Please Select Beneficiary Type");
            return;
        }
        else if(this.state.selectAcctType==="Select Account"){
            Utility.alert("Please Select From Account");
            return;
        }
        else if(this.state.paymentAmount===""){
            this.setState({error_paymentAmount:language.err_payment_amount})
            return;
        } else if(this.state.securityQuestions === "") {
            this.setState({error_security:language.err_security})
            return;
        }
        else if(this.state.answer === "") {
            this.setState({errorAnswer:language.error_answer})
            return;
        }else if(this.state.remarks === "") {
            this.setState({error_remarks:language.errRemarks})
            return;
        }
        Utility.alertWithBack(language.ok_txt, language.success_saved, navigation)
    }

    accountNoOption(language) {
        return (<View>
            <View style={{flex: 1}}>
                <Text style={[CommonStyle.labelStyle, {
                    color: themeStyle.THEME_COLOR,
                    marginStart: 10,
                    marginEnd: 10,
                    marginTop: 6,
                }]}>
                    {language.beneficiary_type}
                    <Text style={{color: themeStyle.THEME_COLOR}}> *</Text>
                </Text>
                <TouchableOpacity
                    onPress={() => this.openModal("type", language.select_type_transfer, language.transferTypeArr, language)}>
                    <View style={styles.selectionBg}>
                        <Text style={[CommonStyle.midTextStyle, {
                            color: this.state.selectBeneficiaryType === language.select_type_account ? themeStyle.SELECT_LABEL : themeStyle.BLACK,
                            flex: 1
                        }]}>
                            {this.state.selectBeneficiaryType}
                        </Text>
                        <Image resizeMode={"contain"} style={styles.arrowStyle}
                               source={require("../../resources/images/ic_arrow_down.png")}/>
                    </View>
                </TouchableOpacity>
            </View>

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
                    <TouchableOpacity onPress={() => this.props.navigation.navigate("BeneficiaryMobileNumber")}>
                        <Image style={{
                            height: Utility.setHeight(20),
                            width: Utility.setWidth(20),
                            marginLeft: Utility.setWidth(10),
                            marginRight: Utility.setWidth(10),
                        }} resizeMode={"contain"}
                               source={require("../../resources/images/ic_beneficiary.png")}/>
                    </TouchableOpacity>
                    <TextInput
                        selectionColor={themeStyle.THEME_COLOR}
                        style={[CommonStyle.textStyle, {
                            alignItems: "flex-end",
                            textAlign: 'right',
                            flex: 1,
                            marginLeft: 10
                        }]}
                        placeholder={"01********"}
                        onChangeText={text => this.setState({mobile_number: Utility.input(text, "0123456789")})}
                        value={this.state.mobile_number}
                        multiline={false}
                        numberOfLines={1}
                        contextMenuHidden={true}
                        keyboardType={"number-pad"}
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
            <View style={{flex: 1}}>
                {<Text style={[CommonStyle.labelStyle, {
                    color: themeStyle.THEME_COLOR,
                    marginStart: 10,
                    marginEnd: 10,
                    marginTop: 6,
                    marginBottom: 4
                }]}>
                    {language.fromAccount}
                    <Text style={{color: themeStyle.THEME_COLOR}}> *</Text>
                </Text>
                }
                <TouchableOpacity
                    onPress={() => this.openModal("bankType", language.bkash_selectfrom_acct, language.cardNumber, language)}>
                    <View style={styles.selectionBg}>
                        <Text style={[CommonStyle.midTextStyle, {
                            color: this.state.selectAcctType === language.select_bank_type ? themeStyle.SELECT_LABEL : themeStyle.BLACK,
                            flex: 1
                        }]}>
                            {this.state.selectAcctType}
                        </Text>
                        <Image resizeMode={"contain"} style={styles.arrowStyle}
                               source={require("../../resources/images/ic_arrow_down.png")}/>
                    </View>
                </TouchableOpacity>
            </View>
            <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>

            <View style={{
                flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                marginEnd: 10,
            }}>
                <Text style={[CommonStyle.textStyle]}>
                    {language.available_bal}
                </Text>
                <TextInput
                    selectionColor={themeStyle.THEME_COLOR}
                    style={[CommonStyle.textStyle, {alignItems: "flex-end", textAlign: 'right',flex: 1,marginLeft:10}]}
                    placeholder={"00.00"}
                    onChangeText={text => this.setState({
                        error_availablebal: "",
                        availablebalance: Utility.userInput(text)
                    })}
                    value={this.state.availablebalance}
                    multiline={false}
                    numberOfLines={1}
                    onFocus={() => this.setState({focusUid: true})}
                    onBlur={() => this.setState({focusUid: false})}
                    contextMenuHidden={true}
                    keyboardType={"number-pad"}
                    placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                    autoCorrect={false}
                    editable={false}
                    maxLength={13}/>
                <Text style={{paddingLeft:5}}>BDT</Text>
            </View>
            <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>

            <View style={{
                flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                marginEnd: 10,
            }}>
                <Text style={[CommonStyle.textStyle]}>
                    {language.payment_amount}
                </Text>
                <TextInput

                    selectionColor={themeStyle.THEME_COLOR}
                    style={[CommonStyle.textStyle, {alignItems: "flex-end", textAlign: 'right',flex: 1,marginLeft:10}]}
                    placeholder={language.payment_amount_pl}
                    onChangeText={text => this.setState({
                        error_paymentAmount: "",
                        paymentAmount: Utility.userInput(text)
                    })}
                    value={this.state.paymentAmount}
                    multiline={false}
                    numberOfLines={1}
                    onFocus={() => this.setState({focusUid: true})}
                    onBlur={() => this.setState({focusUid: false})}
                    contextMenuHidden={true}
                    keyboardType={"number-pad"}
                    placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                    autoCorrect={false}
                    returnKeyType={"next"}
                    onSubmitEditing={(event) => {
                        this.paymentAmountRef.focus();
                    }}
                    maxLength={13}/>
                <Text style={{paddingLeft:5}}>BDT</Text>
            </View>
            {this.state.error_paymentAmount !==  "" ?
                <Text style={{
                    marginLeft: 5, color: themeStyle.THEME_COLOR, fontSize: FontSize.getSize(11),
                    fontFamily: fontStyle.RobotoRegular,
                }}>{this.state.error_paymentAmount}</Text> : null}
            <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>

            <View style={{
                flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                marginEnd: 10,
            }}>
                <Text style={[CommonStyle.textStyle]}>
                    {language.security_questions}
                    <Text style={{color: themeStyle.THEME_COLOR}}> *</Text>
                </Text>
                <TextInput
                    ref={(ref) => this.paymentAmountRef = ref}
                    selectionColor={themeStyle.THEME_COLOR}
                    style={[CommonStyle.textStyle, {alignItems: "flex-end", textAlign: 'right',flex: 1,marginLeft:10}]}
                    placeholder={language.security_pl_holder}
                    onChangeText={text => this.setState({
                        error_security: "",
                        securityQuestions: Utility.userInput(text)
                    })}
                    value={this.state.securityQuestions}
                    multiline={false}
                    numberOfLines={1}
                    onFocus={() => this.setState({focusUid: true})}
                    onBlur={() => this.setState({focusUid: false})}
                    contextMenuHidden={true}
                    placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                    autoCorrect={false}
                    returnKeyType={"next"}
                    onSubmitEditing={(event) => {
                        this.answerRef.focus();
                    }}
                    maxLength={13}/>
            </View>
            {this.state.error_security !==  "" ?
                <Text style={{
                    marginLeft: 5, color: themeStyle.THEME_COLOR, fontSize: FontSize.getSize(11),
                    fontFamily: fontStyle.RobotoRegular,
                }}>{this.state.error_security}</Text> : null}
            <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>

            <View style={{
                flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                marginEnd: 10,
            }}>
                <Text style={[CommonStyle.textStyle]}>
                    {language.answer}
                    <Text style={{color: themeStyle.THEME_COLOR}}> *</Text>
                </Text>
                <TextInput
                    ref={(ref) => this.answerRef = ref}
                    selectionColor={themeStyle.THEME_COLOR}
                    style={[CommonStyle.textStyle, {alignItems: "flex-end", textAlign: 'right',flex: 1,marginLeft:10}]}
                    placeholder={language.answer_pl}
                    onChangeText={text => this.setState({
                        errorAnswer: "",
                        answer: Utility.userInput(text)
                    })}
                    value={this.state.answer}
                    multiline={false}
                    numberOfLines={1}
                    onFocus={() => this.setState({focusUid: true})}
                    onBlur={() => this.setState({focusUid: false})}
                    contextMenuHidden={true}
                    placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                    autoCorrect={false}
                    returnKeyType={"next"}
                    onSubmitEditing={(event) => {
                        this.remarksRef.focus();
                    }}
                    maxLength={13}/>
            </View>
            {this.state.errorAnswer !==  "" ?
                <Text style={{
                    marginLeft: 5, color: themeStyle.THEME_COLOR, fontSize: FontSize.getSize(11),
                    fontFamily: fontStyle.RobotoRegular,
                }}>{this.state.errorAnswer}</Text> : null}
            <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>


            <View style={{
                flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                marginEnd: 10,
            }}>
                <Text style={[CommonStyle.textStyle]}>
                    {language.remarks}
                    <Text style={{color: themeStyle.THEME_COLOR}}> *</Text>
                </Text>
                <TextInput
                    ref={(ref) => this.remarksRef = ref}
                    selectionColor={themeStyle.THEME_COLOR}
                    style={[CommonStyle.textStyle, {alignItems: "flex-end", textAlign: 'right',flex: 1,marginLeft:10}]}
                    placeholder={""}
                    onChangeText={text => this.setState({
                        error_remarks: "",
                        remarks: Utility.userInput(text)
                    })}
                    value={this.state.remarks}
                    multiline={false}
                    numberOfLines={1}
                    onFocus={() => this.setState({focusUid: true})}
                    onBlur={() => this.setState({focusUid: false})}
                    contextMenuHidden={true}
                    placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                    autoCorrect={false}
                    maxLength={13}/>
            </View>
            {this.state.error_remarks !==  "" ?
                <Text style={{
                    marginLeft: 5, color: themeStyle.THEME_COLOR, fontSize: FontSize.getSize(11),
                    fontFamily: fontStyle.RobotoRegular,
                }}>{this.state.error_remarks}</Text> : null}
            <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>

            <View style={{
                flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                marginEnd: 10
            }}>
                <Text style={[CommonStyle.textStyle]}>
                    {language.otpType}
                    <Text style={{color: themeStyle.THEME_COLOR}}>*</Text>
                </Text>

                <RadioForm
                    radio_props={language.otp_props}
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
            <Text style={{marginStart: 10, marginTop: 10, color: themeStyle.THEME_COLOR}}>*{language.mark_field_mandatory}
            </Text>

            <View style={{ marginTop: 10,}}>
                <Text style={styles.textView}>{language.notes}</Text>
                <Text style={styles.textView}>1. An email transfer transaction will be valid for next 10 days.</Text>
                <Text style={styles.textView}>2. Maximum transferable amount:BDT in 5 lacs per day</Text>
                <Text style={styles.textView}>3. Generated transfer could be canceled anytime from "Waiting" Tab before withdrawing by the beneficiary.</Text>
                <Text style={styles.textView}>Beneficiary has to answer the security questions. case sensitive.</Text>
            </View>
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
                                   require("../../resources/images/ic_back_android.png") : require("../../resources/images/ic_back_ios.png")}/>
                    </TouchableOpacity>
                    <Text style={CommonStyle.title}>{language.email_transfer}</Text>
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
                               source={require("../../resources/images/ic_logout.png")}/>
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
                                        style={[CommonStyle.midTextStyle, {color: themeStyle.WHITE}]}>{this.state.stateVal === 3 ? language.submit_txt : language.next}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
                <Modal
                    animationType="none"
                    transparent={true}
                    visible={this.state.modalVisible}
                    onRequestClose={() => {
                        this.setState({modalVisible: false})
                    }}>
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
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
    textView:{
        marginStart: 10, color: themeStyle.THEME_COLOR
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
    }
}

const mapStateToProps = (state) => {
    return {
        langId: state.accountReducer.langId,
        language: state.accountReducer.language,
    };
};

export default connect(mapStateToProps)(EmailTransferScreen);