/** @jsx h */
import { h } from "preact";
import { useReducer } from "preact/hooks";
import { Link } from "wouter-preact";
import { UserLogin } from "../api";

interface FormValues {
    login: string | null;
    password: string | null;
}
const reducer = (
    state: FormValues,
    action: Partial<FormValues>,
): FormValues => ({
    ...state,
    ...action,
});

const Login = () => {
    const [values, setValues] = useReducer(reducer, {
        login: null,
        password: null,
    });

    const onSubmit = async (e) => {
        e.preventDefault();

        const res = await UserLogin(
            values.login as string,
            values.password as string,
        );

        console.log(res);
    };
    const onLoginChange = (e) => setValues({ login: e.target.value });
    const onPasswordChange = (e) => setValues({ password: e.target.value });

    return (
        <div>
            <form onSubmit={onSubmit}>
                <div className="field">
                    <label for="login">Username/Email: </label>
                    <input
                        name="login"
                        value={values.login || ""}
                        required
                        onChange={onLoginChange}
                    />
                </div>
                <div className="field">
                    <label for="password">Password: </label>
                    <input
                        name="password"
                        type="password"
                        value={values.password || ""}
                        required
                        onChange={onPasswordChange}
                    />
                </div>
                <div className="actions">
                    <button type="submit">log in</button>
                </div>
            </form>
            <div className="links">
                <Link to="/register">sign up</Link>
                <Link to="/forgot_password">forgot your password?</Link>
            </div>
        </div>
    );
};

export default Login;
