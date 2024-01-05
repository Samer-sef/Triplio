import { Outlet } from 'react-router-dom'
import NavBar from './NavBar'

const AppLayout = (props) => {
    return (
        <div>
            <NavBar />
            <Outlet height="100vh"/>
        </div>
    )
}
export default AppLayout