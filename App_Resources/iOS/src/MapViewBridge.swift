import UIKit
import YandexMapsMobile

@objc(YandexMapViewBridge)
class YandexMapViewBridge: NSObject {
  @objc func createMapView() -> UIView {
    let mapViewController = MapViewController()
    return mapViewController.view
  }
}