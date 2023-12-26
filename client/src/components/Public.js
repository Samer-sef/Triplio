import { Link } from "react-router-dom"

const Public = () => {

    const content = (
        <section className="public">
            <header>
                <h1>Welcome</h1>
            </header>
            <footer>
                <Link to="/login">Employee Login</Link>
                <Link to="/register">Employee Signup</Link>
            </footer>
        </section>

    )
    return content
}
export default Public