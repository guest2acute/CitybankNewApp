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
    TextInput, FlatList, Platform, StatusBar,BackHandler
} from "react-native";
import themeStyle from "../../../resources/theme.style";
import fontStyle from "../../../resources/FontStyle";
import FontSize from "../../../resources/ManageFontSize";
import CommonStyle from "../../../resources/CommonStyle";
import React, {Component} from "react";
import {BusyIndicator} from "../../../resources/busy-indicator";
import Utility from "../../../utilize/Utility";
import {AddBeneficiary, GETACCTBALDETAIL, GETBANKDETAILS} from "../../Requests/RequestBeneficiary";
import {MoreDetails, validateCard} from "../../Requests/CommonRequest";
import {actions} from "../../../redux/actions";

class BeneficiaryOtherBank extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nickname: "",
            account_card_name: "",
            accountNo: "",
            mobile_number: "",
            emailTxt: "",
            errorEmail: "",
            error_nickname: "",
            error_accountNo: "",
            error_cardName: "",
            isProgress: false,
            bankTypeArr: [],
            districtTypeArr: [],
            branchTypeArr: [],
            selectType: props.language.select_type_account,
            selectBankType: props.language.select_bank_type,
            selectDistrictType: props.language.select_district_type,
            selectBranchType: props.language.select_branch_type,
            selectTypeVal: -1,
            selectBankVal: -1,
            selectBranchVal: -1,
            selectDistrictVal: -1,
            modelSelection: "",
            modalVisible: false,
            modalTitle: "",
            modalData: [],
            updateTitle: props.route.params.title,
            isMainView: true
        }
        console.log("updated title is", props.route.params.title)
    }

    openModal(option, title, data, language) {
        if (data.length > 0) {
            this.setState({
                modelSelection: option,
                modalTitle: title,
                modalData: data, modalVisible: true
            });
        } else {
            Utility.alert(language.noRecord, language.ok);
        }
    }

    resetData(item, props) {
        this.setState({
            selectType: item.label,
            selectTypeVal: item.value,
            modalVisible: false,
            account_card_name: "",
            accountNo: "",
            error_accountNo: "",
            error_cardName: "",
            districtTypeArr: [],
            branchTypeArr: [],
            selectBankType: props.language.select_bank_type,
            selectDistrictType: props.language.select_district_type,
            selectBankVal: null,
            selectBranchVal: null,
            selectDistrictVal: null,

        }, async () => await this.getBankName())
    }

    onSelectItem(item) {
        const {modelSelection} = this.state;
        if (modelSelection === "type") {
            this.resetData(item, this.props);
        } else if (modelSelection === "bankType") {
            this.setState({
                selectBankType: item.label, selectBankVal: item.details,
                modalVisible: false
            }, async () => {
                if (this.state.selectTypeVal === 0)
                    await this.getDistrictName();
            })
        } else if (modelSelection === "district_type") {
            this.setState({
                selectDistrictType: item.label, selectDistrictVal: item.details,
                modalVisible: false
            }, async () => {
                if (this.state.selectTypeVal === 0)
                    await this.getBranchName()
            })
        } else if (modelSelection === "branch_type") {
            this.setState({
                selectBranchType: item.label, selectBranchVal: item.details,
                modalVisible: false
            })
        }
    }


    accountchange(text) {
        if (text.indexOf(" ") !== -1)
            text = text.replace(/\s/g, '');
        this.setState({accountNo: text, error_accountNo: ""})
    }

    async onSubmit(language, navigation) {
        console.log("selectType value", this.state.selectTypeVal);
        if (this.state.isMainView) {
            if (this.state.nickname === "") {
                this.setState({error_nickname: language.require_nickname});
            } else if (this.state.selectTypeVal === -1) {
                Utility.alert(language.select_type_account, language.ok);
            } else if (this.state.selectTypeVal === 0 && this.state.accountNo.length === 0) {
                this.setState({error_accountNo: language.require_accnumber})
            } else if (this.state.selectTypeVal === 1 && this.state.accountNo.length === 0) {
                this.setState({error_accountNo: language.require_cardnumber})
            } else if (this.state.selectTypeVal === 1 && !validateCard(this.state.accountNo)) {
                this.setState({error_accountNo: language.invalid_cardNumber});
            } else if (this.state.account_card_name === "") {
                this.setState({error_cardName: this.state.selectTypeVal === 1 ? language.require_cardname : language.require_actName});
            } else if (this.state.selectBankType === language.select_bank_type) {
                Utility.alert(language.error_select_bank_name, language.ok);
            } else if (this.state.selectTypeVal === 0 && this.state.selectDistrictType === language.select_district_type) {
                Utility.alert(language.error_select_district_name, language.ok);
            } else if (this.state.selectTypeVal === 0 && this.state.selectBranchType === language.select_branch_type) {
                Utility.alert(language.error_select_branch_name, language.ok);
            } else if (this.state.mobile_number !== "" && !Utility.ValidateMobileNumber(this.state.mobile_number)) {
                this.setState({errorMobileNo: language.invalidMobile});
            } else if (this.state.emailTxt !== "" && !Utility.validateEmail(this.state.emailTxt)) {
                this.setState({errorEmail: language.invalidEmail});
            } else
                this.setState({isMainView: false})
        } else {
            this.beneficiaryAdd(language, navigation);
        }
    }

    resetScreen = () => {
        this.setState({
            nickname: "",
            account_card_name: "",
            accountNo: "",
            mobile_number: "",
            emailTxt: "",
            bankTypeArr: [],
            districtTypeArr: [],
            branchTypeArr: [],
            selectType: this.props.language.select_type_account,
            selectBankType: this.props.language.select_bank_type,
            selectDistrictType: this.props.language.select_district_type,
            selectBranchType: this.props.language.select_branch_type,
            selectTypeVal: -1,
            selectBankVal: -1,
            selectBranchVal: -1,
            selectDistrictVal: -1,
            modelSelection: "",
            modalVisible: false,
            modalTitle: "",
            modalData: [],
            updateTitle: this.props.route.params.title,
            isMainView: true
        });

    }


    confirmDetails(language) {
        let arrayList = [{key: language.nick_name, value: this.state.nickname},
            {key: language.account_Type, value: this.state.selectType},
            {key: language.account_card_number, value: this.state.accountNo},
            {key: language.account_card_name, value: this.state.account_card_name},
            {
                key: language.bank_name,
                value: this.state.selectBankVal.BANK_NM
            }];

        if (this.state.selectTypeVal === 0) {
            arrayList.push({key: language.district_type, value: this.state.selectDistrictVal.DIST_NM},
                {key: language.branch_name, value: this.state.selectBranchVal.BRANCH_NM});
        }

        arrayList.push({key: language.beneficiary_mobile_number, value: this.state.mobile_number},
            {key: language.beneficiary_Email_Address, value: this.state.emailTxt});

        return (
            arrayList.map((item) => {
                    return (
                        <View key={item.key}>
                            <View style={{
                                flexDirection: "row",
                                height: Utility.setHeight(50),
                                marginStart: 10,
                                alignItems: "center",
                                marginEnd: 10,
                            }}>
                                <Text style={CommonStyle.textStyle}>
                                    {item.key}
                                </Text>
                                <Text
                                    style={CommonStyle.viewText}>{item.value}</Text>
                            </View>
                            <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
                        </View>)
                }
            )
        )
    }


    accountNoOption(language) {
        return (
            <View key={"accountNoOption"}>
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
                            nickname: text
                        })}
                        value={this.state.nickname}
                        multiline={false}
                        numberOfLines={1}
                        contextMenuHidden={true}
                        placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                        autoCorrect={false}
                    />
                </View>
                {this.state.error_nickname !== "" ?
                    <Text style={CommonStyle.errorStyle}>{this.state.error_nickname}</Text> : null}
                <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>

                <Text style={[CommonStyle.labelStyle, {
                    color: themeStyle.THEME_COLOR,
                    marginStart: 10,
                    marginEnd: 10,
                    marginTop: 6,
                    marginBottom: 4
                }]}>
                    {language.account_type}
                    <Text style={{color: themeStyle.THEME_COLOR}}> *</Text>
                </Text>

                <TouchableOpacity
                    onPress={() => this.openModal("type", language.selectActType, language.changeInArr, language)}>
                    <View style={[CommonStyle.selectionBg, {height: Utility.setHeight(40)}]}>
                        <Text style={[CommonStyle.midTextStyle, {color: themeStyle.BLACK, flex: 1}]}>
                            {this.state.selectType}
                        </Text>
                        <Image resizeMode={"contain"} style={CommonStyle.arrowStyle}
                               source={require("../../../resources/images/ic_arrow_down.png")}/>
                    </View>
                </TouchableOpacity>

                <View style={{
                    flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                    marginEnd: 10,
                }}>
                    <Text style={[CommonStyle.textStyle]}>
                        {this.state.selectTypeVal === 1 ? language.card_number : language.acc_number}
                        <Text style={{color: themeStyle.THEME_COLOR}}> *</Text>
                    </Text>
                    <TextInput
                        ref={(ref) => this.actNoRef = ref}
                        selectionColor={themeStyle.THEME_COLOR}
                        style={[CommonStyle.textStyle, {
                            alignItems: "flex-end",
                            textAlign: 'right',
                            flex: 1,
                            marginLeft: 10
                        }]}
                        placeholder={language.et_placeholder}
                        onChangeText={text => this.setState({
                            error_accountNo: "",
                            accountNo: Utility.input(text, "0123456789")
                        })}
                        value={this.state.accountNo}
                        multiline={false}
                        numberOfLines={1}
                        contextMenuHidden={true}
                        keyboardType={"number-pad"}
                        placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                        autoCorrect={false}
                        returnKeyType={"next"}
                        onSubmitEditing={(event) => {
                            this.cardNameRef.focus();
                        }}
                        maxLength={35}/>
                </View>
                {this.state.error_accountNo !== "" ?
                    <Text style={CommonStyle.errorStyle}>{this.state.error_accountNo}</Text> : null}
                <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
                <View style={{
                    flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                    marginEnd: 10,
                }}>
                    <Text style={[CommonStyle.textStyle]}>
                        {this.state.selectTypeVal === 1 ? language.cardHolderName : language.account_holder_name}
                        <Text style={{color: themeStyle.THEME_COLOR}}> *</Text>
                    </Text>
                    <TextInput
                        ref={(ref) => this.cardNameRef = ref}
                        selectionColor={themeStyle.THEME_COLOR}
                        style={[CommonStyle.textStyle, {
                            alignItems: "flex-end",
                            textAlign: 'right',
                            flex: 1,
                            marginLeft: 10
                        }]}
                        placeholder={language.et_placeholder}
                        onChangeText={text => this.setState({
                            error_cardName: "",
                            account_card_name: Utility.verifyAccountHolder(text)
                        })}
                        value={this.state.account_card_name}
                        multiline={false}
                        numberOfLines={1}
                        contextMenuHidden={true}
                        placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                        autoCorrect={false}
                        maxLength={35}
                    />
                </View>
                {this.state.error_cardName !== "" ?
                    <Text style={CommonStyle.errorStyle
                    }>{this.state.error_cardName}</Text> : null}
                <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
                <View style={{flex: 1}}>
                    {<Text style={[CommonStyle.labelStyle, {
                        color: themeStyle.THEME_COLOR,
                        marginStart: 10,
                        marginEnd: 10,
                        marginTop: 6,
                        marginBottom: 4
                    }]}>
                        {language.type_bank}
                        <Text style={{color: themeStyle.THEME_COLOR}}> *</Text>
                    </Text>
                    }
                    <TouchableOpacity disabled={this.state.selectTypeVal === -1}
                                      onPress={() => this.openModal("bankType", language.select_bank_type, this.state.bankTypeArr, language)}>
                        <View style={CommonStyle.selectionBg}>
                            <Text style={[CommonStyle.midTextStyle, {
                                color: this.state.selectBankType === language.select_bank_type ? themeStyle.SELECT_LABEL : themeStyle.BLACK,
                                flex: 1
                            }]}>
                                {this.state.selectBankType}
                            </Text>
                            <Image resizeMode={"contain"} style={CommonStyle.arrowStyle}
                                   source={require("../../../resources/images/ic_arrow_down.png")}/>
                        </View>
                    </TouchableOpacity>
                </View>
                {this.state.selectTypeVal !== 1 ?
                    <View>
                        <View style={{flex: 1}}>
                            <Text style={[CommonStyle.labelStyle, {
                                color: themeStyle.THEME_COLOR,
                                marginStart: 10,
                                marginEnd: 10,
                                marginTop: 6,
                                marginBottom: 4
                            }]}>
                                {language.type_district}
                                <Text style={{color: themeStyle.THEME_COLOR}}> *</Text>
                            </Text>
                            <TouchableOpacity disabled={this.state.selectBankVal === null}
                                              onPress={() => this.openModal("district_type", language.select_district_type, this.state.districtTypeArr, language)}>
                                <View style={CommonStyle.selectionBg}>
                                    <Text style={[CommonStyle.midTextStyle, {
                                        color: this.state.selectDistrictType === language.select_district_type ? themeStyle.SELECT_LABEL : themeStyle.BLACK,
                                        flex: 1
                                    }]}>
                                        {this.state.selectDistrictType}
                                    </Text>
                                    <Image resizeMode={"contain"} style={CommonStyle.arrowStyle}
                                           source={require("../../../resources/images/ic_arrow_down.png")}/>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={{flex: 1}}>
                            <Text style={[CommonStyle.labelStyle, {
                                color: themeStyle.THEME_COLOR,
                                marginStart: 10,
                                marginEnd: 10,
                                marginTop: 6,
                                marginBottom: 4
                            }]}>
                                {language.type_Branch}
                                <Text style={{color: themeStyle.THEME_COLOR}}> *</Text>
                            </Text>
                            <TouchableOpacity disabled={this.state.selectDistrictVal === null}
                                              onPress={() => this.openModal("branch_type", language.select_branch_name, this.state.branchTypeArr, language)}>
                                <View style={CommonStyle.selectionBg}>
                                    <Text style={[CommonStyle.midTextStyle, {
                                        color: this.state.selectBranchType === language.select_branch_type ? themeStyle.SELECT_LABEL : themeStyle.BLACK,
                                        flex: 1
                                    }]}>
                                        {this.state.selectBranchType}
                                    </Text>
                                    <Image resizeMode={"contain"} style={CommonStyle.arrowStyle}
                                           source={require("../../../resources/images/ic_arrow_down.png")}/>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View> : null}
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
                        {/* <TouchableOpacity onPress={() => this.props.navigation.navigate("BeneficiaryMobileNumber")}>
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
                            placeholder={"01********"}
                            onChangeText={text => this.setState({errorMobileNo:"",mobile_number: Utility.input(text, "0123456789")})}
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
                            placeholder={"a********@gmail.com"}
                            onChangeText={text => this.setState({errorEmail:"",emailTxt: Utility.userInput(text)})}
                            value={this.state.emailTxt}
                            multiline={false}
                            numberOfLines={1}
                            contextMenuHidden={true}
                            placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                            autoCorrect={false}/>
                    </View>
                    {this.state.errorEmail !== "" ?
                        <Text style={CommonStyle.errorStyle
                        }>{this.state.errorEmail}</Text> : null}
                </View>
                <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
                <View style={{marginLeft: 10, marginRight: 10}}>
                    <Text style={CommonStyle.themeMidTextStyle}>{language.note}</Text>
                    <Text style={CommonStyle.themeTextStyle}>{language.beneficiary_otherBank_note1}</Text>
                    <Text style={CommonStyle.themeTextStyle}>{language.beneficiary_otherBank_note2}</Text>
                    <Text style={CommonStyle.themeTextStyle}>{language.beneficiary_otherBank_note3}</Text>
                    <Text style={CommonStyle.themeTextStyle}>{language.beneficiary_otherBank_note4}</Text>
                    <Text style={CommonStyle.themeTextStyle}>{language.beneficiary_otherBank_note5}</Text>
                    <Text style={CommonStyle.themeTextStyle}>{language.beneficiary_otherBank_note6}</Text>
                    <Text style={CommonStyle.themeTextStyle}>{language.beneficiary_otherBank_note7}</Text>
                    <Text style={CommonStyle.themeTextStyle}>{language.beneficiary_otherBank_note8}</Text>
                    <Text style={CommonStyle.themeTextStyle}>{language.beneficiary_otherBank_note9}</Text>
                    <Text style={CommonStyle.themeTextStyle}>{language.beneficiary_otherBank_note10}</Text>
                    <Text style={CommonStyle.themeTextStyle}>{language.beneficiary_otherBank_note11}</Text>
                    <Text style={CommonStyle.themeTextStyle}>{language.beneficiary_otherBank_note12}</Text>
                    <Text style={CommonStyle.themeTextStyle}>{language.beneficiary_otherBank_note13}</Text>
                    <Text style={CommonStyle.themeTextStyle}>{language.beneficiary_otherBank_note14}</Text>
                    <Text style={CommonStyle.themeTextStyle}>{language.beneficiary_otherBank_note15}</Text>
                </View>
            </View>)
    }

    beneficiaryAdd(language, navigation) {
        const {
            selectBankVal,
            accountNo,
            nickname,
            mobile_number,
            emailTxt,
            selectTypeVal,
            account_card_name
        } = this.state;
        this.setState({isProgress: true});
        let accountDetails = {
            ACCOUNT: accountNo,
            ADDRESS: "",
            CONTACTNUMBER: mobile_number,
            ACCOUNTNAME: account_card_name
        }

        AddBeneficiary(accountDetails, "O", this.props.userDetails, nickname, mobile_number,
            emailTxt,
            selectTypeVal === 0 ? this.state.selectBranchVal.ROUTING_NO : selectBankVal.BANK_CD,
            selectBankVal.BANK_CD,
            this.props,
            selectTypeVal === 0 ? "A" : "C", "").then(response => {
            console.log("response", response);
            this.setState({
                isProgress: false,
            }, () =>
                this.props.navigation.navigate("SecurityVerification", {
                    REQUEST_CD: response.REQUEST_CD,
                    transType: "O"
                }));
        }).catch(error => {
            this.setState({isProgress: false});
            console.log("error", error);
        });
    }



    render() {
        let language = this.props.language;
        return (
            <View style={{
                flex: 1,
                backgroundColor: themeStyle.BG_COLOR
            }}>
                <SafeAreaView/>
                <View style={CommonStyle.toolbar}>
                    <TouchableOpacity
                        style={CommonStyle.toolbar_back_btn_touch}
                        onPress={() => this.backEvent()}>
                        <Image style={CommonStyle.toolbar_back_btn}
                               source={Platform.OS === "android" ?
                                   require("../../../resources/images/ic_back_android.png") : require("../../../resources/images/ic_back_ios.png")}/>
                    </TouchableOpacity>
                    <Text style={CommonStyle.title}> {this.state.updateTitle}</Text>
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
                               source={require("../../../resources/images/ic_logout.png")}/>
                    </TouchableOpacity>
                </View>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{flex: 1, paddingBottom: 30}}>
                        {this.state.isMainView ? this.accountNoOption(language) :
                            <View key={"confirmView"}>{this.confirmDetails(language)}</View>}

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
                                        style={[CommonStyle.midTextStyle, {color: themeStyle.WHITE}]}>{this.state.isMainView ? language.next : language.confirm}</Text>
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
                                      data={this.state.modalData}
                                      keyExtractor={(item, index) => index + ""}
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

    backAction = () => {
        this.backEvent();
        return true;
    }

    backEvent() {
        const {isMainView} = this.state;
        if (isMainView)
            this.props.navigation.goBack();
        else
            this.setState({isMainView: true});
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

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.langId !== this.props.langId) {
            this.props.navigation.setOptions({
                tabBarLabel: this.props.language.transfer
            });
        }

        if (this.props.isReset && this.props.beneType === "O") {
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

    async getBankName() {
        this.setState({
            isProgress: true
        });
        await GETBANKDETAILS(this.props.userDetails, this.props, "BANK",
            this.state.selectTypeVal === 1,this.state.selectTypeVal === 1?"NPSB":"ALL").then(response => {
            console.log("response", response);
            this.setState({
                isProgress: false,
                bankTypeArr: response
            });
        }).catch(error => {
            this.setState({isProgress: false});
            console.log("error", error);
        });
    }

    async getDistrictName() {
        this.setState({
            isProgress: true
        });
        let userDetails = this.props.userDetails;
        userDetails = {...userDetails, BANK_CD: this.state.selectBankVal.BANK_CD};
        await GETBANKDETAILS(userDetails, this.props, "DIST", false,
            this.state.selectTypeVal === 1?"NPSB":"ALL").then(response => {
            console.log("response", response);
            this.setState({
                isProgress: false,
                districtTypeArr: response
            });
        }).catch(error => {
            this.setState({isProgress: false});
            console.log("error", error);
        });
    }

    async getBranchName() {
        this.setState({
            isProgress: true
        });
        let userDetails = this.props.userDetails;
        userDetails = {
            ...userDetails,
            BANK_CD: this.state.selectBankVal.BANK_CD,
            DIST_CD: this.state.selectDistrictVal.DIST_CD
        };
        await GETBANKDETAILS(userDetails, this.props, "BRANCH", false,
            this.state.selectTypeVal === 1?"NPSB":"ALL").then(response => {
            console.log("response", response);
            this.setState({
                isProgress: false,
                branchTypeArr: response
            });
        }).catch(error => {
            this.setState({isProgress: false});
            console.log("error", error);
        });
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
    }
;

export default connect(mapStateToProps)(BeneficiaryOtherBank);
