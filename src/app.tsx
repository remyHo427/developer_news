/** @jsx h */
import { h } from "preact";
import { Switch, Route } from "wouter-preact";
import context, { reducer } from "./components/context";

import Header from "./components/header";
import Home from "./pages/home";
import Login from "./pages/login";
import { useReducer } from "preact/hooks";
import React from "preact/compat";
import { GetUserInfo } from "./api";

export function App() {
    const [state, dispatch] = useReducer(reducer, {
        isLoggedIn: false,
        name: null,
        karma: null,
    });

    React.useEffect(() => {
        (async () => {
            const { data, errno, status } = await GetUserInfo();
            if (status !== 200) {
                // display with errno
            } else {
                dispatch({
                    isLoggedIn: true,
                    name: data.name,
                    karma: data.karma,
                });
            }
        })();
    }, []);

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
