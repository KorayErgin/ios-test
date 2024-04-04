import React, { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  NativeModules,
  Platform,
  View,
  Text,
  ViewStyle,
  TouchableHighlight,
} from "react-native";
import { Divider } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import Icon from "../../../base/icons/components/Icon";
import { IconArrowRight } from "../../../base/icons/svg";
import { IReduxState } from "../../../app/types";
import { updateSettings } from "../../../base/settings/actions";
import Switch from "../../../base/ui/components/native/Switch";
import LanguageSelectView from "./LanguageSelectView";
import { navigate } from "../../../mobile/navigation/components/settings/SettingsNavigationContainerRef";
import { screen } from "../../../mobile/navigation/routes";

import FormRow from "./FormRow";
import FormSection from "./FormSection";
import styles from "./styles";

const { AppInfo } = NativeModules;

const AdvancedSection = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { disableCrashReporting, disableCallIntegration, disableP2P } =
    useSelector((state: IReduxState) => state["features/base/settings"]);

  const onSwitchToggled = useCallback(
    (name: string) => (enabled?: boolean) => {
      if (name === "disableCrashReporting" && enabled === true) {
        Alert.alert(
          t("settingsView.alertTitle"),
          t("settingsView.disableCrashReportingWarning"),
          [
            {
              onPress: () =>
                dispatch(updateSettings({ disableCrashReporting: true })),
              text: t("settingsView.alertOk"),
            },
            {
              text: t("settingsView.alertCancel"),
            },
          ]
        );
      } else {
        dispatch(updateSettings({ [name]: enabled }));
      }
    },
    [dispatch, updateSettings]
  );

  const navigateToPrivacyNoticeView = useCallback(() => {
    navigate(screen.settings.privacyNotice);
  }, [navigate, screen]);

   const navigateToTermsOfUseView = useCallback(() => {
     navigate(screen.settings.termsOfUse);
   }, [navigate, screen]);

   const navigateToOpenSourceLicencesView = useCallback(() => {
     navigate(screen.settings.openSourceLicenses);
    }, [navigate, screen]);

  const switches = useMemo(() => {
    const partialSwitches = [
      {
        label: "settingsView.disableCallIntegration",
        state: disableCallIntegration,
        name: "disableCallIntegration",
      },
      {
        label: "settingsView.disableP2P",
        state: disableP2P,
        name: "disableP2P",
      },
      {
        label: "settingsView.disableCrashReporting",
        state: disableCrashReporting,
        name: "disableCrashReporting",
      },
    ];

    if (Platform.OS !== "android") {
      partialSwitches.shift();
    }

    if (!AppInfo.GOOGLE_SERVICES_ENABLED) {
      partialSwitches.pop();
    }

    return partialSwitches;
  }, [disableCallIntegration, disableP2P, disableCrashReporting]);

  return (
    <>
      <FormSection>
        <View style={styles.labelContainer as ViewStyle}>
          <Text style={styles.label}>{t("settingsView.advanced")}</Text>
        </View>
        {switches.map(({ label, state, name }) => (
          <FormRow key={label} label={label}>
            <Switch checked={Boolean(state)} onChange={onSwitchToggled(name)} />
          </FormRow>
        ))}
      </FormSection>
      {/* @ts-ignore */}
      <View style={styles.labelContainer as ViewStyle}>
        <Text style={styles.label}>{t("settingsView.buildInfoSection")}</Text>
      </View>

      <FormSection>
        <FormRow label="settingsView.version">
          <Text style={styles.text}>
            {`${AppInfo.version} build ${AppInfo.buildNumber}`}
          </Text>
        </FormRow>
        <FormRow label="settingsView.sdkVersion">
          <Text style={styles.text}>{AppInfo.sdkVersion}</Text>
        </FormRow>
      </FormSection>
      <View style={styles.labelContainer as ViewStyle}>
        <Text style={styles.label}>{t("settingsView.legalInfoSection")}</Text>
      </View>
      <FormSection>
        <FormRow label="settingsView.privacyNotice">
          <TouchableHighlight onPress={navigateToPrivacyNoticeView}>
            <View style={styles.languageButton as ViewStyle}>
              <Icon size={30} src={IconArrowRight} />
            </View>
          </TouchableHighlight>
        </FormRow>
        <FormRow label="settingsView.termsOfUse">
          <TouchableHighlight onPress={navigateToTermsOfUseView}>
            <View style={styles.languageButton as ViewStyle}>
              <Icon size={30} src={IconArrowRight} />
            </View>
          </TouchableHighlight>
        </FormRow>

        <FormRow label="settingsView.openSourceLicences">
          <TouchableHighlight onPress={navigateToOpenSourceLicencesView}>
            <View style={styles.languageButton as ViewStyle}>
              <Icon size={30} src={IconArrowRight} />
            </View>
          </TouchableHighlight>
        </FormRow>
      </FormSection>
    </>
  );
};

export default AdvancedSection;
