import { createRouter, createWebHistory } from 'vue-router'
import IntroScreen from '../components/IntroScreen.vue'
import Room1 from '../components/Room1.vue'
import RoomBar from '../components/RoomBar.vue'
import RoomKeuken from '../components/RoomKeuken.vue'
import RoomSlaapkamer from '../components/RoomSlaapkamer.vue'
import RoomHalletje from '../components/RoomHalletje.vue'
import RoomTuin from '../components/RoomTuin.vue'
import RoomOverloop from '../components/RoomOverloop.vue'
import RoomBadkamer from '../components/RoomBadkamer.vue'

const routes = [
  {
    path: '/',
    name: 'Intro',
    component: IntroScreen
  },
  {
    path: '/room1',
    name: 'Room1',
    component: Room1
  },
  {
    path: '/room/bar',
    name: 'RoomBar',
    component: RoomBar
  },
  {
    path: '/room/keuken',
    name: 'RoomKeuken',
    component: RoomKeuken
  },
  {
    path: '/room/slaapkamer',
    name: 'RoomSlaapkamer',
    component: RoomSlaapkamer
  },
  {
    path: '/room/halletje',
    name: 'RoomHalletje',
    component: RoomHalletje
  },
  {
    path: '/room/tuin',
    name: 'RoomTuin',
    component: RoomTuin
  },
  {
    path: '/room/overloop',
    name: 'RoomOverloop',
    component: RoomOverloop
  },
  {
    path: '/room/badkamer',
    name: 'RoomBadkamer',
    component: RoomBadkamer
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router