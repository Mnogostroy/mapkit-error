// @ts-ignore
// @ts-nocheck
/* eslint-disable */

import {
  View,
  Utils,
  Application,
  Dialogs,
  getRootLayout,
} from '@nativescript/core'

declare const android

// class callingBack implements YandexMapView.OnMarkerClickListener {
//   @Override
//   public onMarkerClick() {
//     console.log('Вызов метода обратного вызова')
//   }
// }
export class YandexMapView extends View {
  private mapview: any
  private onClick: Function

  setMarkerClick(callback: Function) {
    this.onClick = callback

    this.mapview.setOnMarkerClickListener(
      new ru.mnogostroy.mapkit.MnogoStroyYandexMapView.OnMarkerClickListener({
        onMarkerClick(point, markerId) {
          return callback(point, markerId)
        },
      })
    )
  }

  createNativeView() {
    const androidContext = Utils.android.getApplicationContext()

    // MapKitFactory.setApiKey('ede1bf3a-0f5a-4b84-ac98-ec94baf3e422')
    // MapKitFactory.initialize(context)
    // await new ru.mnogostroy.mapkit.MnogoStroyYandexMapView(androidContext)
    this.mapview = new ru.mnogostroy.mapkit.MnogoStroyYandexMapView(
      androidContext,
      43.438172,
      39.911178
    )

    // const MyMapLoadListener = new ru.mnogostroy.mapkit.MyMapLoadListener()
    // this.mapview.addMapLoadedListener(MyMapLoadListener)

    const callback = this.onClick

    return this.mapview
  }

  initNativeView() {
    super.initNativeView()
    const callback = this.onClick

    // new ru.mnogostroy.mapkit.MnogoStroyYandexMapView.OnMarkerClickListener({
    //   onMarkerClick(point, markerId) {
    //     console.log('Marker clicked with ID: ', markerId, point)
    //     console.log(callback, this.onClick)
    //   },
    // })
  }

  disposeNativeView() {
    super.disposeNativeView()
    // Clean up if necessary
  }

  addShop(latitude: number, longitude: number, info: string) {
    this.mapview.addShop(latitude, longitude, info)
  }

  zoomOut() {
    this.mapview.zoomOut()
  }

  zoomIn() {
    this.mapview.zoomIn()
  }

  myLocation() {
    this.mapview.myLocation()
  }

  changeCenter(latitude: number, longitude: number, zoom: float) {
    this.mapview.changeCenter(latitude, longitude, zoom)
  }

  clearMap() {
    this.mapview.clearMap()
  }

  getRoute(
    start: { latitude: number; longitude: number },
    end: { latitude: number; longitude: number }
  ) {
    // console.log('getRoute', start, end)

    const context = Utils.android.getApplicationContext()

    const Intent = android.content.Intent
    const PackageManager = android.content.pm.PackageManager
    const pm = context.getPackageManager()

    const navigators = [
      {
        package: 'ru.yandex.yandexnavi',
        action: 'ru.yandex.yandexnavi.action.BUILD_ROUTE_ON_MAP',
        playStoreUrl:
          'https://play.google.com/store/apps/details?id=ru.yandex.yandexnavi',
      },
      {
        package: 'ru.yandex.yandexmaps',
        action: 'ru.yandex.yandexmaps.action.BUILD_ROUTE_ON_MAP',
        playStoreUrl:
          'https://play.google.com/store/apps/details?id=ru.yandex.yandexmaps',
      },
      {
        package: 'com.google.android.apps.maps',
        action: 'android.intent.action.VIEW',
        playStoreUrl:
          'https://play.google.com/store/apps/details?id=com.google.android.apps.maps',
        uriTemplate:
          'http://maps.google.com/maps?saddr={lat_from},{lon_from}&daddr={lat_to},{lon_to}',
      },
    ]

    let hasMap = false

    navigators.forEach((app) => {
      console.log(hasMap)
      if (hasMap === false) {
        console.log('navigators', app)
        const intent = new Intent(app.action)
        intent.setPackage(app.package)

        const resolveInfo = pm.queryIntentActivities(
          intent,
          PackageManager.MATCH_DEFAULT_ONLY
        )
        console.log(resolveInfo.size())
        if (resolveInfo.size() > 0) {
          // getRootLayout().closeAll()
          hasMap = true
          intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)

          if (app.package === 'com.google.android.apps.maps') {
            const uri = android.net.Uri.parse(
              app.uriTemplate
                .replace('{lat_from}', start.latitude)
                .replace('{lon_from}', start.longitude)
                .replace('{lat_to}', end.latitude)
                .replace('{lon_to}', end.longitude)
            )
            intent.setData(uri)
          } else {
            intent.putExtra('lat_from', start.latitude)
            intent.putExtra('lon_from', start.longitude)
            intent.putExtra('lat_to', end.latitude)
            intent.putExtra('lon_to', end.longitude)
          }

          context.startActivity(intent)
          return
        }
      }
    })

    if (!hasMap) {
      Dialogs.confirm(t('screen.route.install')).then((result) => {
        if (result) {
          const intent = new Intent(Intent.ACTION_VIEW)

          intent.setData(
            android.net.Uri.parse(
              `https://play.google.com/store/apps/details?id=ru.yandex.yandexnavi`
            )
          )

          intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)

          context.startActivity(intent)
        }
      })
    }

    // console.log('getRoute', context)
    // const Intent = android.content.Intent
    // const PackageManager = android.content.pm.PackageManager
    //const Intent = new Intent('ru.yandex.yandexnavi.action.BUILD_ROUTE_ON_MAP')
    // console.log('getRoute', Intent)
    // const intent = new Intent('ru.yandex.yandexnavi.action.BUILD_ROUTE_ON_MAP')
    // const pm = context.getPackageManager()
    // const resolveInfo = pm.queryIntentActivities(
    //   intent,
    //   PackageManager.MATCH_DEFAULT_ONLY
    // )

    // if (resolveInfo.size() > 0) {
    //   intent.setPackage('ru.yandex.yandexnavi')
    //   intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
    //   intent.putExtra('lat_from', start.latitude)
    //   intent.putExtra('lon_from', start.longitude)
    //   intent.putExtra('lat_to', end.latitude)
    //   intent.putExtra('lon_to', end.longitude)
    //   context.startActivity(intent)
    //   return true
    // } else {
    //   intent = new Intent(Intent.ACTION_VIEW)

    //   intent.setData(
    //     android.net.Uri.parse(
    //       `https://play.google.com/store/apps/details?id=ru.yandex.yandexnavi`
    //     )
    //   )

    //   intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)

    //   context.startActivity(intent)
    // }
    // const Intent = android.content.Intent
    // const context: android.content.Context =
    //   Utils.android.getApplicationContext()
    // const packageManager = context.getPackageManager()
    // const intent = packageManager.getLaunchIntentForPackage(
    //   context.getPackageName()
    // )
    // const componentName = intent.getComponent()
    // const mainIntent = Intent.makeRestartActivityTask(componentName)
    // mainIntent.setPackage(context.getPackageName())
    // context.startActivity(mainIntent)
    //   (
    //     Application.android.foregroundActivity ||
    //       Application.android.startActivity
    //   )
    //   .finish()
    // java.lang.Runtime.getRuntime().exit(0)
  }
}
