package ru.mnogostroy.mapkit;

import android.util.Log;
import com.yandex.mapkit.map.Map;
import com.yandex.mapkit.map.MapLoadedListener;
import com.yandex.mapkit.map.MapLoadStatistics;

public class MyMapLoadListener implements MapLoadedListener {
    @Override
    public void onMapLoaded(MapLoadStatistics mapLoadStatistics) {
        Log.d("MyMapLoadListener", "Map successfully loaded with statistics: " + mapLoadStatistics);
        // Дополнительная логика после успешной загрузки карты
    }
}