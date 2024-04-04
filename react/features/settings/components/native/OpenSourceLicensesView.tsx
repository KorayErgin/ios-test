import { useNavigation } from "@react-navigation/native";
import React, { useCallback, useLayoutEffect } from "react";
import {
  ScrollView,
  View,
  ViewStyle,
} from "react-native";
import i18next from "../../../base/i18n/i18next";
import { IconArrowLeft } from "../../../base/icons/svg";
import JitsiScreen from "../../../base/modal/components/JitsiScreen";
import BaseThemeNative from "../../../base/ui/components/BaseTheme.native";
import HeaderNavigationButton from "../../../mobile/navigation/components/HeaderNavigationButton";
import {
  goBack,
  navigate,
} from "../../../mobile/navigation/components/settings/SettingsNavigationContainerRef";
import { screen } from "../../../mobile/navigation/routes";
import { WebView } from "react-native-webview";
import styles from "./styles";

const OpenSourceLicensesView = ( { isInWelcomePage }: { isInWelcomePage?: boolean } ) => {
  const navigation = useNavigation();
  const headerLeft = () => (
    <HeaderNavigationButton
      color={BaseThemeNative.palette.link01}
      onPress={goBack}
      src={IconArrowLeft}
      style={styles.backBtn}
      twoActions={true}
    />
  );
  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft,
    });
  }, [navigation]);

  useCallback(
    (language) => () => {
      i18next.changeLanguage(language);
      navigate(screen.settings.main);
    },
    [i18next]
  );

  return (
    <JitsiScreen
      disableForcedKeyboardDismiss={true}
      // @ts-ignore
      safeAreaInsets={[!isInWelcomePage && "bottom", "left", "right"].filter(
        Boolean
      )}
      style={styles.settingsViewContainer}
    >
      <ScrollView
        bounces={isInWelcomePage}
        contentContainerStyle={styles.profileView as ViewStyle}
      >
        <View style={styles.contentOption as ViewStyle}>
          <WebView
            source={{ uri: "file:///android_asset/html/ReadMe_OSS.html" }}
            onError={(error) => console.error("WebView error:", error)}
          />
        </View>
      </ScrollView>
    </JitsiScreen>
  );
};

export default OpenSourceLicensesView;
