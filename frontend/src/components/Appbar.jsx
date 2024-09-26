import { Link } from "react-router-dom";

export const Appbar = ({ userName }) => {
    return (
        <div className="flex justify-between items-center">
            <div>
                <span className="text-2xl font-bold">PayMate</span>
            </div>
            <div className="flex items-center">
                <span className="mr-4">Hello, {userName || "User"}!</span>
                <Link to="/signin" className="bg-slate-800 text-white px-4 py-2 rounded-md hover:bg-slate-700 transition-colors">
                    Logout
                </Link>
            </div>
        </div>
    );
};