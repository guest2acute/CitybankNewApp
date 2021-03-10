import React, {Component} from "react";
import {
    FlatList,
    Image,
    Platform,
    SafeAreaView,
    StatusBar,
    Text,
    TouchableOpacity,
    View,
    SectionList
} from "react-native";
import themeStyle from "../../resources/theme.style";
import CommonStyle from "../../resources/CommonStyle";
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import LoginScreen from "../LoginScreen";
import TermConditionScreen from "../TermConditionScreen";
import {connect} from "react-redux";
import Utility from "../../utilize/Utility";
import FontSize from "../../resources/ManageFontSize";


class SelectBeneficiary extends Component {
    constructor(props) {
        super(props);
        let language = props.language;
        this.state = {
            data: [
                {title: 'A', data: [{name:'sagar',email:"abc@gmail.com"},{name:'ranch',email:"ranch@gmail.com"}]},
                {title: 'B', data: [{name:'cop game',email:"abc@gmail.com"},{name:'chance',email:"ranch@gmail.com"}]},
                {title: 'C', data: [{name:'cartel',email:"abc@gmail.com"},{name:'cross fire',email:"ranch@gmail.com"}]},
            ]
        }
    }

    moveScreen(item) {
        switch (item.id) {
            case "add":
                this.props.navigation.navigate(language.beneficiary);
                break;
            case "delete":
                this.props.navigation.navigate(language.beneficiary);
                break;
        }
    }

    bottomLine() {
        return (<View style={{
            height: 1,
            marginLeft: 10,
            marginRight: 10,
            backgroundColor: "#D3D1D2"
        }}/>)
    }

    renderSeparator = () => {
        return (
            <View
                style={{
                    height: 1,
                    width: "100%",
                    backgroundColor: "#000",
                }}
            />
        );
    };

    goBack(item){
        console.log(item)
        this.props.route.params.setTitle({name:item.name,email:item.email})
        this.props.navigation.goBack()
    }

    renderData(item) {
        return (
            <View>
            <TouchableOpacity onPress={() => this.goBack(item)}>
                <View style={{
                    flexDirection:"column",
                    justifyContent:"space-around",
                    backgroundColor: themeStyle.WHITE,
                    marginLeft: 10,
                    marginRight: 10,
                    marginTop: 5,
                    marginBottom: 5
                }}>
                    <Text style={[CommonStyle.midTextStyle,{fontSize:13}]}>{item.name}</Text>
                    <Text style={[CommonStyle.midTextStyle,{fontSize:12}]}>{item.email}</Text>

                </View>
            </TouchableOpacity>
        <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
            </View>
        )
    }

    renderHeader(section) {
        return (
            <View style={{
                backgroundColor: themeStyle.TITLE_BG,
                height: Utility.setHeight(25),
                alignItems: "center",
                paddingStart: 10,
                paddingEnd: 10,
                flexDirection: "row"
            }}>
                <Text style={[CommonStyle.midTextStyle, {}]}>{section.title}</Text>
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
                    <Text style={CommonStyle.title}>{language.select_beneficiary}</Text>
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

                <View>
                    <SectionList
                        sections={this.state.data}
                        renderItem={({item}) => this.renderData(item)}
                        renderSectionHeader={({section}) => this.renderHeader(section)}
                        keyExtractor={(item, index) => index}
                    />
                </View>
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

export default connect(mapStateToProps)(SelectBeneficiary);

