/** @jsx h */
import { h } from "preact";
import { useState } from "preact/hooks";
import { Switch, Link, Route, useLocation } from "wouter-preact";
import Homepage from "./pages/homepage";

export function App() {
    return (
        <div className="app">
            <div className="bg-primary">
                <Header />
            </div>
            <main>
                <Switch>
                    <Route path="/">
                        <Homepage />
                    </Route>
                    <Route>404</Route>
                </Switch>
            </main>
            <footer>foot</footer>
        </div>
    );
}

const links: { to: string; children: string }[] = [
    {
        to: "/projects",
        children: "Projects",
    },
    {
        to: "/meets",
        children: "Meets",
    },
    {
        to: "/blog",
        children: "Blog",
    },
    {
        to: "/about",
        children: "About",
    },
];
const Header = () => {
    const [active, setActive] = useState<number | null>(null);
    const [location] = useLocation();

    return (
        <header className="header">
            <div className="left">
                <div className="links">
                    {links.map((p, i) => (
                        <Link
                            {...p}
                            key={i}
                            onClick={() => setActive(i)}
                            className={
                                location !== "/" && active === i ? "active" : ""
                            }
                        />
                    ))}
                </div>
            </div>
            <div className="right"></div>
        </header>
    );
};

export default App;
