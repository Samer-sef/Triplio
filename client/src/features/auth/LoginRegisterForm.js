import { useRef, useState, useEffect, Fragment } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

import { useDispatch } from 'react-redux'
import { setCredentials } from './authSlice'
import { useLoginMutation } from './authApiSlice'
import usePersist from '../../hooks/usePersist'
import { useRegisterMutation } from './registerApiSlice'

import CustomModal from '../../components/CustomModal'

import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';


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

    const [login, { isLoginLoading }] = useLoginMutation()
    const [register, { isRegisterLoading }] = useRegisterMutation()
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
            isLogin ? proccessLogin() : proccessRegister()
        } catch (err) {
            if (!err?.originalStatus) {
                // isLoading: true until timeout occurs
                setErrMsg('No Server Response');
            } else if (err.originalStatus === 400) {
                setErrMsg('Missing Username or Password');
            } else if (err.originalStatus === 401) {
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
                <Button
                    fullWidth
                    variant="contained"
                    onClick={handleSubmit}
                >
                    {titleText}
                </Button>
            </Grid>
        </Grid>

    )

    const content = isLoginLoading || isRegisterLoading? 'loading...' : (
        <CustomModal title={titleText} Content={RenderForm}/>
    )

    return content
}
export default LoginRegisterForm