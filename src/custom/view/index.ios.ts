// @ts-ignore
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

declare const YMKMapObjectTapListener: any

class MapObjectTapListenerImpl implements YMKMapObjectTapListener {
  onMapObjectTap(mapObject: YMKMapObject, point: YMKPoint): boolean {
    console.log(`Tapped the point ${point.longitude}, ${point.latitude}`)
    return true
  }
}

export class YandexMapView extends View {
  private mapView: any
  private onClick: Function | null = null

  constructor() {
    super()
    this.initMap()
  }

  createNativeView() {
    console.log('createNativeView')
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
    // const apiKey = 'ede1bf3a-0f5a-4b84-ac98-ec94baf3e422'
    // YMKMapKit.setApiKey(apiKey)

    // console.log(YMKMapKit, this.mapView)
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
  }

  addShop(latitude: number, longitude: number, info: string) {
    const tapListener = new MapObjectTapListenerImpl()
    const targetPoint = YMKPoint.pointWithLatitudeLongitude(latitude, longitude)
    const mapObjects = this.mapView.mapWindow.map.mapObjects

    const placemark = mapObjects.addPlacemark()

    placemark.isDraggable = true

    console.log(placemark)

    placemark.setIconWithImage(
      UIImage.imageNamed('shop_marker') ?? new UIImage()
    )

    placemark.geometry = targetPoint

    console.log(tapListener)
    console.log(placemark)
    // placemark.addTapListener(tapListener)
  }

  setMarkerClick(callback: Function) {
    console.log('setMarkerClick', callback)
    this.onClick = callback
    console.log(typeof this.onClick)
  }

  zoomIn() {
    const cameraPosition = this.mapView.mapWindow.map.cameraPosition
    const newCameraPosition =
      YMKCameraPosition.cameraPositionWithTargetZoomAzimuthTilt(
        cameraPosition.target,
        cameraPosition.zoom + 1,
        cameraPosition.azimuth,
        cameraPosition.tilt
      )
    this.mapView.mapWindow.map.moveWithCameraPosition(newCameraPosition)
  }

  zoomOut() {
    const cameraPosition = this.mapView.mapWindow.map.cameraPosition
    const newCameraPosition =
      YMKCameraPosition.cameraPositionWithTargetZoomAzimuthTilt(
        cameraPosition.target,
        cameraPosition.zoom - 1,
        cameraPosition.azimuth,
        cameraPosition.tilt
      )
    this.mapView.mapWindow.map.moveWithCameraPosition(newCameraPosition)
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
    this.mapView.mapWindow.map.moveWithCameraPosition(cameraPosition)
  }

  clearMap() {
    this.mapView.mapWindow.map.mapObjects.clear()
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
}
