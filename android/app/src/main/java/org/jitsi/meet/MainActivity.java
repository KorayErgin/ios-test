/*
 * Copyright @ 2017-present 8x8, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package com.siemens.mmmremoteinteractive;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.RestrictionEntry;
import android.content.RestrictionsManager;
import android.net.Uri;
import android.os.Bundle;
import android.provider.Settings;
import android.util.Log;
import android.view.KeyEvent;

import androidx.annotation.Nullable;

import com.siemens.mmmremoteinteractive.sdk.JitsiMeet;
import com.siemens.mmmremoteinteractive.sdk.JitsiMeetActivity;
import com.siemens.mmmremoteinteractive.sdk.JitsiMeetConferenceOptions;

import java.lang.reflect.Method;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.Collection;
import java.util.HashMap;

/**
 * The one and only Activity that the Jitsi Meet app needs. The
 * {@code Activity} is launched in {@code singleTask} mode, so it will be
 * created upon application initialization and there will be a single instance
 * of it. Further attempts at launching the application once it was already
 * launched will result in {@link MainActivity#onNewIntent(Intent)} being called.
 */
public class MainActivity extends JitsiMeetActivity {
    /**
     * The request code identifying requests for the permission to draw on top
     * of other apps. The value must be 16-bit and is arbitrarily chosen here.
     */
    private static final int OVERLAY_PERMISSION_REQUEST_CODE
        = (int) (Math.random() * Short.MAX_VALUE);

    /**
     * ServerURL configuration key for restriction configuration using {@link android.content.RestrictionsManager}
     */
    public static final String RESTRICTION_SERVER_URL = "SERVER_URL";

    /**
     * Broadcast receiver for restrictions handling
     */
    private BroadcastReceiver broadcastReceiver;

    /**
     * Flag if configuration is provided by RestrictionManager
     */
    private boolean configurationByRestrictions = false;

    /**
     * Default URL as could be obtained from RestrictionManager
     */
    private String defaultURL;


    // JitsiMeetActivity overrides
    //

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        JitsiMeet.showSplashScreen(this);
        super.onCreate(null);
    }

    @Override
    protected boolean extraInitialize() {
        Log.d(this.getClass().getSimpleName(), "LIBRE_BUILD="+BuildConfig.LIBRE_BUILD);

        // Setup Crashlytics and Firebase Dynamic Links
        // Here we are using reflection since it may have been disabled at compile time.
        try {
            Class<?> cls = Class.forName("com.siemens.mmmremoteinteractive.GoogleServicesHelper");
            Method m = cls.getMethod("initialize", JitsiMeetActivity.class);
            m.invoke(null, this);
        } catch (Exception e) {
            // Ignore any error, the module is not compiled when LIBRE_BUILD is enabled.
        }

        // In Debug builds React needs permission to write over other apps in
        // order to display the warning and error overlays.
        if (BuildConfig.DEBUG) {
            if (!Settings.canDrawOverlays(this)) {
                Intent intent
                    = new Intent(
                    Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
                    Uri.parse("package:" + getPackageName()));

                startActivityForResult(intent, OVERLAY_PERMISSION_REQUEST_CODE);

                return true;
            }
        }

        return false;
    }

    @Override
    protected void initialize() {
        broadcastReceiver = new BroadcastReceiver() {
            @Override
            public void onReceive(Context context, Intent intent) {
                // As new restrictions including server URL are received,
                // conference should be restarted with new configuration.
                leave();
                recreate();
            }
        };
        registerReceiver(broadcastReceiver,
            new IntentFilter(Intent.ACTION_APPLICATION_RESTRICTIONS_CHANGED));

        resolveRestrictions();
        setJitsiMeetConferenceDefaultOptions();
        super.initialize();
    }

    @Override
    public void onDestroy() {
        if (broadcastReceiver != null) {
            unregisterReceiver(broadcastReceiver);
            broadcastReceiver = null;
        }

        super.onDestroy();
    }

    private void setJitsiMeetConferenceDefaultOptions() {
        // Set default options
        JitsiMeetConferenceOptions defaultOptions
            = new JitsiMeetConferenceOptions.Builder()
            .setServerURL(buildURL(defaultURL))
            .setFeatureFlag("welcomepage.enabled", true)
            .setFeatureFlag("call-integration.enabled", false)
            .setFeatureFlag("resolution", 720)
            .setFeatureFlag("server-url-change.enabled", false)
            .setFeatureFlag("calendar.enabled", false)
            .build();
        JitsiMeet.setDefaultConferenceOptions(defaultOptions);
    }

    private void resolveRestrictions() {
        RestrictionsManager manager =
            (RestrictionsManager) getSystemService(Context.RESTRICTIONS_SERVICE);
        Bundle restrictions = manager.getApplicationRestrictions();
        Collection<RestrictionEntry> entries = manager.getManifestRestrictions(
            getApplicationContext().getPackageName());
        for (RestrictionEntry restrictionEntry : entries) {
            String key = restrictionEntry.getKey();
            if (RESTRICTION_SERVER_URL.equals(key)) {
                // If restrictions are passed to the application.
                if (restrictions != null &&
                    restrictions.containsKey(RESTRICTION_SERVER_URL)) {
                    defaultURL = restrictions.getString(RESTRICTION_SERVER_URL);
                    configurationByRestrictions = true;
                // Otherwise use default URL from app-restrictions.xml.
                } else {
                    defaultURL = restrictionEntry.getSelectedString();
                    configurationByRestrictions = false;
                }
            }
        }
    }

    // Activity lifecycle method overrides
    //

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        if (requestCode == OVERLAY_PERMISSION_REQUEST_CODE) {
            if (Settings.canDrawOverlays(this)) {
                initialize();
                return;
            }

            throw new RuntimeException("Overlay permission is required when running in Debug mode.");
        }

        super.onActivityResult(requestCode, resultCode, data);
    }

    // ReactAndroid/src/main/java/com/facebook/react/ReactActivity.java
    @Override
    public boolean onKeyUp(int keyCode, KeyEvent event) {
        if (BuildConfig.DEBUG && keyCode == KeyEvent.KEYCODE_MENU) {
            JitsiMeet.showDevOptions();
            return true;
        }

        return super.onKeyUp(keyCode, event);
    }

    @Override
    public void onPictureInPictureModeChanged(boolean isInPictureInPictureMode) {
        super.onPictureInPictureModeChanged(isInPictureInPictureMode);

        Log.d(TAG, "Is in picture-in-picture mode: " + isInPictureInPictureMode);

        if (!isInPictureInPictureMode) {
            this.startActivity(new Intent(this, getClass())
                .addFlags(Intent.FLAG_ACTIVITY_REORDER_TO_FRONT));
        }
    }

    // Helper methods
    //

    private @Nullable URL buildURL(String urlStr) {
        try {
            return new URL(urlStr);
        } catch (MalformedURLException e) {
            return null;
        }
    }
}
