import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    data: {},
    sidemenu: true,
    settings: {}
}

const getsingleDataSlice = createSlice({
    name: 'singleRecord',
    initialState,
    reducers: {
        setSingleData: (state, action) => {
            state.data = action.payload
        },
        setSideMenu: (state, action) => {
            state.sidemenu = action.payload
        },
        setSettings: (state, action) => {
            state.settings = action.payload
        }
    }
})

export const { setSingleData, setSideMenu, setSettings } = getsingleDataSlice.actions;
export const getSingleRecordSliceReducer = getsingleDataSlice.reducer;
