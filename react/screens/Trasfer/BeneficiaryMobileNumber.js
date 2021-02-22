import React, {Component} from "react";
import {
    Image,
    Platform,
    SafeAreaView,
    ScrollView,
    StatusBar,
    Text,
    TextInput,
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


class BeneficiaryMobileNumber extends Component {
    constructor(props) {
        super(props);
        this.state={
            nick_name:""
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
                        onPress={() => this.props.navigation.goBack(null)}>
                        <Image style={CommonStyle.toolbar_back_btn}
                               source={Platform.OS === "android" ?
                                   require("../../resources/images/ic_back_android.png") : require("../../resources/images/ic_back_ios.png")}/>
                    </TouchableOpacity>
                    <Text style={CommonStyle.title}>{language.beneficiary_mo_number}</Text>
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
                            flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                            marginEnd: 10,
                        }}>

                            <TextInput
                                selectionColor={themeStyle.THEME_COLOR}
                                style={[CommonStyle.textStyle, {
                                    alignItems: "flex-start",
                                    textAlign: 'auto',
                                    flex: 1,
                                    marginLeft: 10
                                }]}
                                placeholder={language.et_name_number}
                                onChangeText={text => this.setState({nickname: text})}
                                value={this.state.nickname}
                                multiline={false}
                                numberOfLines={1}
                                contextMenuHidden={true}
                                placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                                autoCorrect={false}
                            />
                            <Image style={{
                                height: Utility.setHeight(14),
                                width: Utility.setWidth(20),
                                marginLeft: Utility.setWidth(10),
                                marginRight: Utility.setWidth(10),
                                transform :[{ rotate: "180deg" }],
                                tintColor:themeStyle.PLACEHOLDER_COLOR

                            }} resizeMode={"contain"}
                                   source={require("../../resources/images/ic_back_android.png")}/>
                        </View>
                    </View>
                </ScrollView>
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

const mapStateToProps = (state) => {
    return {
        langId: state.accountReducer.langId,
        language: state.accountReducer.language,
    };
};

export default connect(mapStateToProps)(BeneficiaryMobileNumber);

