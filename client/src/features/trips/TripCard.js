import AdbIcon from '@mui/icons-material/Adb';
import { Grid, Typography, Stack, Paper, FormControlLabel, Alert } from '@mui/material';



export default function TripCard({trip}) {
    const {name, description, location, length, date, rating} = trip

    return (
        <Paper style={{background: '#f9f9f9'}} sx={{ borderRadius: 2, marginBottom: 2}}>
            <Grid width='100vh' container direction="row" justifyContent="flex-start" alignItems="center" p={2}>
                <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 2, justifySelf: 'auto' }} />
                <Stack spacing={0}>
                    <Typography>{name + ' - ' + date}</Typography>
                    <Typography>samer sefrani</Typography>
                </Stack>
                <Typography>{description}</Typography>
            </Grid>
        </Paper>
    )
}
