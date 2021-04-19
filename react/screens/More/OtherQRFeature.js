import React, {Component} from "react";
import {Image, Platform, SafeAreaView, StatusBar, Text, TouchableOpacity, View,FlatList,BackHandler} from "react-native";
import themeStyle from "../../resources/theme.style";
import CommonStyle from "../../resources/CommonStyle";
import {connect} from "react-redux";
import Utility from "../../utilize/Utility";
import FontSize from "../../resources/ManageFontSize";

class OtherQRFeature extends Component {
    constructor(props) {
        super(props);
    }

    moveScreen(item) {
        switch (item.id) {
            case "IndividualPaymentReceive":
                this.props.navigation.navigate("OtherQRPayment", {
                    title: this.props.language.individual_payment_title,
                    type:"Individual"
                });
                break;
            case "GroupPaymentRequest":
                this.props.navigation.navigate("OtherQRPayment",{
                    title: this.props.language.group_payment_title,
                    type:"Group"
                });
                break;
            case "CityPayTransactionHistory":
                this.props.navigation.navigate("CityPayTransactionHistory");
                break;
        }
    }

    _renderItem = ({item, index}) =>{
        return(
            <TouchableOpacity onPress={()=>{this.moveScreen(item)}}>
            <View style={{
                justifyContent: 'center',
                alignItems: 'center',
                height: (Utility.getDeviceHeight()-Utility.setHeight(130))/2,
                width:Utility.getDeviceWidth()/2,
                borderLeftWidth:1,
                borderBottomWidth:1,
                borderColor:themeStyle.THEME_COLOR
            }}>
                <Image style={{
                    height: Utility.setHeight(30),
                    width: Utility.setWidth(30),
                    marginBottom:15
                }} resizeMode={"contain"}
                       source={item.icon}/>
                <Text style={[CommonStyle.labelStyle, {
                    textAlign:"center",
                    color: themeStyle.THEME_COLOR,
                    fontSize: FontSize.getSize(12),
                }]}>{item.title}</Text>
            </View>
            </TouchableOpacity>
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
                    <Text style={CommonStyle.title}>{language.other_qr_feature}</Text>
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
                       <FlatList
                           data={language.other_qr_props}
                           renderItem={this._renderItem}
                           numColumns={2}
                           keyExtractor={(item,index)=>index+""}
                       />
                </View>
            </View>
        )
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
        // bottom tab management
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
        this.props.navigation.goBack();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevProps.langId !== this.props.langId){
            this.props.navigation.setOptions({
                tabBarLabel: this.props.language.more
            });
        }
    }
}

const mapStateToProps = (state) => {
    return {
        langId: state.accountReducer.langId,
        language: state.accountReducer.language,
    };
};

export default connect(mapStateToProps)(OtherQRFeature);

