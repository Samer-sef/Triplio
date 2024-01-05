import { createSlice } from "@reduxjs/toolkit"

const initialState = { page: 0 }

const pageSlice = createSlice({
    name: 'pageNum',
    initialState: initialState,
    reducers: {
        setPage: (state, action) => {
            const { page } = action.payload
            state.page = page
        },
        resetPage: () => initialState,
    },
})


export const { setPage,resetPage } = pageSlice.actions

export default pageSlice.reducer

export const selectPage = (state) => state.pageNum.page