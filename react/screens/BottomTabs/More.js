import React, {Component} from "react";
import {Platform, StatusBar, View, Image, Text, TouchableOpacity, SafeAreaView, FlatList} from "react-native";

import {actions} from "../../redux/actions";
import {connect} from "react-redux";
import Config from "../../config/Config";

import themeStyle from "../../resources/theme.style";
import Utility from "../../utilize/Utility";
import CommonStyle from "../../resources/CommonStyle";
import fontStyle from "../../resources/FontStyle";
import FontSize from "../../resources/ManageFontSize";


/**
 * splash page
 */
let imeiNo = "";

class More extends Component {

    constructor(props) {
        super(props);
        let language = props.language;
        this.state = {
            data: [
                {title: language.personalise_profile, icon: require("../../resources/images/ic_profile.png")},
                {title: language.change_contact, icon: require("../../resources/images/contact_icon.png")},
                {
                    title: language.change_login_password,
                    icon: require("../../resources/images/ic_credential_management.png")
                },
                {
                    title: language.change_login_pin,
                    icon: require("../../resources/images/ic_credential_management.png")
                },
                {
                    title: language.change_transaction_pin,
                    icon: require("../../resources/images/ic_credential_management.png")
                },
                {
                    title: language.upload_documents,
                    icon: require("../../resources/images/ic_credential_management.png")
                },
            ]
        }
    }

    /**
     * redirect to landing screen
     */

    async componentDidMount() {
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

    _renderItem = ({item, index}) => {
        return (
            <View style={{
                flexDirection: "row",
                marginTop: 17,
                marginBottom: 17,
                paddingLeft: 10,
                paddingRight: 10,
                alignItems: "center"
            }}>
                <Image style={{
                    height: Utility.setHeight(20),
                    width: Utility.setWidth(20),
                    marginLeft: Utility.setWidth(10),
                    marginRight: Utility.setWidth(10),
                }} resizeMode={"contain"}
                       source={item.icon}/>
                <Text style={[CommonStyle.labelStyle, {
                    color: themeStyle.THEME_COLOR,
                    fontSize: FontSize.getSize(12),
                    flex: 1,
                }]}>{item.title}</Text>
                <Image style={{
                    height: Utility.setHeight(12),
                    width: Utility.setWidth(30),
                    tintColor: "#b5bfc1"
                }} resizeMode={"contain"}
                       source={require("../../resources/images/arrow_right_ios.png")}/>
            </View>
        )
    }

    bottomLine() {

        return (<View style={{
            height: 1,
            marginLeft: 10,
            marginRight: 10,
            backgroundColor: "#D3D1D2"
        }}/>)

    }

    render() {
        let language = this.props.language;
        return (
            <View style={{flex: 1, backgroundColor: themeStyle.BG_COLOR}}>
                <SafeAreaView/>
                <View style={[CommonStyle.toolbar, {flexDirection: "row"}]}>
                    <Image resizeMode={"contain"}
                           style={{width: Utility.setWidth(90), flexGrow: 0, height: Utility.setHeight(50)}}
                           source={require("../../resources/images/citytouch_header.png")}/>
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

                <View>
                    <FlatList data={this.state.data}
                              renderItem={this._renderItem}
                              ItemSeparatorComponent={() => this.bottomLine()}
                              ListFooterComponent={this.bottomLine()}
                              keyExtractor={(item, index) => index + ""}
                    />
                </View>
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
    toolbar: {
        justifyContent: "center",
        backgroundColor: themeStyle.THEME_COLOR,
        alignItems: "center",
        paddingBottom: 7
    },
    title: {
        fontFamily: fontStyle.RobotoMedium,
        fontSize: FontSize.getSize(12),
        color: themeStyle.WHITE
    },
}


const mapStateToProps = (state) => {
    return {
        langId: state.accountReducer.langId,
        language: state.accountReducer.language,
    };
};

export default connect(mapStateToProps)(More);

