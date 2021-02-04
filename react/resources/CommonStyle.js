import Utility from "../utilize/Utility";
import themeStyle from "./theme.style";
import {StyleSheet} from "react-native";

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
    }
});
