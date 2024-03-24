/** @jsx h */
import { h } from "preact";
import { Switch, Link, Route } from "wouter-preact";

const App = () => {
    return (
        <div>
            <nav>
                <Link to="/">home</Link>
                <Link to="/about">about</Link>
                <Link to="/test">test</Link>
            </nav>
            <Switch>
                <Route path="/">
                    <div>home</div>
                </Route>
                <Route path="/about">
                    <div>about</div>
                </Route>
                <Route path="/test">
                    <div>test</div>
                </Route>
                <Route>
                    <div>404</div>
                </Route>
            </Switch>
        </div>
    );
};

export default App;
