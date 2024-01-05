import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice"
import { setPage } from './pageSlice'


const tripsAdapter = createEntityAdapter()
const initialState = tripsAdapter.getInitialState()

export const tripApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getTrips: builder.query({
            query: (args) => ({
                url: `/trips?skip=${args.page * 5}`,
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
            // transformResponse: responseData => {
            //     // const loadedTrips = responseData.map(trip => {
            //     //     trip.id = trip._id
            //     //     return trip
            //     // });
            //     return tripsAdapter.setAll(initialState, responseData)
            // },
            providesTags: (result, error, arg) => {
                let trips = result.trips
                if (trips?.length) {
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
                body: {
                    ...initialTrip,
                }
            }),
            // invalidatesTags: [
            //     { type: 'Trip', id: "LIST" }
            // ]
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