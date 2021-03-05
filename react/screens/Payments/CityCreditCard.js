import React, {Component} from "react";
import {
    FlatList,
    Image, Modal,
    Platform,
    SafeAreaView,
    ScrollView,
    StatusBar,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import themeStyle from "../../resources/theme.style";
import CommonStyle from "../../resources/CommonStyle";
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import LoginScreen from "../LoginScreen";
import TermConditionScreen from "../TermConditionScreen";
import {connect} from "react-redux";
import Utility from "../../utilize/Utility";
import FontSize from "../../resources/ManageFontSize";
import {BusyIndicator} from "../../resources/busy-indicator";


class CityCreditCard extends Component {
    constructor(props) {
        super(props);
        let language = props.language;
        this.state={
            options: [
                {id:0,title: props.language.ownAccount, selected: false},
                {id:1, title: props.language.cityAccount, selected: true},
            ],
            stateVal: 0,
            selectCreditCardType: props.language.selectCreditCard,
            modelSelection: "",
            modalVisible: false,
            modalTitle: "",
            modalData: [],
            isProgress: false,
        }
    }




    async changeCard(cardCode) {
        console.log("cardcode is this",cardCode)
        this.setState({
            stateVal:cardCode
        })
        console.log("statevalue is this", this.state.stateVal);
    }

    openModal(option, title, data, language) {
        console.log("openmodal")
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
        console.log("modelSelection is this",item)
        if (modelSelection === "type") {
            this.setState({selectCreditCardType: item.label, selectTypeVal: item.value, modalVisible: false})
        }
        /* else if (modelSelection === "accountType") {
             this.setState({selectActCard: item, modalVisible: false})
         } else if (modelSelection === "cardType") {
             this.setState({selectCard: item.label, modalVisible: false})
         }*/
    }



    ownCreditCardPaymentOption(language){
        return(

            <View style={{flex: 1, paddingBottom: 30}}>
                <Text style={[CommonStyle.labelStyle, {
                    color: themeStyle.THEME_COLOR,
                    marginStart: 10,
                    marginEnd: 10,
                    marginTop: 6,
                    marginBottom: 4
                }]}>
                    {language.creditCard}
                </Text>
                <TouchableOpacity
                    onPress={() => this.openModal("type", language.selectCreditCard, language.transferTypeArr, language)}>
                    <View style={styles.selectionBg}>
                        <Text style={[CommonStyle.midTextStyle, {
                            color: this.state.selectCreditCardType === language.select_type_transfer ? themeStyle.SELECT_LABEL : themeStyle.BLACK,
                            flex: 1
                        }]}>
                            {this.state.selectCreditCardType}
                        </Text>
                        <Image resizeMode={"contain"} style={styles.arrowStyle}
                               source={require("../../resources/images/ic_arrow_down.png")}/>
                    </View>
                </TouchableOpacity>
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
                                style={[CommonStyle.midTextStyle, {color: themeStyle.WHITE}]}>{language.next}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <Text style={{marginStart: 10, marginTop: 20, color: themeStyle.THEME_COLOR}}>*{language.mark_field_mandatory}
                </Text>
            </View>
        )
    }
    otherCreditCardOption(language){
        return(
            <View>
                <Text>{}</Text>
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
                    <Text style={CommonStyle.title}>{language.creditCardTitle}</Text>
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
                <View style={[styles.headerLabel,{  marginTop:10,marginStart: 10,
                    marginEnd: 10}]}>
                    <TouchableOpacity
                        onPress={() => this.changeCard(0)}
                        style={{
                            flex:1,
                            height: "100%",
                            // width: Utility.setWidth(65),
                            paddingLeft:10,
                            paddingRight:10,
                            alignItems:"center",
                            justifyContent: "center",
                            borderBottomLeftRadius:this.state.stateVal === 1 ? 3 : 0,
                            borderTopLeftRadius:this.state.stateVal === 1 ? 3 : 0,
                            backgroundColor: this.state.stateVal === 0 ? themeStyle.THEME_COLOR : "#F4F4F4",
                        }}>
                        <Text style={[styles.langText, {
                            color: this.state.stateVal === 0 ? themeStyle.WHITE : themeStyle.BLACK
                        }]}>{this.props.language.own_creditCardPayment}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => this.changeCard(1)}
                        style={{
                            flex:1,
                            height: "100%",
                            //width: Utility.setWidth(65),
                            paddingLeft:10,
                            paddingRight:10,
                            justifyContent: "center",
                            alignItems:"center",
                            borderBottomRightRadius:this.state.stateVal === 1 ? 5 : 0,
                            borderTopRightRadius:this.state.stateVal === 1 ? 5 : 0,
                            backgroundColor: this.state.stateVal === 1 ? themeStyle.THEME_COLOR : "#F4F4F4",
                        }}>
                        <Text style={[styles.langText, {
                            color: this.state.stateVal === 1 ? themeStyle.WHITE : themeStyle.BLACK
                        }]}>{this.props.language.other_creditCardPayment}</Text>
                    </TouchableOpacity>
                </View>

                {this.state.stateVal === 0 ? this.ownCreditCardPaymentOption(language) : this.otherCreditCardOption(language)}

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
        //justifyContent:"space-between",
        //backgroundColor: themeStyle.THEME_COLOR,
        height: Utility.setHeight(35),
        borderRadius: 5,
        borderWidth: 1,
        borderColor: themeStyle.WHITE,
        overflow: "hidden"
    }, selectionBg: {
        paddingStart: 10,
        paddingBottom: 4,
        paddingTop: 4,
        paddingEnd: 10,
        flexDirection: "row",
        backgroundColor: themeStyle.SELECTION_BG,
        alignItems: "center"
    },
    arrowStyle: {
        tintColor: themeStyle.BLACK,
        width: Utility.setWidth(35),
        height: Utility.setHeight(30)
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

export default connect(mapStateToProps)(CityCreditCard);

