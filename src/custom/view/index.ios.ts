// @ts-nocheck
/* eslint-disable */

import { View } from '@nativescript/core'

declare const YMKMapKit: any
declare const YMKMapView: any
declare const YMKPoint: any
declare const YMKCameraPosition: any
declare const UIImage: any
declare const UIApplication: any
declare const NSURL: any
declare const MKMapItem: any
declare const MKPlacemark: any
declare const CLLocationCoordinate2DMake: any
declare const YMKMapObject: any
declare const YMKAnimation: any

interface YMKLayersGeoObjectTapListener extends NSObjectProtocol {
  onObjectTapWithEvent(event: YMKGeoObjectTapEvent): boolean
}

declare var YMKLayersGeoObjectTapListener: {
  prototype: YMKLayersGeoObjectTapListener
}

class NSCYMKLayersGeoObjectTapListener
  implements YMKLayersGeoObjectTapListener
{
  public static ObjCProtocols = [YMKLayersGeoObjectTapListener]

  onObjectTapWithEvent(event: any) {
    console.log('onObjectTapWithEvent', event)
    // const point = event.geoObject.geometry.get(0).point
    // const cameraPosition = this.mapView.mapWindow.map.cameraPosition
    // this.mapView.mapWindow.map.moveWithCameraPosition(
    //   YMKCameraPosition.cameraPositionWithTargetZoomAzimuthTilt(
    //     point,
    //     cameraPosition.zoom,
    //     cameraPosition.azimuth,
    //     cameraPosition.tilt
    //   ),
    //   YMKAnimation.animationWithTypeDuration(1, 1.0),
    //   null
    // )
    const name = event.geoObject.name || 'Unnamed geoObject'
    console.log(`Tapped ${name} at (${point.latitude}, ${point.longitude})`)
    this.onClick()
    return true
  }
}

interface YMKMapInputListener extends NSObjectProtocol {
  onMapLongTapWithMapPoint(map: YMKMap, point: YMKPoint): void

  onMapTapWithMapPoint(map: YMKMap, point: YMKPoint): void
}

declare var YMKMapInputListener: {
  prototype: YMKMapInputListener
}

class NSCYMKMapInputListener implements YMKMapInputListener {
  public static ObjCProtocols = [YMKMapInputListener]

  onMapLongTapWithMapPoint(map: YMKMap, point: YMKPoint) {
    console.log('onMapLongTapWithMapPoint', map, point)
    this.onClick()
    return true
  }
  onMapTapWithMapPoint(map: YMKMap, point: YMKPoint) {
    // placemark.geometry = point
    console.log('onMapTapWithMapPoint', map, point)
    this.onClick()
    return true
  }
}

interface YMKMapObjectTapListener extends NSObjectProtocol {
  onMapObjectTapWithMapObjectPoint(
    mapObject: YMKMapObject,
    point: YMKPoint
  ): boolean
}

declare var YMKMapObjectTapListener: {
  prototype: YMKMapObjectTapListener
}

class NSCYMKMapObjectTapListener implements YMKMapObjectTapListener {
  public static ObjCProtocols = [YMKMapObjectTapListener]

  onMapObjectTapWithMapObjectPoint(mapObject, point) {
    console.log('Shop marker tapped:', mapObject, point)
    this.onClick()
    return true
  }
}

export class YandexMapView extends View {
  private markers: any[] = []
  private mapView: any
  private onClick: Function | null = null
  private tapListener: any

  constructor() {
    super()
    this.initMap()
  }

  createNativeView() {
    // @ts-ignore
    if (!this.mapView) this.mapView = new YMKMapView()

    return this.mapView
  }

  initNativeView() {
    super.initNativeView()
    this.initMap()
  }

  disposeNativeView() {
    super.disposeNativeView()
  }

  initMap() {
    // @ts-ignore
    if (!this.mapView) this.mapView = new YMKMapView()

    const targetPoint = YMKPoint.pointWithLatitudeLongitude(
      43.438172,
      39.911178
    )
    const cameraPosition =
      YMKCameraPosition.cameraPositionWithTargetZoomAzimuthTilt(
        targetPoint,
        10,
        0,
        0
      )
    this.mapView.mapWindow.map.moveWithCameraPosition(cameraPosition)
    this.addTapListener()
  }

  addTapListener() {
    const geoObjectTapListener = new NSCYMKLayersGeoObjectTapListener()

    this.mapView.mapWindow.map.addTapListenerWithTapListener(
      geoObjectTapListener
    )

    const inputListener = new NSCYMKMapInputListener()
    this.mapView.mapWindow.map.addInputListenerWithInputListener(inputListener)
  }

  addShop(latitude: number, longitude: number, info: string) {
    const targetPoint = YMKPoint.pointWithLatitudeLongitude(latitude, longitude)

    const mapObjects = this.mapView.mapWindow.map.mapObjects

    // console.log(this.mapView.mapWindow.map)

    const placemark = mapObjects.addPlacemarkWithPoint(targetPoint)

    placemark.isDraggable = true

    placemark.setIconWithImage(UIImage.imageNamed('shop_marker'))

    const tapListener = new NSCYMKMapObjectTapListener()

    placemark.addTapListenerWithTapListener(tapListener)

    this.markers.push(targetPoint)
  }

  setMarkerClick(callback: Function) {
    this.onClick = callback
  }

  zoomIn() {
    const cameraPosition = this.mapView.mapWindow.map.cameraPosition
    const newCameraPosition =
      YMKCameraPosition.cameraPositionWithTargetZoomAzimuthTilt(
        cameraPosition.target,
        cameraPosition.zoom + 0.5,
        cameraPosition.azimuth,
        cameraPosition.tilt
      )
    const animation = YMKAnimation.animationWithTypeDuration(1, 0.5)
    this.mapView.mapWindow.map.moveWithCameraPositionAnimationCameraCallback(
      newCameraPosition,
      animation,
      null
    )
  }

  zoomOut() {
    const cameraPosition = this.mapView.mapWindow.map.cameraPosition
    const newCameraPosition =
      YMKCameraPosition.cameraPositionWithTargetZoomAzimuthTilt(
        cameraPosition.target,
        cameraPosition.zoom - 0.5,
        cameraPosition.azimuth,
        cameraPosition.tilt
      )
    const animation = YMKAnimation.animationWithTypeDuration(1, 0.5) // 1 - smooth animation, 0.5s duration

    this.mapView.mapWindow.map.moveWithCameraPositionAnimationCameraCallback(
      newCameraPosition,
      animation,
      null
    )
  }

  changeCenter(latitude: number, longitude: number) {
    const targetPoint = YMKPoint.pointWithLatitudeLongitude(latitude, longitude)
    const cameraPosition =
      YMKCameraPosition.cameraPositionWithTargetZoomAzimuthTilt(
        targetPoint,
        10,
        0,
        0
      )

    const animation = YMKAnimation.animationWithTypeDuration(1, 0.5) // 1 - smooth animation, 0.5s duration

    this.mapView.mapWindow.map.moveWithCameraPositionAnimationCameraCallback(
      cameraPosition,
      animation,
      null
    )
  }

  clearMap() {
    this.mapView.mapWindow.map.mapObjects.clear()
    this.markers = []
  }

  getRoute(
    start: { latitude: number; longitude: number },
    end: { latitude: number; longitude: number }
  ) {
    console.log('getRoute', start, end)

    const startCoordinate = CLLocationCoordinate2DMake(
      start.latitude,
      start.longitude
    )
    const endCoordinate = CLLocationCoordinate2DMake(
      end.latitude,
      end.longitude
    )

    const startPlacemark = new MKPlacemark({ coordinate: startCoordinate })
    const endPlacemark = new MKPlacemark({ coordinate: endCoordinate })

    const startMapItem = new MKMapItem({ placemark: startPlacemark })
    const endMapItem = new MKMapItem({ placemark: endPlacemark })

    const options = NSDictionary.dictionaryWithObjectForKey(
      'd',
      'MKLaunchOptionsDirectionsModeKey'
    )

    startMapItem.openInMapsWithLaunchOptions({
      [endMapItem]: options,
    })

    const alertController =
      UIAlertController.alertControllerWithTitleMessagePreferredStyle(
        'Install App',
        'Do you want to install Yandex Navigator?',
        1
      )

    const okAction = UIAlertAction.actionWithTitleStyleHandler(
      'OK',
      0,
      (action) => {
        const url = NSURL.URLWithString(
          'https://apps.apple.com/app/id474500851'
        )
        UIApplication.sharedApplication().openURL(url)
      }
    )

    const cancelAction = UIAlertAction.actionWithTitleStyleHandler(
      'Cancel',
      1,
      () => {}
    )

    alertController.addAction(okAction)
    alertController.addAction(cancelAction)

    UIApplication.sharedApplication().keyWindow.rootViewController.presentViewControllerAnimatedCompletion(
      alertController,
      true,
      null
    )
  }

  zoomToFitAllMarkers(full: boolean) {
    if (this.markers.length === 0) return

    let minLat = Number.MAX_VALUE
    let minLon = Number.MAX_VALUE
    let maxLat = Number.MIN_VALUE
    let maxLon = Number.MIN_VALUE

    for (const marker of this.markers) {
      if (marker.latitude < minLat) minLat = marker.latitude
      if (marker.longitude < minLon) minLon = marker.longitude
      if (marker.latitude > maxLat) maxLat = marker.latitude
      if (marker.longitude > maxLon) maxLon = marker.longitude
    }

    const centerLat = (minLat + maxLat) / 2
    const centerLon = (minLon + maxLon) / 2
    const targetPoint = YMKPoint.pointWithLatitudeLongitude(
      centerLat,
      centerLon
    )

    const latDelta = maxLat - minLat
    const lonDelta = maxLon - minLon

    // Adjust zoom level based on the deltas
    const zoomLevel = this.calculateZoomLevel(latDelta, lonDelta, full)

    const newCameraPosition =
      YMKCameraPosition.cameraPositionWithTargetZoomAzimuthTilt(
        targetPoint,
        zoomLevel,
        0,
        0
      )

    this.mapView.mapWindow.map.moveWithCameraPosition(newCameraPosition)
  }

  calculateZoomLevel(
    latDelta: number,
    lonDelta: number,
    full: boolean
  ): number {
    const minLatDelta = 0.0001
    const minLonDelta = 0.0001

    latDelta = Math.max(latDelta, minLatDelta)
    lonDelta = Math.max(lonDelta, minLonDelta)

    const mapHeightInDegrees = 0.1
    const mapWidthInDegrees = 0.1

    const zoomLevelLat = Math.log2(mapHeightInDegrees / latDelta)
    const zoomLevelLon = Math.log2(mapWidthInDegrees / lonDelta)

    const zoomLevel = Math.min(zoomLevelLat, zoomLevelLon)

    return Math.max(Math.min(zoomLevel, 17), full ? 7.5 : 11)
  }
}
