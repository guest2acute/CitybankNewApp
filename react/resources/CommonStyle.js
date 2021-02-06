import Utility from "../utilize/Utility";
import themeStyle from "./theme.style";
import {StyleSheet} from "react-native";
import fontStyle from "./FontStyle";
import FontSize from "./ManageFontSize";

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
    toolbar_back_btn_touch:{
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
        color:themeStyle.BLACK
    }

});
