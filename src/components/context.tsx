import { createContext } from "preact";
import { Dispatch } from "preact/hooks";

interface Ctx {
    isLoggedIn: boolean;
    name: string | null;
    karma: number | null;
}

const reducer = (state: Ctx, action: Partial<Ctx>): Ctx => ({
    ...state,
    ...action,
});

const context = createContext<{
    state: Ctx;
    dispatch: Dispatch<Partial<Ctx>>;
} | null>(null);

export { reducer };
export default context;
