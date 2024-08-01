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
import java.util.ArrayList;
import java.util.List;

import com.yandex.mapkit.MapKitFactory;
import com.yandex.mapkit.map.MapObject;
import com.yandex.mapkit.map.MapObjectTapListener;
import com.yandex.mapkit.map.MapLoadStatistics;
import com.yandex.mapkit.map.MapLoadedListener;
import com.yandex.mapkit.map.PlacemarkMapObject;
import com.yandex.mapkit.geometry.Point;
import com.yandex.mapkit.map.CameraPosition;
import com.yandex.mapkit.map.Map;
import com.yandex.mapkit.mapview.MapView;
import com.yandex.runtime.image.ImageProvider;
import com.yandex.mapkit.Animation;
import com.yandex.mapkit.Animation.Type;


public class MnogoStroyYandexMapView extends MapView {
    private static boolean isMapKitInitialized = false;
    private FrameLayout infoWindow;
    private OnMarkerClickListener onMarkerClickListener;
    private MapObjectTapListener mapObjectTapListener;
    private List<Point> markers;

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

        markers = new ArrayList<>();

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
        markers.add(point);
    }

    public void zoomIn() {
        float currentZoom = this.getMap().getCameraPosition().getZoom();
        float newZoom = currentZoom + 0.5f;
        Animation animation = new Animation(Type.SMOOTH, 0.5f);

        this.getMap().move(new CameraPosition(this.getMap().getCameraPosition().getTarget(), newZoom, 0.0f, 0.0f), animation, null);
    }

    public void zoomOut() {
        float currentZoom = this.getMap().getCameraPosition().getZoom();
        float newZoom = currentZoom - 0.5f;
        Animation animation = new Animation(Type.SMOOTH, 0.5f);

        this.getMap().move(new CameraPosition(this.getMap().getCameraPosition().getTarget(), newZoom, 0.0f, 0.0f), animation, null);
    }

    public void changeCenter(double latitude, double longitude, float zoom) {
        this.getMap().move(new CameraPosition(new Point(latitude, longitude), zoom, 0.0f, 0.0f));
    }

    public void clearMap() {
        this.getMap().getMapObjects().clear();

         if (markers.isEmpty()) {
            return;
         }

         markers.clear();
    }

    public void zoomToFitAllMarkers() {
    if (markers.isEmpty()) {
        return;
    }

    double minLat = Double.MAX_VALUE;
    double minLon = Double.MAX_VALUE;
    double maxLat = Double.MIN_VALUE;
    double maxLon = Double.MIN_VALUE;

    for (Point marker : markers) {
        if (marker.getLatitude() < minLat) minLat = marker.getLatitude();
        if (marker.getLongitude() < minLon) minLon = marker.getLongitude();
        if (marker.getLatitude() > maxLat) maxLat = marker.getLatitude();
        if (marker.getLongitude() > maxLon) maxLon = marker.getLongitude();
    }

    double centerLat = (minLat + maxLat) / 2;
    double centerLon = (minLon + maxLon) / 2;

    double latDelta = maxLat - minLat;
    double lonDelta = maxLon - minLon;

    float zoomLevel = calculateZoomLevel(latDelta, lonDelta) - 0.8f;
    Log.d("MnogoStroyYandexMapView", "zoomLevel: " + zoomLevel);
    Log.d("MnogoStroyYandexMapView", "centerLat: " + centerLat);
    Log.d("MnogoStroyYandexMapView", "centerLon: " + centerLon);

    this.getMap().move(new CameraPosition(new Point(centerLat, centerLon), zoomLevel, 0.0f, 0.0f));
}

    private float calculateZoomLevel(double latDelta, double lonDelta) {
    double mapWidth = 360.0;
    double mapHeight = 180.0;

    double latZoomFactor = mapHeight / latDelta;
    double lonZoomFactor = mapWidth / lonDelta;

    double zoomFactor = Math.min(latZoomFactor, lonZoomFactor);

    double zoomLevel = Math.log(zoomFactor) / Math.log(2);

    zoomLevel = Math.round(zoomLevel * 10.0) / 10.0;

    return (float) Math.max(2f, Math.min(zoomLevel, 14f));
}
}
