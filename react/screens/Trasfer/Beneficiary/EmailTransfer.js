import React, {Component} from "react";
import {
    FlatList,
    Image, Modal,
    Platform,
    SafeAreaView, ScrollView,
    StatusBar,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import themeStyle from "../../../resources/theme.style";
import CommonStyle from "../../../resources/CommonStyle";
import {connect} from "react-redux";
import Utility from "../../../utilize/Utility";
import FontSize from "../../../resources/ManageFontSize";
import fontStyle from "../../../resources/FontStyle";
import RadioForm from "react-native-simple-radio-button";
import {BusyIndicator} from "../../../resources/busy-indicator";

class EmailTransfer extends Component {
    constructor(props) {
        super(props);
        let language = props.language;
        this.state = {
            options: [
                {id: 0, title: props.language.ownAccount, selected: false},
                {id: 1, title: props.language.cityAccount, selected: true},
            ],
            data: [
                {
                    nickname: "Ebad Vai",
                    transferAmount: "10.00",
                    beneficiary_email_address: "test123@gmail.com",
                    ValidTill: "8-FEB-2021 06:36:21 PM"
                },
                {
                    nickname: "Masvm",
                    transferAmount: "470.00",
                    beneficiary_email_address: "test123@gmail.com",
                    ValidTill: "7-APR-2019 11:06:50 PM"
                },
                {
                    nickname: "Onn bkash",
                    transferAmount: "500.00",
                    beneficiary_email_address: "test123@gmail.com",
                    ValidTill: "31-MARCH-2019 03:53:15 PM"
                },
                {
                    nickname: "test",
                    transferAmount: "500.00",
                    beneficiary_email_address: "test123@gmail.com",
                    ValidTill: "27-MARCH-2019 07:36:21 PM"
                }
            ],
            stateVal: 0,
            nickname: "",
            mobile_number:"",
            focusUid: false,
            focusPwd: false,
            isProgress: false,
            selectBeneficiaryType: props.language.select_beneficiary_type,
            selectAcctType: props.language.select_from_account,
            selectTypeVal: -1,
            modelSelection: "",
            modalVisible: false,
            modalTitle: "",
            modalData: [],
            otp_type: 0,
            availableBalance:"",
            error_availablebal:"",
            paymentAmount:"",
            error_paymentAmount:"",
            servicesCharge:"",
            error_servicescharge:"",
            grandtotal:"",
            error_grandtotal:"",
            remarks:"",
            error_remarks:"",
            mobile_number:"",
            errorEmail:"",
            securityQuestions: "",
            error_security:"",
            errorAnswer:"",
            answer:"",
            title:"",
            email:"",
            emailTxt:"",
            selectNicknameType: props.language.select_nickname,

        }
    }


    async changeCard(cardCode) {
        this.setState({
            stateVal: cardCode
        })
    }

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
            this.setState({selectNicknameType: item.label, selectTypeVal: item.value, modalVisible: false})
        }
        else if (modelSelection === "accountType") {
            this.setState({selectAcctType: item.label, selectTypeVal: item.value, modalVisible: false})
        }
    }

    setTitle= (item) => {
        this.setState({title: item.name,email:item.email})
    }

    async onSubmit(language, navigation) {
        console.log("name",this.state.name)
        /*    if(this.state.name === "undefined" && this.state.email == "undefined") {
                console.log("")
            }*/
        if (this.state.selectNicknameType === language.select_nickname) {
            Utility.alert(language.error_select_nickname,language.ok);
            return;
        }
        else if(this.state.selectAcctType===language.select_from_account){
            Utility.alert(language.error_select_from_type,language.ok);
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
        }else{
            let tempArr = [];
            tempArr.push(
                {key: language.nick_name, value: this.state.selectNicknameType},
                {key: language.beneficiary_Email_Address, value: this.state.emailTxt},
                {key: language.beneficiary_mobile_number, value:this.state.mobileNumber},
                {key: language.fromAccount, value: this.state.selectAcctType},
                {key:language.email,value:this.state.emailTxt},
                {key:language.available_bal,value:this.state.availableBalance},
                {key:language.payment_amount,value:this.state.paymentAmount},
                {key:language.security_questions,value:this.state.securityQuestions},
                {key:language.answer,value:this.state.answer},
                {key:language.remarks,value:this.state.remarks},
                {key:language.services_charge,value:this.state.servicesCharge},
                {key:language.vat,value:this.state.vat},
                {key:language.grand_total,value:this.state.grandtotal},
                {key:language.otpType,value:language.otp_props[this.state.otp_type].label},
            )
            console.log("temp array is email trnasfer",tempArr)

            this.props.navigation.navigate("TransferConfirm", {
                routeVal: [{name: 'Transfer'},{name: 'EmailTransfer'}],
                routeIndex: 1,
                title: language.email_transfer,
                transferArray:tempArr,
                screenName:"Otp"
            });
        }
        // Utility.alertWithBack(language.ok_txt, language.success_saved, navigation)
    }

    _renderItem = ({item, index}) => {
        return (
             <TouchableOpacity onPress={()=>this.props.navigation.navigate("EmailTransferDetails")}>
            <View style={{
                flexDirection: "row", justifyContent: "space-between",
                width: Utility.getDeviceWidth(),
                paddingTop: 10,
                paddingBottom: 10,
                backgroundColor: index % 2 === 0 ? null : themeStyle.SEPARATOR
            }}>
                <View style={{flex: 0.8, flexDirection: "column", marginStart: 10, marginEnd: 10}}>
                    <Text style={[CommonStyle.textStyle, {}]}>{item.nickname}</Text>
                    <Text style={[CommonStyle.textStyle, {}]}>{item.beneficiary_email_address}</Text>
                    <Text style={[CommonStyle.textStyle, {
                        fontSize: FontSize.getSize(12),
                        color: themeStyle.PLACEHOLDER_COLOR
                    }]}>
                        {item.ValidTill}
                    </Text>
                </View>
                <View style={{flex: 0.2,justifyContent:"center"}}>
                    <Text style={[CommonStyle.textStyle, {
                        color: themeStyle.THEME_COLOR, marginStart: 10, marginEnd: 10, textAlign: "center",alignItems:"center"
                    }]}>{item.transferAmount}</Text>
                </View>
            </View>
             </TouchableOpacity>
        )
    }


    sendOption(language) {
        return (
            <View>
                <View style={{flex:1}}>
                    <Text style={[CommonStyle.labelStyle, {
                        color: themeStyle.THEME_COLOR,
                        marginStart: 10,
                        marginEnd: 10,
                        marginTop: 6,
                    }]}>
                        {language.nick_name}
                        <Text style={{color: themeStyle.THEME_COLOR}}> *</Text>
                    </Text>
                    <TouchableOpacity
                        onPress={() => this.openModal("type", language.selectNickType, language.nickTypeArr, language)}>
                        <View style={CommonStyle.selectionBg}>
                            <Text style={[CommonStyle.midTextStyle, {
                                color: this.state.selectNicknameType === language.select_nickname ? themeStyle.SELECT_LABEL : themeStyle.BLACK,
                                flex: 1
                            }]}>
                                {this.state.selectNicknameType}
                            </Text>
                            <Image resizeMode={"contain"} style={CommonStyle.arrowStyle}
                                   source={require("../../../resources/images/ic_arrow_down.png")}/>
                        </View>
                    </TouchableOpacity>
                </View>

                <View style={{}}>
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
                        onPress={() => this.props.navigation.navigate("SelectBeneficiary",{setTitle:this.setTitle.bind(this)})}>
                        <View style={[CommonStyle.selectionBg,{}]}>
                            <View style={{flex:1,flexDirection:"column"}}>
                                <Text style={[CommonStyle.midTextStyle,{}]}>{this.state.title?this.state.title:this.state.selectBeneficiaryType}</Text>
                                {this.state.email?<Text style={[CommonStyle.midTextStyle,{}]}>{this.state.email}</Text>:null}
                            </View>
                            <Image resizeMode={"contain"} style={CommonStyle.arrowStyle}
                                   source={require("../../../resources/images/ic_arrow_down.png")}/>
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
                            maxLength={11}/>
                    </View>
                </View>
                <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
                <View style={{flex:1}}>
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
                        onPress={() => this.openModal("accountType", language.select_from_account, language.cardNumber, language)}>
                        <View style={CommonStyle.selectionBg}>
                            <Text style={[CommonStyle.midTextStyle, {
                                color: this.state.selectAcctType === language.select_from_account ? themeStyle.SELECT_LABEL : themeStyle.BLACK,
                                flex: 1
                            }]}>
                                {this.state.selectAcctType}
                            </Text>
                            <Image resizeMode={"contain"} style={CommonStyle.arrowStyle}
                                   source={require("../../../resources/images/ic_arrow_down.png")}/>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
                <View style={{
                    flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                    marginEnd: 10,
                }}>
                    <Text style={[CommonStyle.textStyle]}>
                        {language.beneficiary_Email_Address}
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
                        numberOfLines={1}
                        contextMenuHidden={true}
                        placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                        autoCorrect={false}
                    /></View>
                {this.state.errorEmail !== "" ?
                    <Text style={CommonStyle.errorStyle}>{this.state.errorEmail}</Text> : null}
                <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
                <View style={{
                    flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                    marginEnd: 10,
                }}>
                    <Text style={[CommonStyle.textStyle,{flex:1}]}>
                        {language.available_bal}
                    </Text>
                    <TextInput
                        selectionColor={themeStyle.THEME_COLOR}
                        style={[CommonStyle.textStyle, {alignItems: "flex-end", textAlign: 'right',marginLeft:10}]}
                        placeholder={"00.00"}
                        onChangeText={text => this.setState({
                            error_availablebal: "",
                            availableBalance: Utility.userInput(text)
                        })}
                        value={this.state.availableBalance}
                        multiline={false}
                        numberOfLines={1}
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
                    <Text style={CommonStyle.errorStyle
                    }>{this.state.error_paymentAmount}</Text> : null}
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
                        maxLength={30}/>
                </View>
                {this.state.error_security !==  "" ?
                    <Text style={CommonStyle.errorStyle
                    }>{this.state.error_security}</Text> : null}
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
                    <Text style={CommonStyle.errorStyle
                    }>{this.state.errorAnswer}</Text> : null}
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
                    <Text style={CommonStyle.errorStyle
                    }>{this.state.error_remarks}</Text> : null}
                <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>

                <View style={{
                    flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                    marginEnd: 10,
                }}>
                    <Text style={[CommonStyle.textStyle]}>
                        {language.services_charge}
                    </Text>
                    <TextInput
                        ref={(ref) => this.serviceschargeRef = ref}
                        selectionColor={themeStyle.THEME_COLOR}
                        style={[CommonStyle.textStyle, {alignItems: "flex-end", textAlign: 'right',flex: 1,marginLeft:10}]}
                        placeholder={"00.00"}
                        onChangeText={text => this.setState({
                            error_servicescharge: "",
                            servicesCharge: Utility.userInput(text)
                        })}
                        value={this.state.servicesCharge}
                        multiline={false}
                        numberOfLines={1}
                        onFocus={() => this.setState({focusUid: true})}
                        onBlur={() => this.setState({focusUid: false})}
                        contextMenuHidden={true}
                        keyboardType={"number-pad"}
                        placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                        autoCorrect={false}
                        maxLength={13}/>
                    <Text style={{paddingLeft:5}}>BDT</Text>
                </View>
                {this.state.error_servicescharge !==  "" ?
                    <Text style={CommonStyle.errorStyle
                    }>{this.state.error_servicescharge}</Text> : null}
                <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>

                <View style={{
                    flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                    marginEnd: 10,
                }}>
                    <Text style={[CommonStyle.textStyle,{flex: 1}]}>
                        {language.vat}
                    </Text>
                    <TextInput
                        selectionColor={themeStyle.THEME_COLOR}
                        style={[CommonStyle.textStyle, {
                            alignItems: "flex-end",
                            textAlign: 'right',
                            marginLeft: 10
                        }]}
                        placeholder={"00.00"}
                        onChangeText={text => this.setState({
                            error_vat: "",
                            vat: Utility.userInput(text)
                        })}
                        value={this.state.vat}
                        multiline={false}
                        numberOfLines={1}
                        contextMenuHidden={true}
                        keyboardType={"number-pad"}
                        placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                        autoCorrect={false}
                        editable={false}
                        returnKeyType={"next"}
                        onSubmitEditing={(event) => {
                            this.grandtotalRef.focus();
                        }}
                        maxLength={13}/>
                </View>
                <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
                <View style={{
                    flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                    marginEnd: 10,
                }}>
                    <Text style={[CommonStyle.textStyle]}>
                        {language.grand_total}
                    </Text>
                    <TextInput
                        ref={(ref) => this.grandtotalRef = ref}
                        selectionColor={themeStyle.THEME_COLOR}
                        style={[CommonStyle.textStyle, {alignItems: "flex-end", textAlign: 'right',flex: 1,marginLeft:10}]}
                        placeholder={"00.00"}
                        onChangeText={text => this.setState({
                            error_grandtotal: "",
                            grandtotal: Utility.userInput(text)
                        })}
                        value={this.state.grandtotal}
                        multiline={false}
                        numberOfLines={1}
                        onFocus={() => this.setState({focusUid: true})}
                        onBlur={() => this.setState({focusUid: false})}
                        contextMenuHidden={true}
                        keyboardType={"number-pad"}
                        placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                        autoCorrect={false}
                        maxLength={13}/>
                    <Text style={{paddingLeft:5}}>BDT</Text>
                </View>
                {this.state.error_grandtotal !==  "" ?
                    <Text style={CommonStyle.errorStyle
                    }>{this.state.error_grandtotal}</Text> : null}
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
                <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
                <Text style={CommonStyle.mark_mandatory}>*{language.mark_field_mandatory}</Text>
                <View style={{marginStart:10,marginEnd:10}}>
                    <Text style={CommonStyle.themeMidTextStyle}>{language.notes}</Text>
                    <Text style={CommonStyle.themeTextStyle}>{language.email_transfer_note1}</Text>
                    <Text style={CommonStyle.themeTextStyle}>{language.email_transfer_note2}</Text>
                    <Text style={CommonStyle.themeTextStyle}>{language.email_transfer_note3}</Text>
                    <Text style={CommonStyle.themeTextStyle}>{language.email_transfer_note4}</Text>
                </View>

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
        )
    }

    waitingOption(language) {
        return (
            <View style={{}}>
                <View style={[CommonStyle.selectionBg, {
                    flexDirection: "row",
                    justifyContent: "space-between",
                    paddingTop: 10,
                    paddingBottom: 10
                }]}>
                    <Text style={[CommonStyle.midTextStyle, {
                        color: themeStyle.BLACK
                    }]}>
                        {language.description}
                    </Text>
                    <Text style={[CommonStyle.midTextStyle, {
                        color: themeStyle.BLACK,
                    }]}>
                        {language.amount}
                    </Text>
                </View>
                <FlatList data={this.state.data}
                          renderItem={this._renderItem}
                          keyExtractor={(item, index) => index + ""}
                />

            </View>
        )
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
                    <Text style={CommonStyle.title}>{language.email_transfer}</Text>
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
                <View style={[styles.headerLabel, {
                    marginTop: 10, marginStart: 10,
                    marginEnd: 10,
                }]}>
                    <TouchableOpacity
                        onPress={() => this.changeCard(0)}
                        style={{
                            height: "100%",
                            //width: Utility.setWidth(65),,
                            paddingLeft: 70,
                            paddingRight: 70,
                            justifyContent: "center",
                            borderBottomLeftRadius: this.state.stateVal === 1 ? 3 : 0,
                            borderTopLeftRadius: this.state.stateVal === 1 ? 3 : 0,
                            backgroundColor: this.state.stateVal === 0 ? themeStyle.THEME_COLOR : "#F4F4F4",
                        }}>
                        <Text style={[styles.langText, {
                            fontFamily: fontStyle.RobotoMedium,
                            fontSize: FontSize.getSize(11),
                            color: this.state.stateVal === 0 ? themeStyle.WHITE : themeStyle.BLACK
                        }]}>{this.props.language.send}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => this.changeCard(1)}
                        style={{
                            height: "100%",
                            //width: Utility.setWidth(65),
                            paddingLeft: 70,
                            paddingRight: 70,
                            justifyContent: "center",
                            borderBottomRightRadius: this.state.stateVal === 1 ? 5 : 0,
                            borderTopRightRadius: this.state.stateVal === 1 ? 5 : 0,
                            backgroundColor: this.state.stateVal === 1 ? themeStyle.THEME_COLOR : "#F4F4F4",
                        }}>
                        <Text style={[styles.langText, {
                            fontFamily: fontStyle.RobotoMedium,
                            fontSize: FontSize.getSize(11),
                            color: this.state.stateVal === 1 ? themeStyle.WHITE : themeStyle.BLACK
                        }]}>{this.props.language.waiting}</Text>
                    </TouchableOpacity>
                </View>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{flex: 1, paddingBottom: 30}}>
                {this.state.stateVal === 0 ? this.sendOption(language) : this.waitingOption(language)}
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

            </View>)
    }

    componentDidMount() {
        if (Platform.OS === "android") {
            this.focusListener = this.props.navigation.addListener("focus", () => {
                StatusBar.setTranslucent(false);
                StatusBar.setBackgroundColor(themeStyle.THEME_COLOR);
                StatusBar.setBarStyle("light-content");
            });
        }
        // bottom tab management
        this.props.navigation.setOptions({
            tabBarLabel: this.props.language.transfer
        });
    }
}

const styles = {
    headerLabel: {
        flexDirection: "row",
        //backgroundColor: themeStyle.THEME_COLOR,
        height: Utility.setHeight(40),
        borderRadius: 5,
        borderWidth: 1,
        borderColor: themeStyle.WHITE,
        overflow: "hidden"
    },

}
const mapStateToProps = (state) => {
    return {
        langId: state.accountReducer.langId,
        language: state.accountReducer.language,
    };
};

export default connect(mapStateToProps)(EmailTransfer);

