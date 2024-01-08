import AdbIcon from '@mui/icons-material/Adb';
import { Grid, Typography, Paper } from '@mui/material';

import {ImageListCustom} from '../../components/ImageListCustom'

import dayjs from 'dayjs'


export default function TripCard({trip}) {
    const {name, description, location, date: tripDate, createdAt, username: createdBy, images } = trip

    const createdAtReadable = dayjs(createdAt).format('YYYY-MM-DD HH:mm')

    return (
        <Paper style={{background: '#f9f9f9'}} sx={{ borderRadius: 2, marginBottom: 2}}>
            <Grid width='100vh' container alignItems="center" p={2}>
                <Grid container pb={2}>
                    <Grid item xs={1}>
                        <AdbIcon fontSize="large"/>
                    </Grid>
                    <Grid item>
                        <Typography>{name + ' - ' + createdAtReadable}</Typography>
                        <Typography>{createdBy}</Typography>
                    </Grid>
                </Grid>
                    
                <Typography>{location} - {tripDate}</Typography>
                <Typography>{description}</Typography>
                <Grid container>
                   { images?.length && <ImageListCustom cols={4} imageList={images}/> }
                </Grid>
            </Grid>
        </Paper>
    )
}
