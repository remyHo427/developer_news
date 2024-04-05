/** @jsx h */
import { h } from "preact";
import { Switch, Route } from "wouter-preact";
import Home from "./pages/home";
import Header from "./components/header";
import Login from "./pages/login";

export function App() {
    return (
        <div className="app">
            <Header />
            <Switch>
                <Route path="/">
                    <Home />
                </Route>
                <Route path="/login">
                    <Login />
                </Route>
                <Route>
                    <div>404</div>
                </Route>
            </Switch>
        </div>
    );
}

export default App;
