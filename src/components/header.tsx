/** @jsx h */
import { h } from "preact";
import { Link } from "wouter-preact";

const Header = () => {
    return (
        <div className="header">
            <nav className="func-box">
                <Link to="/news">
                    <div className="logo">Developer News</div>
                </Link>
                <div className="links">
                    <Link to="/newest">new</Link>
                    <Link to="/past">past</Link>
                    <Link to="/ask">ask</Link>
                    <Link to="/show">show</Link>
                    <Link to="/jobs">jobs</Link>
                    <Link to="/submit">submit</Link>
                </div>
            </nav>
            <Link to="/login">login</Link>
        </div>
    );
};

export default Header;
