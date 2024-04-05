/** @jsx h */
import { h } from "preact";
import { Switch, Route } from "wouter-preact";
import context, { reducer } from "./components/context";

import Header from "./components/header";
import Home from "./pages/home";
import Login from "./pages/login";
import { useReducer } from "preact/hooks";

export function App() {
    const [state, dispatch] = useReducer(reducer, {
        isLoggedIn: false,
    });

    return (
        <div className="app">
            <context.Provider value={{ state, dispatch }}>
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
            </context.Provider>
        </div>
    );
}

export default App;
