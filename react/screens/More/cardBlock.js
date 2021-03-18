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
    TextInput, FlatList
} from "react-native";
import themeStyle from "../../resources/theme.style";
import CommonStyle from "../../resources/CommonStyle";
import React, {Component} from "react";
import {BusyIndicator} from "../../resources/busy-indicator";
import Utility from "../../utilize/Utility";
import MonthPicker from "react-native-month-year-picker";

class cardBlock extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isProgress: false,
            selectType: props.language.select_reason,
            selectCard: props.language.select_card_number,
            selectTypeVal: -1,
            selectActCard: props.language.TypeOfTransferArr[0],
            modelSelection: "",
            modalVisible: false,
            modalTitle: "",
            modalData: [],
            title:props.route.params.title,
            cardStatus:"",
            cardState:"",
            cardHolderName:"",
            cardType:"",
            cardExpiry: "",
            showMonthPicker: false,
            errorExpiry:"",
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
            Utility.alert(language.noRecord);
        }
    }

    onSelectItem(item) {
        const {modelSelection} = this.state;
        if (modelSelection === "creditCardType") {
            this.setState({selectCard: item.label, selectTypeVal: item.value, modalVisible: false})
        }else if(modelSelection === "cardBlockType"){
            this.setState({selectType: item.label, selectTypeVal: item.value, modalVisible: false})
        }
    }

    submit(language, navigation) {
        if (this.state.selectCard === language.select_card_number) {
            Utility.alert(language.errorSelectCard);
            return;
        }
        else if (this.state.selectType === language.select_reason) {
            Utility.alert(language.error_select_reason);
            return;
        }
        else{
            Utility.alertWithBack(language.ok_txt, language.success_saved, navigation)
        }
    }
    onValueChange = (event, newDate) => {
        console.log("event", event + "-" + newDate);
        let dateVal = Utility.dateInFormat(newDate, "MM/YY")
        switch (event) {
            case "dateSetAction":
                this.setState({cardExpiry: dateVal, showMonthPicker: false});
                break;
            case "neutralAction":
                break;
            case "dismissedAction":
            default:
                this.setState({showMonthPicker: false});
        }
    }


    creditCardActivation(language){
        return(
            <View style={{flex: 1, paddingBottom: 30}}>
                <Text style={[CommonStyle.labelStyle, {
                    color: themeStyle.THEME_COLOR,
                    marginStart: 10,
                    marginEnd: 10,
                    marginTop: 6,
                    marginBottom: 4
                }]}>
                    {language.credit_card_no}
                    <Text style={{color: themeStyle.THEME_COLOR}}> *</Text>
                </Text>
                <TouchableOpacity
                    onPress={() => this.openModal("creditCardType", language.select_card_number, language.cardTypeArr, language)}>
                    <View style={CommonStyle.selectionBg}>
                        <Text style={[CommonStyle.midTextStyle, {
                            color: this.state.selectCard === language.select_card_number ? themeStyle.SELECT_LABEL : themeStyle.BLACK,
                            flex: 1
                        }]}>
                            {this.state.selectCard}
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
                        {language.card_holder_name}
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
                            cardHolderName: Utility.userInput(text)
                        })}
                        value={this.state.cardHolderName}
                        multiline={false}
                        onFocus={() => this.setState({focusUid: true})}
                        onBlur={() => this.setState({focusUid: false})}
                        numberOfLines={1}
                        contextMenuHidden={true}
                        editable={false}
                        placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                        autoCorrect={false}
                    />
                </View>
                <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
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
                        placeholder={""}
                        onChangeText={text => this.setState({
                            cardType: Utility.userInput(text)
                        })}
                        value={this.state.cardType}
                        multiline={false}
                        onFocus={() => this.setState({focusUid: true})}
                        onBlur={() => this.setState({focusUid: false})}
                        numberOfLines={1}
                        contextMenuHidden={true}
                        editable={false}
                        placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                        autoCorrect={false}
                    />
                </View>
                <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
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
                        placeholder={""}
                        onChangeText={text => this.setState({
                            cardStatus: Utility.userInput(text)
                        })}
                        value={this.state.cardStatus}
                        multiline={false}
                        onFocus={() => this.setState({focusUid: true})}
                        onBlur={() => this.setState({focusUid: false})}
                        numberOfLines={1}
                        contextMenuHidden={true}
                        editable={false}
                        placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                        autoCorrect={false}
                    />
                </View>
                <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>

                <Text style={[CommonStyle.labelStyle, {
                    color: themeStyle.THEME_COLOR,
                    marginStart: 10,
                    marginEnd: 10,
                    marginTop: 6,
                    marginBottom: 4
                }]}>
                    {language.card_block}
                </Text>
                <TouchableOpacity
                    onPress={() => this.openModal("cardBlockType", language.select_reason, language.cardBlockTypeArr, language)}>
                    <View style={CommonStyle.selectionBg}>
                        <Text style={[CommonStyle.midTextStyle, {
                            color: this.state.selectType === language.select_reason ? themeStyle.SELECT_LABEL : themeStyle.BLACK,
                            flex: 1
                        }]}>
                            {this.state.selectType}
                        </Text>
                        <Image resizeMode={"contain"} style={CommonStyle.arrowStyle}
                               source={require("../../resources/images/ic_arrow_down.png")}/>
                    </View>
                </TouchableOpacity>
                <Text style={[styles.textView,{marginTop: 20}]}>{language.notes}:</Text>
                <Text style={styles.textView}>{language.card_block_notes1}</Text>
                <Text style={styles.textView}>{language.card_block_notes2}</Text>
                <Text style={styles.textView}>{language.card_block_notes3}</Text>
                <Text style={styles.textView}>{language.card_block_notes4}</Text>
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
                                   require("../../resources/images/ic_back_android.png") : require("../../resources/images/ic_back_ios.png")}/>
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
                               source={require("../../resources/images/ic_logout.png")}/>
                    </TouchableOpacity>
                </View>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{flex: 1, paddingBottom: 30}}>
                        {this.creditCardActivation(language)}
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
                                        style={[CommonStyle.midTextStyle, {color: themeStyle.WHITE}]}>{this.state.stateVal === 3 ? language.submit_txt : language.next}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
                {this.state.showMonthPicker ? <MonthPicker
                    onChange={this.onValueChange}
                    value={new Date()}
                    minimumDate={new Date()}
                    maximumDate={new Date(new Date().getFullYear() + 10, 12)}
                    locale="en"
                    mode="number"
                /> : null}
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
}

const styles = {
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

export default connect(mapStateToProps)(cardBlock);
