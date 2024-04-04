package cloud.siemens.mmmr.sdk;

import android.content.Intent;
import android.os.Bundle;

import com.facebook.react.bridge.WritableNativeMap;

import cloud.siemens.mmmr.sdk.log.JitsiMeetLogger;

import java.util.HashMap;

/**
 * Wraps the name and extra data for events that were broadcasted locally.
 */
public class BroadcastAction {
    private static final String TAG = BroadcastAction.class.getSimpleName();

    private final Type type;
    private final HashMap<String, Object> data;

    public BroadcastAction(Intent intent) {
        this.type = Type.buildTypeFromAction(intent.getAction());
        this.data = buildDataFromBundle(intent.getExtras());
    }

    public Type getType() {
        return this.type;
    }

    public HashMap<String, Object> getData() {
        return this.data;
    }

    public WritableNativeMap getDataAsWritableNativeMap() {
        WritableNativeMap nativeMap = new WritableNativeMap();

        for (String key : this.data.keySet()) {
            try {
                if (this.data.get(key) instanceof Boolean) {
                    nativeMap.putBoolean(key, (Boolean) this.data.get(key));
                } else if (this.data.get(key) instanceof Integer) {
                    nativeMap.putInt(key, (Integer) this.data.get(key));
                } else if (this.data.get(key) instanceof Double) {
                    nativeMap.putDouble(key, (Double) this.data.get(key));
                } else if (this.data.get(key) instanceof String) {
                    nativeMap.putString(key, (String) this.data.get(key));
                } else {
                    throw new Exception("Unsupported extra data type");
                }
            } catch (Exception e) {
                JitsiMeetLogger.w(TAG + " invalid extra data in event", e);
            }
        }

        return nativeMap;
    }

    private static HashMap<String, Object> buildDataFromBundle(Bundle bundle) {
        HashMap<String, Object> map = new HashMap<>();

        if (bundle != null) {
            for (String key : bundle.keySet()) {
                map.put(key, bundle.get(key));
            }
        }

        return map;
    }

    enum Type {
        SET_AUDIO_MUTED("cloud.siemens.mmmr.SET_AUDIO_MUTED"),
        HANG_UP("cloud.siemens.mmmr.HANG_UP"),
        SEND_ENDPOINT_TEXT_MESSAGE("cloud.siemens.mmmr.SEND_ENDPOINT_TEXT_MESSAGE"),
        TOGGLE_SCREEN_SHARE("cloud.siemens.mmmr.TOGGLE_SCREEN_SHARE"),
        RETRIEVE_PARTICIPANTS_INFO("cloud.siemens.mmmr.RETRIEVE_PARTICIPANTS_INFO"),
        OPEN_CHAT("cloud.siemens.mmmr.OPEN_CHAT"),
        CLOSE_CHAT("cloud.siemens.mmmr.CLOSE_CHAT"),
        SEND_CHAT_MESSAGE("cloud.siemens.mmmr.SEND_CHAT_MESSAGE"),
        SET_VIDEO_MUTED("cloud.siemens.mmmr.SET_VIDEO_MUTED"),
        SET_CLOSED_CAPTIONS_ENABLED("cloud.siemens.mmmr.SET_CLOSED_CAPTIONS_ENABLED"),
        TOGGLE_CAMERA("cloud.siemens.mmmr.TOGGLE_CAMERA");

        private final String action;

        Type(String action) {
            this.action = action;
        }

        public String getAction() {
            return action;
        }

        private static Type buildTypeFromAction(String action) {
            for (Type type : Type.values()) {
                if (type.action.equalsIgnoreCase(action)) {
                    return type;
                }
            }
            return null;
        }
    }
}
