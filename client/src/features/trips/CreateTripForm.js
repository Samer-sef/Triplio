import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

import { useAddNewTripMutation } from "./tripApiSlice"
import { useSelector, useDispatch } from "react-redux"
import { selectCurrentUserId } from "../auth/authSlice"
import { setPage, selectPage } from "../trips/pageSlice"

import CustomModal from '../../components/CustomModal'

import { Grid, TextField, Typography, Alert } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import dayjs from 'dayjs'


export default function CreateTripForm() {

    const titleText = 'Create a trip: '
    const userId = useSelector(selectCurrentUserId)
    const page = useSelector(selectPage)

    const [addNewNote, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useAddNewTripMutation()

    const navigate = useNavigate()

    useEffect(() => {
        if (isSuccess) {
            navigate('/')
        }
    }, [isSuccess, navigate])

    const [name, setName] = useState('')
    const [location, setLocation] = useState('')
    const [description, setDescription] = useState('')
    const [date, setDate] = useState('')

    const handleTripNameInput = (e) => setName(e.target.value)
    const handleLocationInput = (e) => setLocation(e.target.value)
    const handleDescriptionInput = (e) => setDescription(e.target.value)
    const handleDateInput = (date) => setDate(dayjs(date).format('MM/DD/YYYY'))

    const dispatch = useDispatch()

    const handleSubmit = async () => {
        try{
            await addNewNote({ name, location, description, date, userId })
        } catch (err) {
            console.log('CreateTripForm error', err)
        }
        
        dispatch(setPage({ page: page === 0 ? undefined : 0 })) //reset the page number and ensure the previous state != the next one.
    }

    const RenderForm = (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Typography id="modal-modal-title" variant="p" mb={0}>Trip name</Typography>
                <TextField
                    fullWidth
                    onChange={handleTripNameInput}
                    required
                    id="outlined-tripname-input"
                    placeholder="e.g., Summer holiday in France"
                    type="text"
                />
            </Grid>

            <Grid item xs={12}>
                <Typography id="modal-modal-title" variant="p" mb={0}>Location</Typography>
                <TextField
                    fullWidth
                    onChange={handleLocationInput}
                    required
                    id="outlined-location-input"
                    placeholder="Where to?"
                    type="text"
                />
            </Grid>

            <Grid item xs={12}>
                <Typography id="modal-modal-title" variant="p" mb={0}>Description</Typography>
                <TextField
                    fullWidth
                    onChange={handleDescriptionInput}
                    required
                    id="outlined-tripname-input"
                    multiline
                    minRows={3}
                    rows={7} //to prevent the infinity rendering bug
                    placeholder="As the sun dipped behind the Eiffel Tower, casting a golden hue over the Seine, Emma found herself lost in the magic of Paris. She'd impulsively booked this trip, seeking an escape from the ordinary, and fate seemed to be guiding her steps through the City of Lights."
                    type="text"
                />
            </Grid>

            <Grid item xs={12}>
                
                {
                //     <TextField
                //     fullWidth
                //     onChange={handleDateInput}
                //     required
                //     id="outlined-tripname-input"
                //     placeholder="e.g., 2024/01/01"
                //     type="text"
                // />
            }
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Typography id="modal-modal-title" variant="p" mb={0}>Trip date</Typography>
                    <DatePicker onChange={handleDateInput} slotProps={{ textField: { fullWidth: true } }}/>
                </LocalizationProvider>
            </Grid>

            <Grid item xs={12} sx={{display: { xs: !isError && 'none' }}}>
                <Alert severity="error">{error?.data?.message}</Alert>
            </Grid>

            <Grid item xs={12}>
                <LoadingButton
                    fullWidth
                    loading={isLoading}
                    variant="contained"
                    onClick={handleSubmit}
                    >
                    Create
                </LoadingButton>
            </Grid>

        </Grid>
    )

    return <CustomModal title={titleText} Content={RenderForm} error={error?.data?.message}/>
}
