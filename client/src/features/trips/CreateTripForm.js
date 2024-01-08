import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

import { useAddNewTripMutation } from "./tripApiSlice"
import { useSelector, useDispatch } from "react-redux"
import { selectCurrentUserId, selectCurrentUsername } from "../auth/authSlice"
import { setPage, selectPage } from "../trips/pageSlice"

import CustomModal from '../../components/CustomModal'
import {ImageListCustom} from '../../components/ImageListCustom'

import { Grid, TextField, Typography, Alert, IconButton } from '@mui/material';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import LoadingButton from '@mui/lab/LoadingButton';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import dayjs from 'dayjs'


export default function CreateTripForm() {

    const titleText = 'Create a trip: '
    const userId = useSelector(selectCurrentUserId)
    const username = useSelector(selectCurrentUsername)
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
    const [images, setImages] = useState()
    const [imagePreviews, setImagePreviews] = useState([])
    
    const handleTripNameInput = (e) => setName(e.target.value)
    const handleLocationInput = (e) => setLocation(e.target.value)
    const handleDescriptionInput = (e) => setDescription(e.target.value)
    const handleDateInput = (date) => setDate(dayjs(date).format('MM/DD/YYYY'))
    const handleUpload = (e) => {
        const files = e.target.files
        setImages(files)
        structureImages(files)
    }

    const dispatch = useDispatch()

    const structureImages = (imgs) => {
        let imagesList = []
        Array.from(imgs).forEach(image => {
            imagesList = [
                ...imagesList,
                {
                    url: URL.createObjectURL(image),
                    key: image.name
                }
            ]
        });
        setImagePreviews(imagesList)
    }

    const addUserInputToForm = async () => {
        const formData = new FormData();
        formData.append('name', name)
        formData.append('location', location)
        formData.append('description', description)
        formData.append('date', date)
        formData.append('username', username)
        formData.append('userId', userId)
        Array.from(images).forEach(image => {
            formData.append("image", image);
        });
        return formData
    }

    const handleSubmit = async () => {
        try{
            await addNewNote(await addUserInputToForm())
        } catch (err) {
            console.log('CreateTripForm error', err)
        }

         //reset the page number and ensure the previous state != the next one ONLY if the addNewNote succeeds.
        isSuccess && dispatch(setPage({ page: page === 0 ? undefined : 0 }))
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
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Typography id="modal-modal-title" variant="p" mb={0}>Trip date</Typography>
                    <DatePicker onChange={handleDateInput} slotProps={{ textField: { fullWidth: true } }}/>
                </LocalizationProvider>
            </Grid>

            <Grid item xs={12}>
                <TextField
                    variant="standard"          
                    type="text"
                    InputProps={{
                        endAdornment: (
                        <IconButton component="label">
                            <FileUploadIcon />
                            <input
                                styles={{display:"none"}}
                                type="file"
                                hidden
                                multiple
                                onChange={handleUpload}
                                name="[licenseFile]"
                                />
                        </IconButton>
                        ),
                    }}
                    />
                { imagePreviews?.length && <ImageListCustom cols={4} imageList={imagePreviews}/> }
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
