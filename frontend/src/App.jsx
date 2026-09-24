import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";

import ProfessorDashboard from "./pages/ProfessorDashboard";
import CreateAssignment from "./pages/CreateAssignment";
import EditAssignment from "./pages/EditAssignment";
import ViewSubmissions from "./pages/ViewSubmissions";

import StudentDashboard from "./pages/StudentDashboard";
import SubmitAssignment from "./pages/SubmitAssignment";


function ProtectedRoute({ children, role }) {

    const token = localStorage.getItem("token");

    const userString = localStorage.getItem("user");

    const user = userString
        ? JSON.parse(userString)
        : null;

    if (!token || !user) {
        return <Navigate to="/login" />;
    }

    if (role && user.role !== role) {
        return <Navigate to="/login" />;
    }

    return children;
}


function App() {

    return (
        <BrowserRouter>

            <Routes>

                {/* Home */}

                <Route
                    path="/"
                    element={
                        <Navigate to="/login" />
                    }
                />


                {/* Authentication */}

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />


                {/* Professor Dashboard */}

                <Route
                    path="/professor"
                    element={
                        <ProtectedRoute role="PROFESSOR">
                            <ProfessorDashboard />
                        </ProtectedRoute>
                    }
                />


                {/* Create Assignment */}

                <Route
                    path="/professor/create"
                    element={
                        <ProtectedRoute role="PROFESSOR">
                            <CreateAssignment />
                        </ProtectedRoute>
                    }
                />


                {/* Edit Assignment */}

                <Route
                    path="/professor/edit/:id"
                    element={
                        <ProtectedRoute role="PROFESSOR">
                            <EditAssignment />
                        </ProtectedRoute>
                    }
                />


                {/* View Submissions */}

                <Route
                    path="/professor/submissions/:id"
                    element={
                        <ProtectedRoute role="PROFESSOR">
                            <ViewSubmissions />
                        </ProtectedRoute>
                    }
                />


                {/* Student Dashboard */}

                <Route
                    path="/student"
                    element={
                        <ProtectedRoute role="STUDENT">
                            <StudentDashboard />
                        </ProtectedRoute>
                    }
                />


                {/* Submit Assignment */}

                <Route
                    path="/student/submit/:id"
                    element={
                        <ProtectedRoute role="STUDENT">
                            <SubmitAssignment />
                        </ProtectedRoute>
                    }
                />


                {/* Unknown Route */}

                <Route
                    path="*"
                    element={
                        <Navigate to="/login" />
                    }
                />

            </Routes>

        </BrowserRouter>
    );
}


export default App;