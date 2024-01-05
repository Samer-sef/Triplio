import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import AdbIcon from '@mui/icons-material/Adb';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';



export default function TripCard({trip}) {
    const {name, description, location, length, date, rating} = trip

    return (
        <Paper style={{background: '#f9f9f9', width: '100%'}} sx={{ borderRadius: 2, marginBottom: 2 }}>
            <Grid container direction="row" justifyContent="flex-start" alignItems="center" p={2}>
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
