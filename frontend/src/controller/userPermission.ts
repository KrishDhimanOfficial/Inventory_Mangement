import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    permission: {},
}

const getUserPermissionSlice = createSlice({
    name: 'permission',
    initialState,
    reducers: {
        setUserPermission: (state, action) => {
            state.permission = action.payload
        },
    }
})

export const { setUserPermission } = getUserPermissionSlice.actions;
export const getUserPermissionSliceReducer = getUserPermissionSlice.reducer;
