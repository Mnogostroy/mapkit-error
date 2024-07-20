<script lang="ts" setup>
  import { computed, ref, watchEffect } from 'nativescript-vue'
  import { CoreTypes, Dialogs, EventData, Screen } from '@nativescript/core'

  const props = defineProps<{
    shopsList: Array<any>
    active: string | boolean
    center: Array<number>
    zoom: number
  }>()

  const emit = defineEmits<{
    (e: '_tap', data: any): void
    (e: '_loader', active: boolean): void
  }>()

  const nativeMap = ref()

  const openInfoBox = (point: any, markerId: any) => {
    return emit('_tap', markerId)
  }

  const markersList = computed(() => {
    if (!props.active) return props.shopsList

    const groupedShops = props.shopsList.reduce((acc, shop) => {
      const city = shop.shop_city.replace('г. ', '')
      if (!acc[city]) {
        acc[city] = []
      }
      acc[city].push(shop)
      return acc
    }, {})

    console.log(groupedShops)
    return groupedShops[props.active]
  })

  const wasLoaded = ref(false)

  const addMarkers = () => {
    const nativeView = nativeMap.value.nativeView
    nativeView.clearMap()
    nativeView.setMarkerClick(openInfoBox)

    markersList.value.forEach((marker: any) => {
      const coords = marker.shop_coords.split(', ')

      nativeView.addShop(
        Number(coords[0]),
        Number(coords[1]),
        marker.shop_coords
      )
    })
    nativeView.changeCenter(props.center[0], props.center[1], props.zoom)
  }

  const height = ref(0)

  const setMAPView = (args: any) => {
    console.log(props.active, height.value)
    setTimeout(() => {
      if (props.active)
        height.value = args.object.parent.getActualSize().height + 80
      else height.value = Screen.mainScreen.heightDIPs - 150
    }, 100)

    setTimeout(() => {
      addMarkers()

      wasLoaded.value = true
      // 45.035470, 38.975313 krasnodar
      // 43.438172, 39.911178 sochi
    }, 500)
  }

  const zoomOut = () => {
    nativeMap.value.nativeView.zoomOut()
  }

  const zoomIn = () => {
    nativeMap.value.nativeView.zoomIn()
  }

  const resetHeight = () => {
    height.value = 0
  }

  watchEffect(async () => {
    if (nativeMap.value && wasLoaded.value) {
      addMarkers()
    }
  })
</script>
<template>
  <GridLayout @loaded="setMAPView" @unloaded="resetHeight">
    <YandexMapView ref="nativeMap" width="100%" :height="height" />
    <GridLayout
      @tap="zoomIn"
      horizontalAlignment="right"
      verticalAlignment="bottom"
      class="mr-[16] w-[40] h-[40] p-0 text-[20px] text-center bg-black text-white mb-[72] rounded-[16]">
      <Label text="+" class="-mt-[6]" />
    </GridLayout>
    <GridLayout
      @tap="zoomOut"
      horizontalAlignment="right"
      verticalAlignment="bottom"
      class="mr-[16] w-[40] h-[40] p-0 text-[20px] text-center bg-black text-white mb-[120] rounded-[16]">
      <Label text="-" class="-mt-[7]" />
    </GridLayout>
  </GridLayout>
</template>
