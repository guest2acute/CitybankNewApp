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
import FontSize from "../../resources/ManageFontSize";
import fontStyle from "../../resources/FontStyle";


class RequestMonitor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isProgress: false,
            selectType: props.language.select_request_type,
            selectRequestType: props.language.select_request_status,
            selectTypeVal: -1,
            selectActCard: props.language.TypeOfTransferArr[0],
            modelSelection: "",
            modalVisible: false,
            modalTitle: "",
            modalData: [],
            title:props.route.params.title,
            data: [
                    {
                        account_title: "Self Account ",
                        account_number: "2702240346001",
                        start_date: "8-FEB-2021"
                    },
                    {
                        account_title: "Self Account ",
                        account_number: "2252595128001",
                        start_date: "7-APR-2019"
                    },
                    {
                        account_title: "Self Account ",
                        account_number: "2401969529001",
                        start_date: "3-MAR-2019"
                    },
                    {
                        account_title: "Self Account ",
                        account_number: "2702240346001",
                        start_date: "1-MAR-2019"
                    }
                ]
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
            this.setState({selectType: item.label, selectTypeVal: item.value, modalVisible: false})
        }else if (modelSelection === "requestType") {
            this.setState({selectRequestType: item.label, selectTypeVal: item.value, modalVisible: false})
        }
    }

    submit(language, navigation) {
        let otpMsg = "", successMsg = "";
        console.log("selectTypeVal is this",this.state.selectTypeVal)
    }

    requestMonitor(language){
        return(
            <View key={"requestMonitor"} style={{flex: 1, paddingBottom: 30}}>
                <Text style={[CommonStyle.labelStyle, {
                    color: themeStyle.THEME_COLOR,
                    marginStart: 10,
                    marginEnd: 10,
                    marginTop: 6,
                    marginBottom: 4
                }]}>
                    {language.request_type}
                </Text>
                <TouchableOpacity
                    onPress={() => this.openModal("type", language.select_request_type, language.requestTypeArray, language)}>
                    <View style={CommonStyle.selectionBg}>
                        <Text style={[CommonStyle.midTextStyle, {
                            color: this.state.selectType === language.select_request_type ? themeStyle.SELECT_LABEL : themeStyle.BLACK,
                            flex: 1
                        }]}>
                            {this.state.selectType}
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
                    {language.request_status}
                </Text>
                <TouchableOpacity
                    onPress={() => this.openModal("requestType", language.select_request_status, language.requestStatusArray, language)}>
                    <View style={CommonStyle.selectionBg}>
                        <Text style={[CommonStyle.midTextStyle, {
                            color: this.state.selectRequestType === language.select_request_status ? themeStyle.SELECT_LABEL : themeStyle.BLACK,
                            flex: 1
                        }]}>
                            {this.state.selectRequestType}
                        </Text>
                        <Image resizeMode={"contain"} style={CommonStyle.arrowStyle}
                               source={require("../../resources/images/ic_arrow_down.png")}/>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

    accountList(language){
        return(
            <View>
            <View style={[CommonStyle.selectionBg,{flexDirection:"row",justifyContent:"space-between",paddingTop:10,paddingBottom:10}]}>
                <Text style={[CommonStyle.midTextStyle, {
                    color: themeStyle.BLACK
                }]}>
                    {language.account_title}
                </Text>
                <Text style={[CommonStyle.midTextStyle, {
                    color: themeStyle.BLACK,
                }]}>
                    {language.account_number}
                </Text>
                <Text style={[CommonStyle.midTextStyle, {
                    color: themeStyle.BLACK,
                }]}>
                    {language.start_date}
                </Text>
            </View>
            <FlatList data={this.state.data}
                      renderItem={this._renderItem}
                //ItemSeparatorComponent={() => this.bottomLine()}
                //ListFooterComponent={this.bottomLine()}
                      keyExtractor={(item, index) => index + ""}
            />
            </View>
        )
    }

    _renderItem = ({item, index}) => {
        return (
            <View style={{flexDirection:"row",justifyContent:"space-around",
                width: Utility.getDeviceWidth(),
                paddingTop: 10,
                paddingBottom: 10,
                backgroundColor: index % 2 === 0 ? null : themeStyle.SEPARATOR
            }}>
            <Text style={[CommonStyle.textStyle, {
            }]}>
                {item.account_title}
            </Text>
            <Text style={[CommonStyle.textStyle,, {
            }]}>
                {item.account_number}
            </Text>
            <Text style={[CommonStyle.textStyle,, {
            }]}>
                {item.start_date}
            </Text>
        </View>
    )}


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
                    {this.requestMonitor(language)}
                    {this.state.selectTypeVal === 0 ? this.accountList(language):null}
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
}


const mapStateToProps = (state) => {
    return {
        langId: state.accountReducer.langId,
        language: state.accountReducer.language,
    };
};

export default connect(mapStateToProps)(RequestMonitor);
