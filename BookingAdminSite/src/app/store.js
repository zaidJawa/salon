import {
  configureStore
} from '@reduxjs/toolkit'
import bookingsSlice from '../features/bookings/bookingsSlice'
import headerSlice from '../features/common/headerSlice'
import modalSlice from '../features/common/modalSlice'
import rightDrawerSlice from '../features/common/rightDrawerSlice'
import servicesSlice from '../features/services/servicesSlice'

const combinedReducer = {
  header: headerSlice,
  rightDrawer: rightDrawerSlice,
  modal: modalSlice,
  services: servicesSlice,
  bookings: bookingsSlice
}

export default configureStore({
  reducer: combinedReducer
})