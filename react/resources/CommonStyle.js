import Utility from "../utilize/Utility";
import themeStyle from "./theme.style";
import {StyleSheet} from "react-native";
import fontStyle from "./FontStyle";
import FontSize from "./ManageFontSize";
import {heightPercentageToDP as hp} from "react-native-responsive-screen";

export default StyleSheet.create({
    toolbar: {
        flexDirection: "row",
        justifyContent: "center",
        height: Utility.setHeight(55),
        backgroundColor: themeStyle.THEME_COLOR,
        alignItems: "center",
        paddingLeft: 15,
        paddingRight: 15
    },
    headerLabel: {
        flexDirection: "row",
        backgroundColor: themeStyle.WHITE,
        height: Utility.setHeight(25),
        borderRadius: 5,
        borderWidth: 1,
        borderColor: themeStyle.WHITE,
        overflow: "hidden"
    },
    title: {
        fontFamily: fontStyle.RobotoBold,
        fontSize: FontSize.getSize(14),
        flex: 1, color: themeStyle.WHITE
    },
    toolbar_back_btn: {
        width: 15, height: 17, tintColor: themeStyle.WHITE
    },
    toolbar_back_btn_touch: {
        width: 20, height: 25, alignItems: "center", justifyContent: "center", marginRight: 8
    },

    labelStyle: {
        fontFamily: fontStyle.RobotoBold,
        fontSize: FontSize.getSize(13),
    },
    midTextStyle: {
        fontFamily: fontStyle.RobotoMedium,
        fontSize: FontSize.getSize(13),
    },
    textStyle: {
        fontFamily: fontStyle.RobotoRegular,
        fontSize: FontSize.getSize(13),
        color: themeStyle.BLACK
    },
    themeTextStyle: {
        fontFamily: fontStyle.RobotoRegular,
        fontSize: FontSize.getSize(13),
        color: themeStyle.THEME_COLOR
    },
    themeMidTextStyle: {
        fontFamily: fontStyle.RobotoMedium,
        fontSize: FontSize.getSize(13),
        color: themeStyle.THEME_COLOR
    },

    checkboxContainer: {
        flexDirection: "row",
        paddingLeft: 10,
        paddingRight: 10,
        marginTop: 10, marginBottom: 10
    },
    checkbox: {
        height: 5,
        marginTop: 9
    },
    langText: {
        fontFamily: fontStyle.RobotoRegular,
        fontSize: FontSize.getSize(12),
        textAlign: 'center',
        width: Utility.setWidth(45),
    },
    errorStyle: {
        textAlign: "right",
        alignSelf: "flex-end",
        marginBottom: 5,
        marginRight: 10, color: themeStyle.THEME_COLOR, fontSize: FontSize.getSize(11),
        fontFamily: fontStyle.RobotoRegular,
    },
    /*model view parent*/
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
        maxHeight: Utility.getDeviceHeight() - 100,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        maxHeight: Utility.getDeviceHeight() - 100,
    },
    selectionBg: {
        paddingStart: 10,
        paddingBottom: 4,
        paddingTop: 4,
        paddingEnd: 10,
        flexDirection: "row",
        backgroundColor: themeStyle.SELECTION_BG,
        alignItems: "center"
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    arrowStyle: {
        tintColor: themeStyle.BLACK,
        width: Utility.setWidth(35),
        height: Utility.setHeight(30)
    },
    mark_mandatory:{
        marginStart: Utility.setWidth(10),
        marginTop: Utility.setHeight(20),
        marginBottom:Utility.setHeight(10),
        fontFamily:fontStyle.RobotoRegular,
        fontSize:FontSize.getSize(11),
        color: themeStyle.THEME_COLOR
    },
    viewText:{
        alignItems: "flex-end",
        textAlign: 'right',
        marginLeft: 10,
        flex: 1,
        fontFamily: fontStyle.RobotoRegular,
        fontSize: FontSize.getSize(13),
        color: themeStyle.BLACK
    }
});
