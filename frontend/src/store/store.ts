import { configureStore } from '@reduxjs/toolkit'
import { getSingleRecordSliceReducer } from '../controller/singleData'

const store = configureStore({
    reducer: {
        singleData: getSingleRecordSliceReducer
    }
})

export default store