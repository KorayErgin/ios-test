import { useNavigation } from "@react-navigation/native";
import React, { useCallback, useLayoutEffect, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Platform,
  ScrollView,
  View,
  ViewStyle
} from "react-native";
import { WebView } from "react-native-webview";

import i18next, {
  DEFAULT_LANGUAGE,
  LANGUAGES,
} from "../../../base/i18n/i18next";
import { IconArrowLeft } from "../../../base/icons/svg";
import JitsiScreen from "../../../base/modal/components/JitsiScreen";
import BaseThemeNative from "../../../base/ui/components/BaseTheme.native";
import HeaderNavigationButton from "../../../mobile/navigation/components/HeaderNavigationButton";
import {
  goBack,
  navigate,
} from "../../../mobile/navigation/components/settings/SettingsNavigationContainerRef";
import { screen } from "../../../mobile/navigation/routes";

import styles from "./styles";

const PrivacyNoticeView = ( { isInWelcomePage }: { isInWelcomePage?: boolean } ) => {
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
      if(Platform.OS === 'ios'){
         const RNFSLib = require('react-native-fs'); // Inline require for iOS only
         const filePath = i18next.language==='de'? `${RNFSLib.MainBundlePath}/mmm-resdasdadasdsadmote_dataprivacynotice_en.html`:`${RNFSLib.MainBundlePath}/mmm-remote_dataprivacynotice_en.html`;
         const content = await RNFSLib.readFile(filePath, 'utf8');
         setHtmlContent(content);
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
        {Platform.OS === 'android' ? (
                               <WebView source={{ uri: "file:///android_asset/html/mmm-remote_dataprivacynotice_en.html" }}
                                       onError={(error) => console.error("WebView error:", error)} />
                      ) : (
                        htmlContent ? (
                          <WebView
                            originWhitelist={['*']}
                            source={{ html: htmlContent }}
                          />
                        ) : (
                          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            {/* This will show when htmlContent is not available */}
                          </View>
                        )
                      )}
        </View>
      </ScrollView>
    </JitsiScreen>
  );
};

export default PrivacyNoticeView;
