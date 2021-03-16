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
import {AddBeneficiary, GETACCTBALDETAIL, GETBANKDETAILS} from "../Requests/RequestBeneficiary";
import {validateCard} from "../Requests/CommonRequest";

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
            selectBankVal: null,
            selectBranchVal: null,
            selectDistrictVal: null,
            modelSelection: "",
            modalVisible: false,
            modalTitle: "",
            modalData: [],
            updateTitle: props.route.params.title
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
            Utility.alert(language.noRecord);
        }
    }

    resetData(item, props) {
        this.setState({
            selectType: item.label,
            selectTypeVal: item.value,
            modalVisible: false,
            account_card_name: "",
            accountNo: "371599109150690",
            error_accountNo: "",
            error_cardName: "",
            error_cardName: "",
            districtTypeArr: [],
            branchTypeArr: [],
            selectBankType: props.language.select_bank_type,
            selectDistrictType: props.language.select_district_type,
            selectBranchType: props.language.select_branch_type,
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

    userInput(text) {
        if (text.indexOf(" ") !== -1)
            text = text.replace(/\s/g, '');
        this.setState({nickname: text, error_nickname: ""})
    }

    accountchange(text) {
        if (text.indexOf(" ") !== -1)
            text = text.replace(/\s/g, '');
        this.setState({accountNo: text, error_accountNo: ""})
    }

    async onSubmit(language, navigation) {
        if (this.state.nickname === "") {
            this.setState({error_nickname: language.require_nickname});
            return;
        } else if (this.state.selectTypeVal === -1) {
            Utility.alert(language.select_type_account);
            return
        } else if (this.state.selectTypeVal === 0 && this.state.accountNo.length !== 13) {
            this.setState({error_accountNo: language.require_valid_actNumber})
            return;
        } else if (this.state.selectTypeVal === 1 && (this.state.accountNo.length < 15 || !validateCard(this.state.accountNo))) {
            this.setState({error_accountNo: language.invalid_cardNumber})
            return;
        } else if (this.state.account_card_name === "") {
            this.setState({error_cardName: this.state.selectTypeVal === 1 ? language.require_cardname : language.require_actName});
            return;
        } else if (this.state.selectBankType === language.select_bank_type) {
            Utility.alert(language.error_select_bank_name);
            return;
        } else if (this.state.selectTypeVal === 0 && this.state.selectDistrictType === language.select_district_type) {
            Utility.alert(language.error_select_district_name);
            return;
        } else if (this.state.selectTypeVal === 0 && this.state.selectBranchType === language.select_branch_type) {
            Utility.alert(language.error_select_branch_name);
            return;
        }
        this.getActDetails(language);
    }

    getActDetails(language) {
        this.setState({isProgress: true});
        let object = {
            selectType: this.state.selectType,
            selectTypeVal: this.state.selectTypeVal,
            nickname: this.state.nickname,
            accountNo: this.state.accountNo,
            account_card_name: this.state.account_card_name,
            bankDetails: this.state.selectBankVal,
            districtDetails: this.state.selectTypeVal === 0 ? this.state.selectDistrictVal : "",
            branchDetails: this.state.selectTypeVal === 0 ? this.state.selectBranchVal : "",
            mobile_number: this.state.mobile_number,
            emailTxt: this.state.emailTxt,
        }

        console.log("object", object);
        this.props.navigation.navigate("ViewBeneficiaryOtherBank", {details: object});
    }

    accountNoOption(language) {
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
                    numberOfLines={1}
                    contextMenuHidden={true}
                    placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                    autoCorrect={false}
                    returnKeyType={"next"}
                    onSubmitEditing={(event) => {
                        this.actNoRef.focus();
                    }}
                />
            </View>
            {this.state.error_nickname !== "" ?
                <Text style={{
                    marginStart: 10, color: themeStyle.THEME_COLOR, fontSize: FontSize.getSize(11),
                    fontFamily: fontStyle.RobotoRegular,
                }}>{this.state.error_nickname}</Text> : null}
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
                <View style={[styles.selectionBg, {height: Utility.setHeight(40)}]}>
                    <Text style={[CommonStyle.midTextStyle, {color: themeStyle.BLACK, flex: 1}]}>
                        {this.state.selectType}
                    </Text>
                    <Image resizeMode={"contain"} style={styles.arrowStyle}
                           source={require("../../resources/images/ic_arrow_down.png")}/>
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
                    maxLength={this.state.selectTypeVal === 1 ? 16 : 13}/>
            </View>
            {this.state.error_accountNo !== "" ?
                <Text style={{
                    marginLeft: 5, color: themeStyle.THEME_COLOR, fontSize: FontSize.getSize(11),
                    fontFamily: fontStyle.RobotoRegular,
                }}>{this.state.error_accountNo}</Text> : null}
            <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
            <View style={{
                flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                marginEnd: 10,
            }}>
                <Text style={[CommonStyle.textStyle]}>
                    {this.state.selectTypeVal === 1 ? language.cardHolderName : language.actHolderName}
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
                        account_card_name: text
                    })}
                    value={this.state.account_card_name}
                    multiline={false}
                    numberOfLines={1}
                    contextMenuHidden={true}
                    placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                    autoCorrect={false}
                />
            </View>
            {this.state.error_cardName !== "" ?
                <Text style={{
                    marginStart: 10, color: themeStyle.THEME_COLOR, fontSize: FontSize.getSize(11),
                    fontFamily: fontStyle.RobotoRegular,
                }}>{this.state.error_cardName}</Text> : null}
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
                    <View style={styles.selectionBg}>
                        <Text style={[CommonStyle.midTextStyle, {
                            color: this.state.selectBankType === language.select_bank_type ? themeStyle.SELECT_LABEL : themeStyle.BLACK,
                            flex: 1
                        }]}>
                            {this.state.selectBankType}
                        </Text>
                        <Image resizeMode={"contain"} style={styles.arrowStyle}
                               source={require("../../resources/images/ic_arrow_down.png")}/>
                    </View>
                </TouchableOpacity>
            </View>
            {this.state.selectTypeVal !== 1 ? <View>
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
                        <View style={styles.selectionBg}>
                            <Text style={[CommonStyle.midTextStyle, {
                                color: this.state.selectDistrictType === language.select_district_type ? themeStyle.SELECT_LABEL : themeStyle.BLACK,
                                flex: 1
                            }]}>
                                {this.state.selectDistrictType}
                            </Text>
                            <Image resizeMode={"contain"} style={styles.arrowStyle}
                                   source={require("../../resources/images/ic_arrow_down.png")}/>
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
                        <View style={styles.selectionBg}>
                            <Text style={[CommonStyle.midTextStyle, {
                                color: this.state.selectBranchType === language.select_branch_type ? themeStyle.SELECT_LABEL : themeStyle.BLACK,
                                flex: 1
                            }]}>
                                {this.state.selectBranchType}
                            </Text>
                            <Image resizeMode={"contain"} style={styles.arrowStyle}
                                   source={require("../../resources/images/ic_arrow_down.png")}/>
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
            </View>
            <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
            <View style={{}}>
                <Text style={styles.textView}>{language.notes}:</Text>
                <Text style={styles.textView}>{language.beneficiary_otherBank_note1}</Text>
                <Text style={styles.textView}>{language.beneficiary_otherBank_note2}</Text>
                <Text style={styles.textView}>{language.beneficiary_otherBank_note3}</Text>
                <Text style={styles.textView}>{language.beneficiary_otherBank_note4}</Text>
                <Text style={styles.textView}>{language.beneficiary_otherBank_note5}</Text>
                <Text style={styles.textView}>{language.beneficiary_otherBank_note6}</Text>
                <Text style={styles.textView}>{language.beneficiary_otherBank_note7}</Text>
                <Text style={styles.textView}>{language.beneficiary_otherBank_note8}</Text>
                <Text style={styles.textView}>{language.beneficiary_otherBank_note9}</Text>
                <Text style={styles.textView}>{language.beneficiary_otherBank_note10}</Text>
                <Text style={styles.textView}>{language.beneficiary_otherBank_note11}</Text>
                <Text style={styles.textView}>{language.beneficiary_otherBank_note12}</Text>
                <Text style={styles.textView}>{language.beneficiary_otherBank_note13}</Text>
                <Text style={styles.textView}>{language.beneficiary_otherBank_note14}</Text>
                <Text style={styles.textView}>{language.beneficiary_otherBank_note15}</Text>
            </View>
        </View>)
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
                        onPress={() => this.props.navigation.goBack(null)}>
                        <Image style={CommonStyle.toolbar_back_btn}
                               source={Platform.OS === "android" ?
                                   require("../../resources/images/ic_back_android.png") : require("../../resources/images/ic_back_ios.png")}/>
                    </TouchableOpacity>
                    <Text style={CommonStyle.title}> {this.state.updateTitle}</Text>
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
                                      data={this.state.modalData} keyExtractor={(item, index) => index + ""}
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
            tabBarLabel: this.props.language.transfer
        });
    }

    async getBankName() {
        this.setState({
            isProgress: true
        });
        await GETBANKDETAILS(this.props.userDetails, this.props, "BANK", this.state.selectTypeVal === 1).then(response => {
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
        await GETBANKDETAILS(userDetails, this.props, "DIST", false).then(response => {
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
        await GETBANKDETAILS(userDetails, this.props, "BRANCH", false).then(response => {
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

const styles =
    {
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
        textView: {
            marginStart: 10,
            color: themeStyle.THEME_COLOR
        },
        modalView: {
            width: Utility.getDeviceWidth() - 30,
            overflow: "hidden",
            borderRadius: 10,
            maxHeight: Utility.getDeviceHeight() - 100,
            alignItems: "center",
            shadowColor: "#000",
            shadowOffset:
                {
                    width: 0,
                    height: 2
                }, shadowOpacity: 0.25,
            shadowRadius: 3.84, elevation: 5
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

export default connect(mapStateToProps)(BeneficiaryOtherBank);
