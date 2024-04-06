/** @jsx h */
import { h } from "preact";
import { useContext } from "preact/hooks";
import { Link } from "wouter-preact";
import context from "./context";

const Header = () => {
    const { state } = useContext(context)!;

    return (
        <div className="header">
            <nav className="func-box">
                <Link to="/">
                    <div className="logo">Developer News</div>
                </Link>
                <div className="links">
                    <Link to="/newest">new</Link>
                    <Link to="/past">past</Link>
                    <Link to="/comments">comments</Link>
                    <Link to="/ask">ask</Link>
                    <Link to="/show">show</Link>
                    <Link to="/jobs">jobs</Link>
                    <Link to="/submit">submit</Link>
                </div>
            </nav>
            {state.isLoggedIn ? (
                <Badge name={state.name} karma={state.karma} />
            ) : (
                <Link to="/login">login</Link>
            )}
        </div>
    );
};

interface BadgeProps {
    name: string | null;
    karma: number | null;
}
const Badge = ({ name, karma }: BadgeProps) => {
    return name !== null && karma !== null ? (
        <div>
            {name} ({karma})
        </div>
    ) : (
        <div />
    );
};

export default Header;
