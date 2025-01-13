import { useSelector } from "react-redux";
import { selectCurrentToken } from "../app/redux/userSlice";
import { Navigate, Outlet, useLocation } from "react-router-dom";

export default function NoAuth() {
    const token = useSelector(selectCurrentToken);
    const location = useLocation();

    return token ? (
        <Navigate to="/" state={{ from: location }} replace />
    ) : (
        <Outlet />
    );
}