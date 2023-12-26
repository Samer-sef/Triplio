import { useRef, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { useDispatch } from 'react-redux'
import { setCredentials } from './authSlice'
import { useRegisterMutation } from './registerApiSlice'


const Register = () => {
    const userRef = useRef()
    const errRef = useRef()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')
    const [errMsg, setErrMsg] = useState('')
    const navigate = useNavigate()

    const [register, { isLoading }] = useRegisterMutation()
    const dispatch = useDispatch()

    useEffect(() => {
        userRef.current?.focus()
    }, [])

    useEffect(() => {
        setErrMsg('')
    }, [username, password, email])

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const userData = await register({ email, username, password }).unwrap()
            //dispatch(setCredentials({ ...userData, user }))
            setUsername('')
            setPassword('')
            setEmail('')
            navigate('/login')
        } catch (err) {
            if (!err?.originalStatus) {
                // isLoading: true until timeout occurs
                setErrMsg('No Server Response');
            } else if (err.originalStatus === 400) {
                setErrMsg('Missing Username or Password');
            } else if (err.originalStatus === 401) {
                setErrMsg('Unauthorized');
            } else {
                setErrMsg('Register failed');
            }
            errRef.current?.focus();
        }
    }

    const handleUserInput = (e) => setUsername(e.target.value)

    const handlePwdInput = (e) => setPassword(e.target.value)

    const handleEmailInput = (e) => setEmail(e.target.value)

    const content = isLoading ? <h1>Loading...</h1> : (
        <section className="login">
            <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>

            <h1>Employee Login</h1>

            <form onSubmit={handleSubmit}>
                <label htmlFor="username">Username:</label>
                <input
                    type="text"
                    id="username"
                    ref={userRef}
                    value={username}
                    onChange={handleUserInput}
                    autoComplete="off"
                    required
                />

                <label htmlFor="password">Password:</label>
                <input
                    type="password"
                    id="password"
                    onChange={handlePwdInput}
                    value={password}
                    required
                />

                <label htmlFor="email">email:</label>
                <input
                    type="text"
                    id="email"
                    onChange={handleEmailInput}
                    value={email}
                    required
                />
                <button>Register</button>
            </form>
        </section>
    )

    return content
}
export default Register