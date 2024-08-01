import { createApp, h, registerElement } from 'nativescript-vue'
import App from '~/App.vue'
import { YandexMapView } from '~/custom/YandexMapView'
import { Application, isIOS, Utils } from '@nativescript/core'
import { AppYandexMaps } from '~/plugins/app-maps'
import { router } from '~/plugins/app-router'

const app = createApp({
  render: () => h('RootLayout', [h(App)]),
})

declare const YMKMapKit: any
declare const ru: any
declare const UIResponder: any
declare const UIApplicationDelegate: any

if (isIOS) {
  const CustomAppDelegate = (<any>UIResponder).extend(
    {
      // any existing delegate first, then override below with customizations
      ...(Application.ios.delegate ? Application.ios.delegate.prototype : {}),
      applicationDidFinishLaunchingWithOptions: function () {
        YMKMapKit.setApiKey('ede1bf3a-0f5a-4b84-ac98-ec94baf3e422')
        YMKMapKit.setLocale('ru_RU')
        YMKMapKit.sharedInstance().onStart()
        return true
      },
    },
    {
      protocols: [UIApplicationDelegate],
    }
  )

  Application.ios.delegate = CustomAppDelegate
} else {
  const activity = Application.android.startActivity as any

  let mapView: any = null

  Application.android.on(
    Application.AndroidApplication.activityCreatedEvent,
    (args) => {
      mapView = new ru.mnogostroy.mapkit.CustomNativeScriptActivity(
        Utils.android.getApplicationContext()
      )
      mapView.kitStart()
    }
  )

  Application.android.on(
    Application.AndroidApplication.activityStoppedEvent,
    (args) => {
      mapView.kitStop()
    }
  )
}

// declare const android: any

// if (isIOS) {
//   const CustomAppDelegate = (<any>UIResponder).extend(
//     {
//       // any existing delegate first, then override below with customizations
//       ...(Application.ios.delegate ? Application.ios.delegate.prototype : {}),
//       applicationDidFinishLaunchingWithOptions: function () {
//         YMKMapKit.setApiKey('ede1bf3a-0f5a-4b84-ac98-ec94baf3e422')
//         YMKMapKit.sharedInstance()
//         return true
//       },
//     },
//     {
//       protocols: [UIApplicationDelegate],
//     }
//   )

//   Application.ios.delegate = CustomAppDelegate
// } else {
//   // const app = Application.android
//   // app.on(Application.android.activityCreatedEvent, (args: any) => {
//   //   new AppYandexMaps(Utils.android.getApplicationContext())
//   // })
// }

app.use(router)
registerElement('YandexMapView', () => YandexMapView)
app.start()
