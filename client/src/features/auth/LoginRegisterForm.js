import { useRef, useState, useEffect, Fragment } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

import { useDispatch } from 'react-redux'
import { setCredentials } from './authSlice'
import { useLoginMutation } from './authApiSlice'
import usePersist from '../../hooks/usePersist'
import { useRegisterMutation } from './registerApiSlice'

import CustomModal from '../../components/CustomModal'

import { Grid, TextField, Checkbox, Alert, FormControlLabel } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';


const LoginRegisterForm = () => {
    const userRef = useRef()
    const errRef = useRef()
    const [firstname, setFirstname] = useState('')
    const [lastname, setLastname] = useState('')
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')
    const [errMsg, setErrMsg] = useState('')
    const [persist, setPersist] = usePersist()

    const navigate = useNavigate()
    const location = useLocation();

    const [login, { isLoading: isLoginLoading, isError: isLoginError, error: loginError }] = useLoginMutation()
    const [register, { isLoading: isRegisterLoading, isError: isRegisterError, error: registerError }] = useRegisterMutation()
    const isLoading = isLoginLoading || isRegisterLoading
    const isError = isLoginError || isRegisterError
    const errorMessage = loginError || registerError
    console.log('isError', isError)
    console.log('errorMessage', errorMessage)
    const dispatch = useDispatch()

    const isLogin = location.pathname === '/login'

    useEffect(() => {
        userRef.current?.focus()
    }, [])

    useEffect(() => {
        setErrMsg('')
    }, [firstname, lastname, email, password])

    const resetState = () => {
        setFirstname('')
        setLastname('')
        setPassword('')
        setEmail('')
    }

    const proccessLogin = async () => {
        const userData = await login({ email, password }).unwrap()
        resetState()
        dispatch(setCredentials({ ...userData }))
        navigate('/')
    }

    const proccessRegister = async () => {
        const username = firstname + ' ' + lastname
        const userData = await register({ email, username, password }).unwrap()
        resetState()
        dispatch(setCredentials({ ...userData }))
        navigate('/')
    }

    const handleSubmit = async (e) => {
        try {
            isLogin ? await proccessLogin() : await proccessRegister()
        } catch (err) {
            console.log('LoginRegisterForm error', err)
            if (!err?.status) {
                // isLoading: true until timeout occurs
                setErrMsg('No Server Response');
            } else if (err.status === 400) {
                setErrMsg('Missing one of the fields');
            } else if (err.status === 401) {
                setErrMsg('Unauthorized');
            } else {
                setErrMsg('Login Failed');
            }
            errRef.current?.focus();
        }
    }

    const handleFirstnameInput = (e) => setFirstname(e.target.value)
    const handleLastnameInput = (e) => setLastname(e.target.value)
    const handleEmailInput = (e) => setEmail(e.target.value)
    const handlePwdInput = (e) => setPassword(e.target.value)
    const handleToggle = () => setPersist(prev => !prev)

    const titleText = isLogin? 'Login' : 'Register'

    const RenderForm = (
        <Grid container spacing={2} mt={1}>
            <Grid item xs={12} sx={{display: { xs: !errMsg && 'none' }}}>
                <Alert severity="error">{errMsg}</Alert>
            </Grid>
            {!isLogin &&
                <Fragment>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            autoFocus={true}
                            onChange={handleFirstnameInput}
                            required
                            id="outlined-firstname-input"
                            label="First Name"
                            type="text"
                            />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            onChange={handleLastnameInput}
                            required
                            id="outlined-lastname-input"
                            label="Last Name"
                            type="text"
                            />
                    </Grid>
                </Fragment>
            }
            <Grid item xs={12}>
                <TextField
                    fullWidth
                    onChange={handleEmailInput}
                    autoFocus={isLogin}
                    required
                    id="outlined-email-input"
                    label="Email"
                    type="email"
                    />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    fullWidth
                    onChange={handlePwdInput}
                    required
                    id="outlined-password-input"
                    label="Password"
                    type="password"
                    />
            </Grid>
            <Grid item xs={12}>
                <FormControlLabel control={
                    <Checkbox
                        id="persist"
                        checked={persist}
                        onChange={handleToggle}
                    />
                } label="Remember this device." />
            </Grid>
            <Grid item xs={12}>
                <LoadingButton
                    fullWidth
                    loading={isLoading}
                    variant="contained"
                    onClick={handleSubmit}
                >
                    {titleText}
                </LoadingButton>
            </Grid>
        </Grid>
    )

    return <CustomModal title={titleText} Content={RenderForm}/>

}
export default LoginRegisterForm