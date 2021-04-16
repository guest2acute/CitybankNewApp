import React, {Component} from "react";
import {connect} from "react-redux";
import {
    BackHandler, FlatList,
    Image, Modal,
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
import {BusyIndicator} from "../../../resources/busy-indicator";
import RadioForm from "react-native-simple-radio-button";

class ClubBillPayment extends Component {

    constructor(props) {
        super(props);
        this.state={
            SelectClubName: props.language.select_club_name,
            SelectFromAccount:props.language.select_from_account,
            modelSelection: "",
            modalVisible: false,
            modalTitle: "",
            modalData: [],
            isProgress: false,
            memberId:"",
            error_memberId:"",
            nameOfTheMember:"",
            memberType:"",
            memberSince:"",
            amount:"",
            error_amount:"",
            availableBalance:"",
            totalAmount:"",
            servicesCharge:"",
            vat:"",
            grandTotal:"",
            accountNumber:"",
            otp_type:0

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
            Utility.alert(language.noRecord, language.ok);
        }
    }


    onSelectItem(item) {
        let language = this.props.language;
        const {modelSelection} = this.state;
        console.log("modelSelection is this", item)
        if (modelSelection === "clubType") {
            this.setState({SelectClubName: item.label, selectCompanyTypeVal: item.value, modalVisible: false})
        }else if (modelSelection === "accountType") {
            this.setState({SelectFromAccount: item.label, selectFromTypeVal: item.value, modalVisible: false})
        }
    }

    resetVal(language) {
        this.setState({
            SelectClubName: this.props.language.select_club_name,
            memberId:"",
            nameOfTheMember:"",
            memberType:"",
            memberSince:"",
            amount:"",
            SelectFromAccount: this.props.language.select_from_account,
            availableBalance:"",
            servicesCharge:"",
            vat:"",
            grandTotal:"",
            otp_type:0
        })
    }

    async onSubmit(language, navigation) {
        console.log("submit called")
        if(this.state.SelectClubName===language.select_club_name){
            Utility.alert(language.error_select_club_name, language.ok);
        }else if(this.state.memberId===""){
            this.setState({error_memberId:language.require_memberId})
        }else if (this.state.amount === "") {
            this.setState({error_amount: language.error_amount})
        }else if(this.state.SelectFromAccount === language.select_from_account) {
            Utility.alert(language.error_select_from_type, language.ok);
        }else{
            this.processRequest(language)
        }
    }

    processRequest(language) {
        let tempArr = [];
        tempArr.push(
            {key: language.club_name, value: this.state.SelectClubName},
            {key: language.member_id, value: this.state.memberId},
            {key: language.name_of_the_member, value: this.state.nameOfTheMember},
            {key: language.member_type, value: this.state.memberType},
            {key: language.member_since, value: this.state.memberSince},
            {key: language.cash_amount, value: this.state.amount},
            {key: language.fromAccount, value: this.state.SelectFromAccount},
            {key: language.available_bal, value: this.state.availableBalance},
            {key: language.services_charge, value: this.state.servicesCharge},
            {key: language.vat, value: this.state.vat},
            {key: language.grand_total, value: this.state.grandTotal},
            {key:language.otpType,value:language.otp_props[this.state.otp_type].label},

        )

        console.log("tempArr", tempArr)

        this.props.navigation.navigate("TransferConfirm", {
            routeVal: [{name: 'Payments'},{name: 'ClubBillPayment'}],
            routeIndex: 1,
            title: language.club_bill_payment,
            transferArray:tempArr,
            screenName:"SecurityVerification"
        });
    }

    clubBillPayment(language){
      return(
          <View style={{flex: 1}}>
          <View style={{flex: 1}}>
              {
                  <Text style={[CommonStyle.labelStyle, {
                  color: themeStyle.THEME_COLOR,
                  marginStart: 10,
                  marginEnd: 10,
                  marginTop: 6,
                  marginBottom: 4
              }]}>
                  {language.club_name}
                  <Text style={{color: themeStyle.THEME_COLOR}}> *</Text>
              </Text>
              }
              <TouchableOpacity
                  onPress={() => this.openModal("clubType", language.select_club_name, language.club_name_props, language)}>
                  <View style={CommonStyle.selectionBg}>
                      <Text style={[CommonStyle.midTextStyle, {
                          color: this.state.SelectClubName === language.select_club_name ? themeStyle.SELECT_LABEL : themeStyle.BLACK,
                          flex: 1
                      }]}>
                          {this.state.SelectClubName}
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
                      {language.member_id}
                      <Text style={{color: themeStyle.THEME_COLOR}}>*</Text>
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
                      onChangeText={text => this.setState({error_memberId:"",
                          memberId: Utility.userInput(text)}
                          )}
                      value={this.state.memberId}
                      multiline={false}
                      numberOfLines={1}
                      contextMenuHidden={true}
                      placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                      autoCorrect={false}
                      />
              </View>
              {this.state.error_memberId !== "" ?
                  <Text style={CommonStyle.errorStyle}>{this.state.error_memberId}</Text> : null}
              <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>

              <View style={{
                  flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                  marginEnd: 10,
              }}>
                  <Text style={[CommonStyle.textStyle]}>
                      {language.name_of_the_member}
                  </Text>
                  <Text style={CommonStyle.viewText}>{this.state.nameOfTheMember}</Text>
              </View>
              <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>

              <View style={{
                  flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                  marginEnd: 10,
              }}>
                  <Text style={[CommonStyle.textStyle]}>
                      {language.member_type}
                  </Text>
                  <Text style={CommonStyle.viewText}>{this.state.memberType}</Text>
              </View>
              <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
              <View style={{
                  flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                  marginEnd: 10,
              }}>
                  <Text style={[CommonStyle.textStyle]}>
                      {language.member_since}
                  </Text>
                  <Text style={CommonStyle.viewText}>{this.state.memberSince}</Text>
              </View>
              <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>

              <View style={{
                  flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                  marginEnd: 10,
              }}>
                  <Text style={[CommonStyle.textStyle]}>
                      {language.cash_amount}
                      <Text style={{color: themeStyle.THEME_COLOR}}> *</Text>
                  </Text>
                  <TextInput
                      ref={(ref) => this.amountRef = ref}
                      selectionColor={themeStyle.THEME_COLOR}
                      style={[CommonStyle.textStyle, {
                          alignItems: "flex-end",
                          textAlign: 'right',
                          flex: 1,
                          marginLeft: 10
                      }]}
                      placeholder={language.enter_amount}
                      onChangeText={text => this.setState({
                          error_amount: "",
                          amount: Utility.userInput(text)
                      })}
                      value={this.state.amount}
                      multiline={false}
                      numberOfLines={1}
                      contextMenuHidden={true}
                      keyboardType={"number-pad"}
                      placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                      autoCorrect={false}
                      maxLength={13}/>
                  <Text style={{paddingLeft: 5}}>BDT</Text>
              </View>
              {this.state.error_amount !== "" ?
                  <Text style={CommonStyle.errorStyle}>{this.state.error_amount}</Text> : null}
              <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>

              <View style={{flex: 1}}>
                  {
                      <Text style={[CommonStyle.labelStyle, {
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
                              color: this.state.SelectFromAccount === language.select_from_account ? themeStyle.SELECT_LABEL : themeStyle.BLACK,
                              flex: 1
                          }]}>
                              {this.state.SelectFromAccount}
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
                      {language.available_bal}
                  </Text>
                  <Text style={CommonStyle.viewText}>{this.state.availableBalance}</Text>
                  <Text style={{paddingLeft: 5}}>BDT</Text>
              </View>
              <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>

              <View style={{
                  flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                  marginEnd: 10,
              }}>
                  <Text style={[CommonStyle.textStyle]}>
                      {language.services_charge}
                  </Text>
                  <Text style={CommonStyle.viewText}>{this.state.servicesCharge}</Text>
                  <Text style={{paddingLeft: 5}}>BDT</Text>
              </View>
              <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>

              <View style={{
                  flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                  marginEnd: 10,
              }}>
                  <Text style={[CommonStyle.textStyle, {flex: 1}]}>
                      {language.vat}
                  </Text>
                  <Text
                      style={CommonStyle.viewText}>{this.state.vat}</Text>
                  <Text style={{paddingLeft: 5}}>BDT</Text>
              </View>
              <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>

              <View style={{
                  flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                  marginEnd: 10,
              }}>
                  <Text style={[CommonStyle.textStyle]}>
                      {language.grand_total}
                  </Text>
                  <Text style={CommonStyle.viewText}>{this.state.grandTotal}</Text>
                  <Text style={{paddingLeft: 5}}>BDT</Text>
              </View>
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
                      key={this.state.otp_type}
                      radio_props={language.otp_props}
                      initial={this.state.otp_type}
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
                    <Text style={CommonStyle.title}>{language.club_bill_payment}</Text>
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
                        {this.clubBillPayment(language)}
                        <View style={{
                            flexDirection: "row",
                            marginStart: Utility.setWidth(10),
                            marginRight: Utility.setWidth(10),
                            marginTop: Utility.setHeight(20)
                        }}>
                            <TouchableOpacity style={{flex: 1}}  onPress={() => this.resetVal(language)}>
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
                                        style={[CommonStyle.midTextStyle, {color: themeStyle.THEME_COLOR}]}>{language.reset_txt}</Text>
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
                                        style={[CommonStyle.midTextStyle, {color: themeStyle.WHITE}]}>{language.next}</Text>
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
                                      data={this.state.modalData} keyExtractor={(item, index) => index+""}
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
            BackHandler.addEventListener(
                "hardwareBackPress",
                this.backAction
            );
        }
        this.props.navigation.setOptions({
            tabBarLabel: this.props.language.payments
        });
    }

    componentWillUnmount() {
        if (Platform.OS === "android") {
            BackHandler.removeEventListener("hardwareBackPress", this.backAction);
        }
    }

    backAction = () => {
        this.backEvent();
        return true;
    }

    backEvent() {
        this.props.navigation.goBack();
    }

}

const mapStateToProps = (state) => {
    return {
        langId: state.accountReducer.langId,
        language: state.accountReducer.language,
    };
};

export default connect(mapStateToProps)(ClubBillPayment);