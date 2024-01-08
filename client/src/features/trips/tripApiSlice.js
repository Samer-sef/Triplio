import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice"

import {generateAwsS3Url} from '../../config/utils'


const tripsAdapter = createEntityAdapter()
const initialState = tripsAdapter.getInitialState()

export const tripApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getTrips: builder.query({
            query: (args) => ({
                url: `/trips?page=${args.page}&limit=${10}`,
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError
                },
            }),
            // Only have one cache entry because the arg always maps to one string
            serializeQueryArgs: ({ endpointName }) => {
              return endpointName;
            },
            // Always merge incoming data to the cache entry
            merge: (currentCache, newItems, options) => {
                const args = options.arg
                const page = args.page
                if(page === 0 || !page){ // temporary solution until RTK release a new fix for infinity scroll support...
                    currentCache.trips = [...newItems.trips]
                }else{
                    currentCache.trips = [...currentCache.trips, ...newItems.trips]
                }
            },
            // Refetch when the page arg changes
            forceRefetch({ currentArg, previousArg }) {
              return currentArg !== previousArg;
            },
            transformResponse: responseData => {
                responseData.trips.map(trip => {
                    trip.images = trip.images.map(key => {
                            return {
                                key,
                                url: generateAwsS3Url(key)
                            }
                    })
                    return trip
                });
                return responseData
            },
            providesTags: (result, error, arg) => {
                let trips = result?.trips
                if (trips?.length > 0) {
                    let x = [
                        { type: 'Trip', id: 'LIST' },
                        ...trips.map(trip => ({ type: 'Trip', id: trip._id }))
                    ]
                    return x
                } else return [{ type: 'Trip', id: 'LIST' }]
            }
        }),
        addNewTrip: builder.mutation({
            query: initialTrip => ({
                url: '/trips',
                method: 'POST',
                body: initialTrip,
                formData: true,
            }),
            // invalidatesTags: [
            //     { type: 'Trip', id: "LIST" }
            // ],
        }),
        updateTrip: builder.mutation({
            query: initialTrip => ({
                url: '/trips',
                method: 'PATCH',
                body: {
                    ...initialTrip,
                }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Trip', id: arg.id }
            ]
        }),
        deleteTrip: builder.mutation({
            query: ({ id }) => ({
                url: `/trips`,
                method: 'DELETE',
                body: { id }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Trip', id: arg.id }
            ]
        }),
    }),
})

export const {
    useGetTripsQuery,
    useAddNewTripMutation,
    useUpdateTripMutation,
    useDeleteTripMutation,
} = tripApiSlice

// returns the query result object
export const selectTripsResult = tripApiSlice.endpoints.getTrips.select()

// creates memoized selector
const selectTripsData = createSelector(
    selectTripsResult,
    TripsResult => TripsResult.data // normalized state object with ids & entities
)

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllTrips,
    selectById: selectTripById,
    selectIds: selectTripIds
    // Pass in a selector that returns the trips slice of state
} = tripsAdapter.getSelectors(state => selectTripsData(state) ?? initialState)