import React, {Component} from "react";
import {connect} from "react-redux";
import {Image, Platform, SafeAreaView, Text, TouchableOpacity, View} from "react-native";
import themeStyle from "../../../resources/theme.style";
import CommonStyle from "../../../resources/CommonStyle";
import Utility from "../../../utilize/Utility";

class UtilityBankPayment extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        let language=this.props.language;
        return(
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
                    <Text style={CommonStyle.title}>{language.utility_bank_payment}</Text>
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

export default connect(mapStateToProps)(UtilityBankPayment);