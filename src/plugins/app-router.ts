import { createRouter } from 'router-vue-native'
import Home from '~/pages/Home.vue'

const routes = [
  {
    path: '/',
    component: Home,
  },
]

const router = createRouter({ routes })

export { router }
