import { configureStore } from '@reduxjs/toolkit'
import { getSingleRecordSliceReducer } from '../controller/singleData'
import { getUserPermissionSliceReducer } from '../controller/userPermission'

const store = configureStore({
    reducer: {
        singleData: getSingleRecordSliceReducer,
        permission: getUserPermissionSliceReducer
    }
})

export default store