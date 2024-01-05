import { createSlice } from "@reduxjs/toolkit"

const authSlice = createSlice({
    name: 'auth',
    initialState: { username: null, token: null, email: null },
    reducers: {
        setCredentials: (state, action) => {
            const { username, email, accessToken } = action.payload
            state.username = username
            state.email = email
            state.token = accessToken
        },
        logOut: (state, action) => {
            state.username = null
            state.email = null
            state.token = null
        }
    },
})

export const { setCredentials, logOut } = authSlice.actions

export default authSlice.reducer

export const selectCurrentUser = (state) => state.auth.username
export const selectCurrentEmail = (state) => state.auth.email
export const selectCurrentToken = (state) => state.auth.token