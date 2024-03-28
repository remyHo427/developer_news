/** @jsx h */
import { h } from "preact";
import { Switch, Route } from "wouter-preact";
import Home from "./pages/home";
import Header from "./components/header";

export function App() {
    return (
        <div className="app">
            <Header />
            <Switch>
                <Route path="/">
                    <Home />
                </Route>
                <Route path="/login">
                    <div>login</div>
                </Route>
                <Route>
                    <div>404</div>
                </Route>
            </Switch>
        </div>
    );
}

export default App;
