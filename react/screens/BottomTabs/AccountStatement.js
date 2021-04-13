import React, {Component} from "react";
import {
    Platform,
    StatusBar,
    View,
    Image,
    SafeAreaView,
    TouchableOpacity,
    Text,
    ScrollView,
    Modal,
    FlatList, BackHandler, TextInput
} from "react-native";

import {connect} from "react-redux";
import themeStyle from "../../resources/theme.style";
import Utility from "../../utilize/Utility";
import CommonStyle from "../../resources/CommonStyle";
import {BusyIndicator} from "../../resources/busy-indicator";
import DateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment";
import RadioForm from "react-native-simple-radio-button";


class AccountStatement extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectTypeVal: -1,
            modelSelection: "",
            modalVisible: false,
            modalTitle: "",
            modalData: [],
            selectAccountType: props.language.bkash_select_acct,
            selectMonthType: props.language.select_month,
            fromDate: "",
            errorFromDate: "",
            endDate: "",
            errorEndDate: "",
            dateVal: new Date(),
            statementFormatType:0,

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
        const {modelSelection,} = this.state;
        if (modelSelection === "accountType") {
            this.setState({selectAccountType: item.label, selectTypeVal: item.value, modalVisible: false})
        }else if (modelSelection === "monthType") {
            this.setState({selectMonthType: item.label, selectMonthTypeVal: item.value, modalVisible: false})
        }
    }

    showDatepicker = (id) => {
        console.log("click");
        this.setState({currentSelection: id, show: true, mode: "date"});
    };

    onChange = (event, selectedDate) => {
        if (event.type !== "dismissed" && selectedDate !== undefined) {
            console.log("selectedDate-", selectedDate);
            let currentDate = selectedDate === "" ? new Date() : selectedDate;
            console.log("currentDate get date ", currentDate.getDate() + 1)
            currentDate = moment(currentDate).format("DD-MMM-YYYY");
            // this.setState({dateVal: selectedDate, fromDate: currentDate, show: false});
            this.setState({dateVal: selectedDate, show: false}, () => {
                if (this.state.currentSelection === 0) {
                    this.setState({errorFromDate: "", fromDate: currentDate})
                } else {
                    this.setState({errorEndDate: "", endDate: currentDate})
                }
            });

        } else {
            this.setState({show: false});
        }
    };

    accountStatement(language) {
        return (
            <View>
                <View style={{}}>
                    {
                        <Text style={[CommonStyle.labelStyle, {
                            color: themeStyle.THEME_COLOR,
                            marginStart: 10,
                            marginEnd: 10,
                            marginTop: 6,
                            marginBottom: 4
                        }]}>
                            {language.statement_account_number}
                            <Text style={{color: themeStyle.THEME_COLOR}}> *</Text>
                        </Text>
                    }
                    <TouchableOpacity
                        onPress={() => this.openModal("accountType", language.bkash_select_acct, language.statementTypeArr, language)}>
                        <View style={CommonStyle.selectionBg}>
                            <Text style={[CommonStyle.midTextStyle, {
                                color: this.state.selectAccountType === language.bkash_select_acct ? themeStyle.SELECT_LABEL : themeStyle.BLACK,
                                flex: 1
                            }]}>
                                {this.state.selectAccountType}
                            </Text>
                            <Image resizeMode={"contain"} style={CommonStyle.arrowStyle}
                                   source={require("../../resources/images/ic_arrow_down.png")}/>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
                <View style={{
                    flexDirection: "row",
                    marginStart: 10,
                    height: Utility.setHeight(50),
                    alignItems: "center",
                    marginEnd: 10,
                }}>
                    <Text style={[CommonStyle.textStyle]}>
                        {language.statement_from_date}
                        <Text style={{color: themeStyle.THEME_COLOR}}>*</Text>
                    </Text>
                    <TouchableOpacity style={{
                        marginLeft: 10,
                        flex: 1,
                    }} onPress={() => this.showDatepicker(0)}>
                        <TextInput
                            selectionColor={themeStyle.THEME_COLOR}
                            style={[CommonStyle.textStyle, {
                                alignItems: "flex-end",
                                textAlign: 'right',
                            }]}
                            placeholder={language.select_from_date}
                            editable={false}
                            value={this.state.fromDate}
                            multiline={false}
                            numberOfLines={1}
                            contextMenuHidden={true}
                            placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                            autoCorrect={false}/>
                    </TouchableOpacity>
                </View>
                {this.state.errorFromDate !== "" ?
                    <Text style={CommonStyle.errorStyle}>{this.state.errorFromDate}</Text> : null}
                <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>

                <View style={{
                    flexDirection: "row",
                    marginStart: 10,
                    height: Utility.setHeight(50),
                    alignItems: "center",
                    marginEnd: 10,
                }}>
                    <Text style={[CommonStyle.textStyle]}>
                        {language.statement_end_date}
                        <Text style={{color: themeStyle.THEME_COLOR}}>*</Text>
                    </Text>
                    <TouchableOpacity style={{
                        marginLeft: 10,
                        flex: 1,
                    }} onPress={() => this.showDatepicker(1)}>
                        <TextInput
                            selectionColor={themeStyle.THEME_COLOR}
                            style={[CommonStyle.textStyle, {
                                alignItems: "flex-end",
                                textAlign: 'right',
                            }]}
                            placeholder={language.select_end_date}
                            editable={false}
                            value={this.state.endDate}
                            multiline={false}
                            numberOfLines={1}
                            contextMenuHidden={true}
                            placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                            autoCorrect={false}/>
                    </TouchableOpacity>
                </View>
                {this.state.errorEndDate !== "" ?
                    <Text style={CommonStyle.errorStyle}>{this.state.errorEndDate}</Text> : null}
                <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
                <View style={{flex: 1, alignItems:"center",marginTop:10,marginBottom:10}}>
                    <Text style={CommonStyle.textStyle}>{language.or_txt}</Text>
                </View>
                {/*<View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>*/}
                <View style={{flex: 1}}>
                    {
                        <Text style={[CommonStyle.labelStyle, {
                            color: themeStyle.THEME_COLOR,
                            marginStart: 10,
                            marginEnd: 10,
                            marginTop: 6,
                            marginBottom: 4
                        }]}>
                            {language.monthly_statement}
                            <Text style={{color: themeStyle.THEME_COLOR}}> *</Text>
                        </Text>
                    }
                    <TouchableOpacity
                        onPress={() => this.openModal("monthType", language.select_month, language.monthTypeArr, language)}>
                        <View style={CommonStyle.selectionBg}>
                            <Text style={[CommonStyle.midTextStyle, {
                                color: this.state.selectMonthType === language.select_month ? themeStyle.SELECT_LABEL : themeStyle.BLACK,
                                flex: 1
                            }]}>
                                {this.state.selectMonthType}
                            </Text>
                            <Image resizeMode={"contain"} style={CommonStyle.arrowStyle}
                                   source={require("../../resources/images/ic_arrow_down.png")}/>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>

                <View style={{flexDirection: "row", marginStart: 10, marginEnd: 10}}>
                    <Text style={[CommonStyle.textStyle, {marginTop: 10}]}>
                        {language.statement_format}
                        <Text style={{color: themeStyle.THEME_COLOR}}>*</Text>
                    </Text>
                    <RadioForm
                        radio_props={language.statement_format_props}
                        initial={this.state.transferModeType}
                        buttonSize={9}
                        selectedButtonColor={themeStyle.THEME_COLOR}
                        formHorizontal={false}
                        labelHorizontal={true}
                        borderWidth={1}
                        borderColor={themeStyle.PLACEHOLDER_COLOR}
                        buttonColor={themeStyle.GRAY_COLOR}
                        labelColor={themeStyle.PLACEHOLDER_COLOR}
                        labelStyle={[CommonStyle.textStyle, {color: this.state.transferBEFTMode ? themeStyle.BLACK : themeStyle.PLACEHOLDER_COLOR}]}
                        style={{marginStart: 15, marginTop: 10, marginBottom: 10}}
                        animation={true}
                        onPress={(value) => {
                            this.setState({statementFormatType: value});
                        }}
                    />
                </View>
                <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
            </View>
        )
    }

    async onSubmit(language, navigation) {
        console.log("submit callled")
        if (this.state.selectAccountType === language.bkash_select_acct) {
            Utility.alert(language.error_select_statement_from_type, language.ok);
        } else if (this.state.fromDate === "") {
            this.setState({errorFromDate: language.error_from_date});
        }else if (this.state.endDate === "") {
            this.setState({errorEndDate: language.error_end_date});
        }else if (this.state.selectMonthType === language.select_month) {
            Utility.alert(language.errorSelect_month, language.ok);
        }
        else{
            this.props.navigation.navigate("AccountDetails")
        }
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
                                   require("../../resources/images/ic_back_android.png") : require("../../resources/images/ic_back_ios.png")}/>
                    </TouchableOpacity>
                    <Text style={CommonStyle.title}>{language.accountStatement}</Text>
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
                               source={require("../../resources/images/ic_logout.png")}/>
                    </TouchableOpacity>
                </View>
                <ScrollView showsVerticalScrollIndicator={false}>
                    {this.accountStatement(language)}

                    <TouchableOpacity style={{flex: 1}}
                                      onPress={() => this.onSubmit(language, this.props.navigation)}>
                        <View style={{
                            alignSelf: "center",
                            justifyContent: "center",
                            height: Utility.setHeight(46),
                            width: Utility.getDeviceWidth() / 2.5,
                            borderRadius: Utility.setHeight(23),
                            marginBottom: 10,
                            marginTop: 40,
                            backgroundColor: themeStyle.THEME_COLOR
                        }}>
                            <Text
                                style={[CommonStyle.midTextStyle, {
                                    color: themeStyle.WHITE,
                                    textAlign: "center"
                                }]}>{language.submitRequest}</Text>
                        </View>
                    </TouchableOpacity>

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
                                      keyExtractor={(item, index) => index+""}
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
                {this.state.show && (
                    <DateTimePicker
                        testID="dateTimePicker"
                        value={new Date()}
                        mode={this.state.mode}
                        minimumDate={new Date()}
                        is24Hour={false}
                        display="default"
                        onChange={this.onChange}
                    />
                )}
                <BusyIndicator visible={this.state.isProgress}/>
            </View>
        );
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
        this.props.navigation.goBack(null);
    }

}


const mapStateToProps = (state) => {
    return {
        langId: state.accountReducer.langId,
        language: state.accountReducer.language,
    };
};

export default connect(mapStateToProps)(AccountStatement);

