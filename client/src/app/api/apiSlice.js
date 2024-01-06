import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { setCredentials, logOut } from '../../features/auth/authSlice'

const baseQuery = fetchBaseQuery({
    baseUrl: 'http://localhost:5000/api', //TODO:: Make it an env var
    credentials: 'include', // Send the http cookie back.
    prepareHeaders: (headers, { getState }) => {
        const token = getState().auth.token
        if (token) {
            headers.set("authorization", `Bearer ${token}`)
        }
        return headers
    }
})

const baseQueryWithReauth = async (args, api, extraOptions) => {
    // Possible imporvment: check if the token is expired then call refresh api directly.
    // that can be possible if cookie expiry data = refresh token expiry date on server...
    let result = await baseQuery(args, api, extraOptions)

    if (result?.error?.originalStatus === 403) {
        console.log('Sending refresh token')
        // send refresh token to get new access token 
        const refreshResult = await baseQuery('/refresh', api, extraOptions)
        console.log(refreshResult)
        if (refreshResult?.data) {
            // store the new token 
            api.dispatch(setCredentials({ ...refreshResult.data }))
            // retry the original query with new access token 
            result = await baseQuery(args, api, extraOptions)
        } else {
            if (refreshResult?.error?.status === 403) {
                refreshResult.error.data.message = "Your login has expired. Please sign in again."
            }
            return refreshResult
        }
    }
    console.log('result', result)
    return result
}

export const apiSlice = createApi({
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Trip'],
    endpoints: builder => ({})
})