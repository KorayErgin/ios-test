import { useNavigation } from "@react-navigation/native";
import RNFS from 'react-native-fs';
import React, { useCallback, useLayoutEffect, useEffect, useState } from "react";
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
  const [htmlContent, setHtmlContent] = useState<string | null>(null);
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
  useEffect(() => {
    const loadHtmlFile = async () => {
      try {
        const filePath = `${RNFS.MainBundlePath}/test.html`;
        const content = await RNFS.readFile(filePath, 'utf8');
        setHtmlContent(content);
      } catch (error) {
        console.error("Error reading HTML file:", error);
      }
    };

    loadHtmlFile();
  }, []);

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
          {htmlContent ? (
            <WebView
              originWhitelist={['*']}
              source={{ html: htmlContent }}
              style={{ flex: 1, height: 500 }} // Adjust height as needed
            />
          ) : (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            </View>
          )}
        </View>
      </ScrollView>
    </JitsiScreen>
  );
};

export default OpenSourceLicensesView;
