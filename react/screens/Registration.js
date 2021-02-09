import React, {Component} from "react";
import {Image, Platform, SafeAreaView, ScrollView, StatusBar, Text, TouchableOpacity, View} from "react-native";
import themeStyle from "../resources/theme.style";
import {connect} from "react-redux";
import CommonStyle from "../resources/CommonStyle";


class Registration extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        if (Platform.OS === "android") {
            this.focusListener = this.props.navigation.addListener("focus", () => {
                StatusBar.setTranslucent(false);
                StatusBar.setBackgroundColor(themeStyle.THEME_COLOR);
                StatusBar.setBarStyle("light-content");
            });
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
                                   require("../resources/images/ic_back_android.png") : require("../resources/images/ic_back_ios.png")}/>
                    </TouchableOpacity>
                    <Text style={CommonStyle.title}>{language.register_title}</Text>
                </View>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{flex:1}}>
                        <ViewPager
                            style={{height:200}}>
                            <View style={{backgroundColor:'cadetblue'}}>
                                <Text>page one</Text>
                            </View>
                            <View style={{backgroundColor:'cornflowerblue'}}>
                                <Text>page two</Text>
                            </View>
                            <View style={{backgroundColor:'#1AA094'}}>
                                <Text>page three</Text>
                            </View>
                        </ViewPager>
                    </View>
                </ScrollView>
            </View>);
    }
}

const mapStateToProps = (state) => {
    return {
        langId: state.accountReducer.langId,
        language: state.accountReducer.language,
    };
};

export default connect(mapStateToProps)(Registration);
