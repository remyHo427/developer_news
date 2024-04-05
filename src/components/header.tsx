/** @jsx h */
import { h } from "preact";
import { useContext, useEffect, useState } from "preact/hooks";
import { Link } from "wouter-preact";
import context from "./context";
import { GetUserInfo } from "../api";

const Header = () => {
    const [info, setInfo] = useState<{
        name: string;
        karma: number;
    } | null>(null);
    const { state } = useContext(context)!;

    useEffect(() => {
        (async () => {
            if (state.isLoggedIn) {
                const res = await GetUserInfo();
                console.log("RES: ", res);
                setInfo(res);
            }
        })();
    }, [state.isLoggedIn]);

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
            {state.isLoggedIn && info ? (
                <div>
                    {info.name} ({info.karma})
                </div>
            ) : (
                <Link to="/login">login</Link>
            )}
        </div>
    );
};

export default Header;
