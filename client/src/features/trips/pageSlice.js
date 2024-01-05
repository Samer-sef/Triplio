import { createSlice } from "@reduxjs/toolkit"


const pageSlice = createSlice({
    name: 'pageNum',
    initialState: { page: 0, isCreateTripCall: false },
    reducers: {
        setPage: (state, action) => {
            const { page, isCreateTripCall } = action.payload
            state.page = page
            state.isCreateTripCall = isCreateTripCall
        },
    },
})


export const { setPage } = pageSlice.actions

export default pageSlice.reducer

export const selectPage = (state) => state.pageNum.page
export const selectIsCreateTripCall = (state) => state.pageNum.isCreateTripCall