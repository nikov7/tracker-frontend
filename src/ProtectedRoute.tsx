
import {useContext} from "react";
import {AuthContext} from "./AuthContext";
import {Redirect, Route} from "wouter";

function ProtectedRoute({path, children}: {path: string, children: React.ReactNode}) {

    const auth = useContext(AuthContext);

    if (!auth?.data) {
        return <Redirect to="/login" />;
    }

    return (
        <Route path={path}>
            {children}
        </Route>
    );

}

export default ProtectedRoute;