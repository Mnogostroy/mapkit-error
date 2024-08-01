// @ts-nocheck
/* eslint-disable */

import { isAndroid, isIOS } from '@nativescript/core/platform'
import { layout } from '@nativescript/core/utils'
import { TextField } from '@nativescript/core/ui/text-field'

export function deleteTap() {
  if (isIOS) {
    let UITextFieldImpl = (function (_super) {
      __extends(UITextFieldImpl, _super)

      function UITextFieldImpl() {
        return (_super !== null && _super.apply(this, arguments)) || this
      }

      UITextFieldImpl.initWithOwner = function (owner) {
        let handler = UITextFieldImpl.new()

        handler._owner = owner

        return handler
      }

      UITextFieldImpl.prototype._getTextRectForBounds = function (bounds) {
        let owner = this._owner ? this._owner.get() : null

        if (!owner) {
          return bounds
        }

        let size = bounds.size
        let x = layout.toDeviceIndependentPixels(
          owner.effectiveBorderLeftWidth + owner.effectivePaddingLeft
        )
        let y = layout.toDeviceIndependentPixels(
          owner.effectiveBorderTopWidth + owner.effectivePaddingTop
        )
        let width = layout.toDeviceIndependentPixels(
          layout.toDevicePixels(size.width) -
            (owner.effectiveBorderLeftWidth +
              owner.effectivePaddingLeft +
              owner.effectivePaddingRight +
              owner.effectiveBorderRightWidth)
        )
        let height = layout.toDeviceIndependentPixels(
          layout.toDevicePixels(size.height) -
            (owner.effectiveBorderTopWidth +
              owner.effectivePaddingTop +
              owner.effectivePaddingBottom +
              owner.effectiveBorderBottomWidth)
        )

        return CGRectMake(x, y, width, height)
      }

      UITextFieldImpl.prototype.textRectForBounds = function (bounds) {
        return this._getTextRectForBounds(bounds)
      }

      UITextFieldImpl.prototype.editingRectForBounds = function (bounds) {
        return this._getTextRectForBounds(bounds)
      }

      UITextFieldImpl.prototype.deleteBackward = function () {
        let owner = this._owner ? this._owner.get() : null

        if (owner) {
          owner.notify({ eventName: 'deleteTap', object: owner })
        }

        return _super.prototype.deleteBackward.call(this)
      }

      return UITextFieldImpl
    })(UITextField)

    TextField.prototype.createNativeView = function () {
      return UITextFieldImpl.initWithOwner(new WeakRef(this))
    }
  } else if (isAndroid) {
    let orgCreateNativeView = TextField.prototype.createNativeView

    TextField.prototype.createNativeView = function () {
      let nativeView = orgCreateNativeView.apply(this, arguments)

      nativeView.setOnKeyListener(
        new android.view.View.OnKeyListener({
          onKey: (view, keyCode, keyevent) => {
            if (keyCode == android.view.KeyEvent.KEYCODE_DEL) {
              this.notify({ eventName: 'deleteTap', object: this })
            }

            return false
          },
        })
      )

      return nativeView
    }
  }
}
