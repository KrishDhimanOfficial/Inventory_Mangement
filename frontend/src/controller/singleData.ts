import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    data: {},
}

const getsingleDataSlice = createSlice({
    name: 'singleRecord',
    initialState,
    reducers: {
        setSingleData: (state, action) => {
            state.data = action.payload
        },
    }
})

export const { setSingleData } = getsingleDataSlice.actions;
export const getSingleRecordSliceReducer = getsingleDataSlice.reducer;
