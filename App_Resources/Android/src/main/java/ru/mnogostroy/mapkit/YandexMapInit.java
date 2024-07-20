package ru.mnogostroy.mapkit;

import android.app.Application;
import android.content.Context;
import android.util.Log;
import androidx.annotation.NonNull;
import com.yandex.mapkit.MapKitFactory;
import com.tns.NativeScriptApplication;

// public class YandexMapInit {
//     private static boolean isMapKitInitialized = false;

//     public YandexMapInit(@NonNull Context context) {
//         String apiKey = "ede1bf3a-0f5a-4b84-ac98-ec94baf3e422";
//         Log.d("YandexMapInit", "Initializing MapKit with API key: " + apiKey);
//         MapKitFactory.setApiKey(apiKey);
//     }

//     // Optionally, you can add a method to check if MapKit is initialized
//     public static boolean isMapKitInitialized() {
//         return isMapKitInitialized;
//     }
// }

public class YandexMapInit extends NativeScriptApplication {
    private static boolean isMapInitialized = false;
    private static final String API_KEY = "ede1bf3a-0f5a-4b84-ac98-ec94baf3e422";

    @Override
    public void onCreate() {
        super.onCreate();
        Log.d("MyApplication", "Custom Application class onCreate");

        if (!isMapInitialized) {
            Log.d("YandexMapInit", "Initializing MapKit with API key: " + API_KEY);
            MapKitFactory.setApiKey(API_KEY);
            MapKitFactory.setLocale("ru_RU");
            MapKitFactory.initialize(this);
            isMapInitialized = true;
        }
    }
}
