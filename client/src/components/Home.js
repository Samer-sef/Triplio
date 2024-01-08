import { Grid, Box, CircularProgress, Typography, Divider } from '@mui/material';

import TripCard from '../features/trips/TripCard'
import CustomFab from './CustomFab'

import { useNavigate, Outlet } from 'react-router-dom'

import { useGetTripsQuery } from "../features/trips/tripApiSlice"
import { useSelector, useDispatch } from "react-redux"
import { selectPage, setPage } from '../features/trips/pageSlice'

import InfiniteScroll from 'react-infinite-scroll-component';


const Home = () => {

    const page = useSelector(selectPage)
    
    const {
        data,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetTripsQuery({page}, {
        pollingInterval: 60000 * 3, // Automatically refresh the trips on home page every 3 minutes.
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true
    })

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const handleCreateTrip = () => {
        navigate(`/createTrip`)
    }

    let content

    if(isLoading){
        content = ('loading')
    }

    if(isError){
        console.log('error', error)
        content = (<Typography p={3}>{error.data?.message + ' :/'}</Typography>)
    }

    if(isSuccess){
        const { count, trips } = data
        console.log('datadatadata',data )
        content = (
            <InfiniteScroll
                dataLength={trips.length}
                next={() => dispatch(setPage({page: page+1}))}
                style={{overflow: 'hidden'}} //Bug fix for scrollbar that shows when scrolling fast.
                hasMore={trips.length < count}
                loader={
                    <Box
                        display="flex"
                        justifyContent="center">
                        <CircularProgress/>
                    </Box>
                }
                endMessage={
                    <Box pt={8}>
                        <Divider variant="middle"/>
                        <Typography p={3} sx={{textAlign: 'center'}}>No more trips to display!</Typography>
                    </Box>
                }
            >
                {trips.map((trip) => (
                    <TripCard key={trip._id} trip={trip}/>
                ))}
            </InfiniteScroll>)
    }
    

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

                { content }

                </Grid>
            </Box>
            <CustomFab onClick={() => handleCreateTrip()}/>
            <Outlet/>
        </Grid>
    )
}

export default Home