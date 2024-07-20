<script lang="ts" setup>
  import YandexMap from '~/components/YandexMap.vue'
  import { isIOS } from '@nativescript/core'

  const shopsList = [
    {
      title: 'г. Сочи, Адлерский район, ул. Авиационная, 15 (рынок Мишутка)',
      image:
        'https://mnogostroy-sochi.ru/assets/images/uploads/shop/IMG_20210520_080810653.jpg',
      days_list: 'пн||вт||ср||чт||пт||сб||вс',
      shop_schedule: '8:00 - 19:00',
      shop_phones: '<a href="tel:+78006001434">8 (800) 600-14-34</a>',
      shop_coords: '43.430003, 39.933514',
      shop_city: 'г. Сочи',
      shop_street: 'Адлерский район, ул. Авиационная, 15 (рынок Мишутка)',
      street_short: 'ул. Авиационная, 15',
    },
    {
      title: 'г. Сочи, ул. Урожайная, 77 (ТЦ CAMEL)',
      image:
        'https://mnogostroy-sochi.ru/assets/images/uploads/shop/WhatsApp Image 2020-04-04 at 18.40.09.jpeg',
      days_list: 'пн||вт||ср||чт||пт||сб||вс',
      shop_schedule: '8:00 - 19:00',
      shop_phones: '<a href="tel:+78006001434">8 (800) 600-14-34</a>',
      shop_coords: '43.398852, 40.003434',
      shop_city: 'г. Сочи',
      shop_street: 'Адлерский район, ул. Урожайная, 77 (ТЦ CAMEL)',
      street_short: 'ул. Урожайная, 77',
    },
    {
      title: 'г. Сочи, Адлерский район, село Весёлое, ул. Мира, 60',
      image: 'https://mnogostroy-sochi.ru/assets/images/uploads/vesel (1).jpeg',
      days_list: 'пн||вт||ср||чт||пт||сб||вс',
      shop_schedule: '8:00 - 19:00',
      shop_phones: '<a href="tel:+78006001434">8 (800) 600-14-34</a>',
      shop_coords: '43.415715, 40.005627',
      shop_city: 'г. Сочи',
      shop_street: 'Адлерский район, село Весёлое, ул. Мира, 60',
      street_short: 'село Весёлое, ул. Мира, 60',
    },
  ]

  const shopsItems = {
    active: 'sochi',
    field: {
      items: [
        {
          value: 'sochi',
          name: 'Сочи',
          checked: true,
          coords: [43.40813, 39.966496],
        },
        {
          value: 'krasnodar',
          name: 'Краснодар',
          checked: false,
          coords: [45.03547, 38.975313],
        },
      ],
    },
  }

  const openShopInfo = (data) => {
    console.log('tap', data)
  }
</script>
<template>
  <Page :actionBarHidden="true">
    <GridLayout row="0" rows="auto, *">
      <YandexMap
        row="1"
        rows="*"
        :shopsList="shopsList"
        active="Сочи"
        :center="[43.40813, 39.966496]"
        :zoom="isIOS ? 14 : 12"
        @_tap="openShopInfo" />
    </GridLayout>
  </Page>
</template>
