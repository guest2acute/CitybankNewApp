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

class BeneficiaryOtherBank extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nickname: "",
            account_card_name: "",
            accountNo: "",
            mobile_number:"",
            emailTxt: "",
            errorEmail: "",
            error_nickname:"",
            error_accountNo:"",
            error_cardname:"",
            focusUid: false,
            focusPwd: false,
            isProgress: false,
            selectType: props.language.select_type_account,
            selectBankType: props.language.select_bank_type,
            selectDistrictType: props.language.select_district_type,
            selectBranchType: props.language.select_branch_type,
           // selectTypeAccount: props.language.select_type_account,
            selectTypeVal: -1,
            modelSelection: "",
            modalVisible: false,
            modalTitle: "",
            modalData: [],
            updateTitle: props.route.params.title
        }
        console.log("updated title is",props.route.params.title)
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
            this.setState({selectType: item.label, selectTypeVal: item.value, modalVisible: false})
        }
          else if (modelSelection === "bankType") {
            this.setState({selectBankType: item.label, selectTypeVal: item.value, modalVisible: false})
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
        if (this.state.nickname === "") {
            this.setState({error_nickname: language.require_nickname});
            return;
        }
        else if(this.state.accountNo===""){
            this.setState({error_accountNo:language.require_cardnumber})
            return;
        }
        else if(this.state.account_card_name===""){
            this.setState({error_cardname:language.require_cardname})
            return;
        }else if(this.state.selectTypeVal === -1) {
            Utility.alert("Please Select Account Type");
            return;
        }
        else if (this.state.selectBankType === "Select Bank Name") {
            Utility.alert("Please Select Bank Name");
            return;
        }
        else if (this.state.selectDistrictType === "Select District Name") {
            Utility.alert("Please Select District Name");
            return;
        }
        else if (this.state.selectBranchType === "Select Branch Name") {
            Utility.alert("Please Select Branch Name");
            return;
        }
        else if (this.state.selectTypeVal === 2) {
            return;
        }
        this.props.navigation.navigate("ViewBeneficiaryOtherBank");
        //Utility.alertWithBack(language.ok_txt, language.success_saved, navigation)
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
                    onFocus={() => this.setState({focusUid: true})}
                    onBlur={() => this.setState({focusUid: false})}
                    numberOfLines={1}
                    contextMenuHidden={true}
                    editable={this.state.updateTitle==="Update Beneficiary - Other Bank"?false:true}
                    placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                    autoCorrect={false}
                />
            </View>
                {this.state.error_nickname !==  "" ?
                    <Text style={{
                    marginStart: 10, color: themeStyle.THEME_COLOR, fontSize: FontSize.getSize(11),
                        fontFamily: fontStyle.RobotoRegular,
                    }}>{this.state.error_nickname}</Text> : null}
            <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
                <View style={{flex: 1}}>
                    <Text style={[CommonStyle.labelStyle, {
                        color: themeStyle.THEME_COLOR,
                        marginStart: 10,
                        marginEnd: 10,
                        marginTop: 6,
                    }]}>
                        {language.acc_type}
                    </Text>
                    <TouchableOpacity disabled={this.state.updateTitle==="Update Beneficiary - Other Bank"?true:false}
                        onPress={() => this.openModal("type", language.selectActType, language.accountTypeArr, language)}>
                        <View style={styles.selectionBg}>
                            <Text style={[CommonStyle.midTextStyle, {
                                color: this.state.selectType === language.select_type_account ? themeStyle.SELECT_LABEL : themeStyle.BLACK,
                                flex: 1
                            }]}>
                                {this.state.selectType}
                            </Text>
                            <Image resizeMode={"contain"} style={styles.arrowStyle}
                                   source={require("../../resources/images/ic_arrow_down.png")}/>
                        </View>
                    </TouchableOpacity>
                </View>
            <View style={{
                flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                marginEnd: 10,
            }}>
                <Text style={[CommonStyle.textStyle]}>
                    {language.acc_card_number}
                    <Text style={{color: themeStyle.THEME_COLOR}}> *</Text>
                </Text>
                <TextInput
                    selectionColor={themeStyle.THEME_COLOR}
                    style={[CommonStyle.textStyle, {alignItems: "flex-end", textAlign: 'right',flex: 1,marginLeft:10}]}
                    placeholder={language.et_placeholder}
                    onChangeText={text => this.setState({
                        error_accountNo: "",
                        accountNo: Utility.userInput(text)
                    })}
                    value={this.state.accountNo}
                    multiline={false}
                    numberOfLines={1}
                    onFocus={() => this.setState({focusUid: true})}
                    onBlur={() => this.setState({focusUid: false})}
                    contextMenuHidden={true}
                    keyboardType={"number-pad"}
                    placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                    autoCorrect={false}
                    returnKeyType={"next"}
                    editable={this.state.updateTitle==="Update Beneficiary - Other Bank"?false:true}
                    onSubmitEditing={(event) => {
                        this.cardnameRef.focus();
                    }}
                    maxLength={13}/>
            </View>
            {this.state.error_accountNo !==  "" ?
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
                        {language.acc_card_name}
                        <Text style={{color: themeStyle.THEME_COLOR}}> *</Text>
                    </Text>
                    <TextInput
                        ref={(ref) => this.cardnameRef = ref}
                        selectionColor={themeStyle.THEME_COLOR}
                        style={[CommonStyle.textStyle, {
                            alignItems: "flex-end",
                            textAlign: 'right',
                            flex: 1,
                            marginLeft: 10
                        }]}
                        placeholder={language.et_placeholder}
                        onChangeText={text => this.setState({
                            error_cardname: "",
                            account_card_name: Utility.userInput(text)
                        })}
                        value={this.state.account_card_name}
                        multiline={false}
                        onFocus={() => this.setState({focusUid: true})}
                        onBlur={() => this.setState({focusUid: false})}
                        numberOfLines={1}
                        contextMenuHidden={true}
                        placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                        editable={this.state.updateTitle==="Update Beneficiary - Other Bank"?false:true}
                        autoCorrect={false}
                    />
                </View>
                {this.state.error_cardname !==  "" ?
                    <Text style={{
                        marginStart: 10, color: themeStyle.THEME_COLOR, fontSize: FontSize.getSize(11),
                        fontFamily: fontStyle.RobotoRegular,
                    }}>{this.state.error_cardname}</Text> : null}
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
                <TouchableOpacity
                    onPress={() => this.openModal("bankType", language.select_bank_type, language.bankTypeArr, language)}>
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
                <TouchableOpacity
                    onPress={() => this.openModal("district_type", language.select_district_type, language.districtTypeArr, language)}>
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
                <TouchableOpacity
                    onPress={() => this.openModal("branch_type", language.select_branch_name, language.branchTypeArr, language)}>
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
                <Text style={styles.textView}>1. Beneficiary banks/branches should be capable to process</Text>
                <Text style={styles.textView}>RTGS/NPSB/BEFTN transaction.</Text>
                <Text style={styles.textView}>2. BEFTN(Ragular Transfer): Transaction Process before</Text>
                <Text style={styles.textView}>10:30 PM,any amount up to 5 lacs. Transfer Processed</Text>
                <Text style={styles.textView}>through BEFTN whould be credited by next working day.the amount</Text>
                <Text style={styles.textView}>3. RTGS (instant transfer): Transactions processed before</Text>
                <Text style={styles.textView}>10:30 PM,any amount up to 5 lacs </Text>
                <Text style={styles.textView}>must be between 1 lac to 5 lacs</Text>
                <Text style={styles.textView}>4. NPSB (instant transfer). transfer can be processd</Text>
                <Text style={styles.textView}>anytime. Transaction limit is BDT 2 lacs in 5 transaction </Text>
                <Text style={styles.textView}>per day and BDT 2 lacs in 5 transacations</Text>
                <Text style={styles.textView}>5. For NPSB transfer,while adding DBBL beneficiary, complete</Text>
                <Text style={styles.textView}>13-digit account number will be required. in case of adding</Text>
                <Text style={styles.textView}>DBBL credit  card,the digit 100001 need to be added</Text>
                <Text style={styles.textView}>before the 13-digit card number.</Text>
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
        maxHeight:Utility.getDeviceHeight()-100,
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

export default connect(mapStateToProps)(BeneficiaryOtherBank);
