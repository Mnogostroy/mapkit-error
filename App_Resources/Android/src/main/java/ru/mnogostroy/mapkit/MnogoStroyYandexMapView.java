package ru.mnogostroy.mapkit;

import android.content.Context;
import android.graphics.Color;
import android.util.AttributeSet;
import android.util.Log;
import android.widget.FrameLayout;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import java.util.Collections;
import java.util.List;

import com.yandex.mapkit.MapKitFactory;
import com.yandex.mapkit.map.MapObject;
import com.yandex.mapkit.map.MapObjectTapListener;
import com.yandex.mapkit.map.MapLoadStatistics;
import com.yandex.mapkit.map.MapLoadedListener;
import com.yandex.mapkit.map.PlacemarkMapObject;
import com.yandex.mapkit.RequestPoint;
import com.yandex.mapkit.RequestPointType;
import com.yandex.mapkit.geometry.Point;
import com.yandex.mapkit.map.CameraPosition;
import com.yandex.mapkit.map.IconStyle;
import com.yandex.mapkit.map.InputListener;
import com.yandex.mapkit.map.Map;
import com.yandex.mapkit.map.MapObjectCollection;
import com.yandex.mapkit.map.PolylineMapObject;
import com.yandex.mapkit.mapview.MapView;
import com.yandex.runtime.Error;
import com.yandex.runtime.image.ImageProvider;
import com.yandex.runtime.network.NetworkError;

public class MnogoStroyYandexMapView extends MapView {
    private static boolean isMapKitInitialized = false;
    private FrameLayout infoWindow;
    private OnMarkerClickListener onMarkerClickListener;
    private MapObjectTapListener mapObjectTapListener;

    public interface OnMarkerClickListener {
        void onMarkerClick(Point point, String markerId);
    }

    public MnogoStroyYandexMapView(@NonNull Context context, double latitude, double longitude) {
        super(context);
        initialize(context, latitude, longitude);
    }

    public MnogoStroyYandexMapView(@NonNull Context context, double latitude, double longitude, @Nullable AttributeSet attrs) {
        super(context, attrs);
        initialize(context, latitude, longitude);
    }

    public void setOnMarkerClickListener(OnMarkerClickListener listener) {
        if (mapObjectTapListener != null) {
            this.getMap().getMapObjects().removeTapListener(mapObjectTapListener);
        }

        onMarkerClickListener = listener;

        mapObjectTapListener = new MapObjectTapListener() {
            @Override
            public boolean onMapObjectTap(@NonNull MapObject mapObject, @NonNull Point point) {
                if (mapObject instanceof PlacemarkMapObject) {
                    PlacemarkMapObject placemark = (PlacemarkMapObject) mapObject;
                    String userData = (String) placemark.getUserData();
                    Log.d("MnogoStroyYandexMapView", "Marker tapped with userData: " + userData);
                    if (onMarkerClickListener != null) {
                        onMarkerClickListener.onMarkerClick(point, userData);
                    }
                    return true;
                }
                return false;
            }
        };

        this.getMap().getMapObjects().addTapListener(mapObjectTapListener);
    }

    private void initialize(Context context, double latitude, double longitude) {
        if (!isMapKitInitialized) {
            // MapKitFactory.initialize(context);
            isMapKitInitialized = true;
        }
        Log.d("MnogoStroyYandexMapView", "Initializing MnogoStroyYandexMapView.");

        infoWindow = new FrameLayout(context);
        TextView infoText = new TextView(context);
        infoWindow.addView(infoText);

        this.getMap().setMapLoadedListener(new MapLoadedListener() {
            @Override
            public void onMapLoaded(MapLoadStatistics statistics) {
                Log.d("MapLoadStatistics", "Map loaded with statistics: " + statistics.toString());
            }
        });
    }

    public void addShop(double latitude, double longitude, String info) {
        Point point = new Point(latitude, longitude);
        PlacemarkMapObject placemark = this.getMap().getMapObjects().addPlacemark(point);
        placemark.setUserData(info);

        int resourceId = getContext().getResources().getIdentifier("shop_marker", "drawable", getContext().getPackageName());
        placemark.setIcon(ImageProvider.fromResource(getContext(), resourceId));
        Log.d("MnogoStroyYandexMapView", "Shop added at: " + latitude + ", " + longitude + " with info: " + info);
    }

    public void zoomIn() {
        this.getMap().move(new CameraPosition(this.getMap().getCameraPosition().getTarget(),
                this.getMap().getCameraPosition().getZoom() + 1,
                0.0f, 0.0f));
    }

    public void zoomOut() {
        this.getMap().move(new CameraPosition(this.getMap().getCameraPosition().getTarget(),
                this.getMap().getCameraPosition().getZoom() - 1,
                0.0f, 0.0f));
    }

    public void changeCenter(double latitude, double longitude, float zoom) {
        this.getMap().move(new CameraPosition(new Point(latitude, longitude), zoom, 0.0f, 0.0f));
    }

    public void clearMap() {
        this.getMap().getMapObjects().clear();
    }
}
