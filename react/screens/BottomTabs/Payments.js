import React, {Component} from "react";
import {FlatList, Image, Platform, SafeAreaView, StatusBar, Text, TouchableOpacity, View} from "react-native";
import themeStyle from "../../resources/theme.style";
import CommonStyle from "../../resources/CommonStyle";
import {connect} from "react-redux";
import Utility from "../../utilize/Utility";
import FontSize from "../../resources/ManageFontSize";

class Payments extends Component {
    constructor(props) {
        super(props);
    }
    moveScreen(item){
        switch (item.id){
            case "MobileRecharge":
            this.props.navigation.navigate("MobileRecharge")
             break;
            case "CityCreditCard":
             this.props.navigation.navigate("CityCreditCard")
             break;
            case "ValueAddedServices":
                this.props.navigation.navigate("ValueAddedServices")
                break;
            case "VisaInstantPayment":
                this.props.navigation.navigate("VisaInstantPayment")
                break;
            case "BeneficiaryManagement":
                this.props.navigation.navigate("BeneficiaryManagement")
                break;
            case "FavoritePayments":
                this.props.navigation.navigate("Favorite",{title:this.props.language.favorite_payment})
                break;
            case "PaymentHistory":
                this.props.navigation.navigate("MobileRecharge")
                break;
        }
    }

    _renderItem = ({item, index}) =>{
        return(
            <TouchableOpacity onPress={()=>this.moveScreen(item)}>
            <View style={{
                justifyContent: 'center',
                alignItems: 'center',
                height: (Utility.getDeviceHeight()-Utility.setHeight(130))/4,
                width:Utility.getDeviceWidth()/2,
                borderLeftWidth:1,
                borderBottomWidth:1,
                borderColor:themeStyle.THEME_COLOR
            }}>
                <Image style={{
                    height: Utility.setHeight(50),
                    width: Utility.setWidth(30),
                    marginLeft: Utility.setWidth(10),
                    marginRight: Utility.setWidth(10),
                }} resizeMode={"contain"}
                       source={item.icon}/>
                <Text style={[CommonStyle.labelStyle, {
                    textAlign:"center",
                    fontSize: 20,
                    color: themeStyle.THEME_COLOR,
                    fontSize: FontSize.getSize(12),
                }]}>{item.title}</Text>
            </View>
            </TouchableOpacity>
        )
    }

    render() {
        let language = this.props.language;
        console.log("beneficiary array",language.payments_props)
        return (
            <View style={{flex: 1, backgroundColor: themeStyle.BG_COLOR}}>
                <SafeAreaView/>
                <View style={[CommonStyle.toolbar, {flexDirection: "row"}]}>
                    <Image resizeMode={"contain"}
                           style={{width: Utility.setWidth(90), flexGrow: 0, height: Utility.setHeight(50)}}
                           source={require("../../resources/images/citytouch_header.png")}/>
                    <TouchableOpacity onPress={() => Utility.logout(this.props.navigation, language)}
                                      style={{ width: Utility.setWidth(35),
                                          height: Utility.setHeight(35),
                                          position: "absolute",
                                          right: Utility.setWidth(10),}}
                                      onPress={() => Utility.logout(this.props.navigation, language)}>
                        <Image resizeMode={"contain"} style={{
                            width: Utility.setWidth(30),
                            height: Utility.setHeight(30),
                        }}
                               source={require("../../resources/images/ic_logout.png")}/>
                    </TouchableOpacity>
                </View>

                <View>
                    <FlatList
                        data={language.payments_props}
                        renderItem={this._renderItem}
                        numColumns={2}
                        keyExtractor={(item,index)=>index+""}
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
            tabBarLabel: this.props.language.payments
        });
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        console.log("this.props.language.payments",this.props.language.payments);
        if(prevProps.langId !== this.props.langId){
            this.props.navigation.setOptions({
                tabBarLabel: this.props.language.payments
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

export default connect(mapStateToProps)(Payments);

