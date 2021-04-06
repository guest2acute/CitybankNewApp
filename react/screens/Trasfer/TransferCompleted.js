import React, {Component} from "react";
import {Platform, StatusBar, View, Image, Text, SafeAreaView, TouchableOpacity, ScrollView,BackHandler} from "react-native";

import {actions} from "../../redux/actions";
import {connect} from "react-redux";
import Config from "../../config/Config";
import themeStyle from "../../resources/theme.style";
import Utility from "../../utilize/Utility";
import {StackActions} from "@react-navigation/native";
import StorageClass from "../../utilize/StorageClass";
import * as DeviceInfo from "react-native-device-info";
import CommonStyle from "../../resources/CommonStyle";
import FontSize from "../../resources/ManageFontSize";


class TransferCompleted extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: this.props.route.params.transferArray,
            title:this.props.route.params.title,
            screenSwitcher:false
        }
    }

    backEvent() {
        if (this.state.screenSwitcher) {
            this.setState({
                screenSwitcher: false
            })
        } else {
            this.props.navigation.goBack();
            console.log("else part back event")
        }
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

    transferCompleted(language) {
        return (
                  this.state.data.map((item) => {
                    return (
                        <View>
                            <View style={{
                                flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                                marginEnd: 10,
                            }}>
                                <Text style={[CommonStyle.textStyle]}>
                                    {item.key}
                                </Text>
                                <Text style={CommonStyle.viewText}>{item.value}</Text>
                            </View>
                            <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
                        </View>
                    )
                }
            )
        )
    }

    render() {
        let language = this.props.language;
        console.log("transfer completed", this.state.data)
        return (
            <View style={{flex: 1, backgroundColor: themeStyle.BG_COLOR}}>
                <SafeAreaView/>
                <View style={CommonStyle.toolbar}>
                    <Text style={[CommonStyle.title,{textAlign:"left"}]}>{this.state.title}</Text>
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
                        <View style={{
                            marginStart: 10,
                            marginEnd: 10,
                            marginTop:10
                        }}>
                            <Text style={[CommonStyle.themeTextStyle, {fontSize: FontSize.getSize(15)}]}>{language.trans_success_message}</Text>
                        </View>
                        {this.transferCompleted(language)}
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
                                        style={[CommonStyle.midTextStyle, {color: themeStyle.THEME_COLOR}]}>{language.addToFavorite}</Text>
                                </View>
                            </TouchableOpacity>
                            <View style={{width: Utility.setWidth(20)}}/>

                            <TouchableOpacity style={{flex: 1}}
                                              onPress={() => {}}>
                                <View style={{
                                    alignItems: "center",
                                    justifyContent: "center",
                                    height: Utility.setHeight(46),
                                    borderRadius: Utility.setHeight(23),
                                    backgroundColor: themeStyle.THEME_COLOR
                                }}>
                                    <Text
                                        style={[CommonStyle.midTextStyle, {color: themeStyle.WHITE}]}>{language.continue_txt}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </View>
        );
    }
}

const styles = {
    viewStyles: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: themeStyle.BG_COLOR,
    },
};

const mapStateToProps = (state) => {
    return {
        langId: state.accountReducer.langId,
        language: state.accountReducer.language,
    };
};

export default connect(mapStateToProps)(TransferCompleted);

