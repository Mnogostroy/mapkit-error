package ru.mnogostroy.mapkit;

import androidx.appcompat.app.AppCompatActivity;
import com.yandex.mapkit.MapKitFactory;
import com.yandex.mapkit.mapview.MapView;
import androidx.annotation.NonNull;
import android.content.Context;

public class CustomNativeScriptActivity {
    private static MapView mapView;

    public CustomNativeScriptActivity(@NonNull Context context) {
        super();
        mapView = new MapView(context);
    }

    protected void kitStart() {
        MapKitFactory.getInstance().onStart();

        mapView.onStart();
    }

    protected void kitStop() {
        MapKitFactory.getInstance().onStop();

        mapView.onStop();
    }


}