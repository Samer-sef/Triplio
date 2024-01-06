import { createSlice } from "@reduxjs/toolkit"

const authSlice = createSlice({
    name: 'auth',
    initialState: { username: null, token: null, userId: null },
    reducers: {
        setCredentials: (state, action) => {
            const { username, userId, accessToken } = action.payload
            state.username = username
            state.userId = userId
            state.token = accessToken
        },
        logOut: (state, action) => {
            state.username = null
            state.userId = null
            state.token = null
        }
    },
})

export const { setCredentials, logOut } = authSlice.actions

export default authSlice.reducer

export const selectCurrentUser = (state) => state.auth.username
export const selectCurrentUserId = (state) => state.auth.userId
export const selectCurrentToken = (state) => state.auth.token