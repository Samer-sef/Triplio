import { useState, useEffect } from "react"

import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';

import TripCard from '../features/trips/TripCard'
import CustomFab from './CustomFab'

import { useNavigate, Outlet } from 'react-router-dom'

import { useGetTripsQuery } from "../features/trips/tripApiSlice"
import { useSelector } from "react-redux"
import { useDispatch } from 'react-redux'
import { selectPage, setPage } from '../features/trips/pageSlice'

import InfiniteScroll from 'react-infinite-scroll-component';


const Home = () => {

    const page = useSelector(selectPage)
    
    const {
        data,
        currentData,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetTripsQuery({page}, {
        // pollingInterval: 15000,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true
    })

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const handleCreateTrip = () => {
        navigate(`/createTrip`) //TODO:: check for login
    }
    

    if(isSuccess){
        const { count, trips } = data
        return(
            <Grid container>
                <Box 
                    sx={{ width: '100%', height: '100%' }}
                    display="flex"
                    justifyContent="center"
                >
                    <Grid
                        item
                        display="flex"
                        justifyContent="center"
                        xs={11}
                        md={5}
                        pt={5}
                    >
                    {
                        !isLoading && 
                            <InfiniteScroll
                                dataLength={trips.length}
                                next={() => dispatch(setPage({page: page+1}))}
                                style={{overflow: 'hidden'}} //Bug fix for scrollbar that shows when scrolling fast.
                                hasMore={trips.length < count}
                                loader={
                                    <Box
                                        display="flex"
                                        justifyContent="center"
                                    >
                                        <CircularProgress/>
                                    </Box>
                                }
                                endMessage={
                                    <Typography p={3} sx={{textAlign: 'center'}}>No more trips to display!</Typography>
                                }
                            >
                                {trips.map((trip) => (
                                    <TripCard trip={trip}/>
                                ))}
                        </InfiniteScroll>
                    }

                    </Grid>
                </Box>
                <CustomFab onClick={() => handleCreateTrip()}/>
                <Outlet/>
            </Grid>
        )
    }
}

export default Home