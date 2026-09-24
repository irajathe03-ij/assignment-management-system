import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";

function StudentDashboard() {

    const navigate = useNavigate();

    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const user = JSON.parse(localStorage.getItem("user"));

    const loadAssignments = async () => {

        try {

            const response = await api.get("/assignments");

            setAssignments(response.data);

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Unable to load assignments"
            );

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAssignments();
    }, []);

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    const getStatusClass = (status) => {

        if (status === "On Time") {
            return "bg-success";
        }

        if (status === "Late") {
            return "bg-warning text-dark";
        }

        if (status === "Missing") {
            return "bg-danger";
        }

        return "bg-secondary";
    };

    return (
        <div className="dashboard">

            <nav className="navbar navbar-custom">
                <div className="container">

                    <span className="navbar-brand fw-bold">
                        Assignment Manager
                    </span>

                    <div className="d-flex align-items-center gap-3">

                        <span>
                            👨‍🎓 {user?.name}
                        </span>

                        <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={logout}
                        >
                            Logout
                        </button>

                    </div>

                </div>
            </nav>

            <div className="container py-5">

                <div className="mb-4">
                    <h2>Student Dashboard</h2>

                    <p className="text-muted">
                        View assignments and track your submissions
                    </p>
                </div>

                {error && (
                    <div className="alert alert-danger">
                        {error}
                    </div>
                )}

                {loading ? (

                    <div className="text-center">
                        Loading assignments...
                    </div>

                ) : assignments.length === 0 ? (

                    <div className="card p-5 text-center">
                        <h4>No assignments available</h4>
                    </div>

                ) : (

                    <div className="row g-4">

                        {assignments.map((assignment) => (

                            <div
                                className="col-md-6 col-lg-4"
                                key={assignment.id}
                            >

                                <div className="card assignment-card h-100">

                                    <div className="card-body">

                                        <div className="d-flex justify-content-between align-items-start">

                                            <span className="badge bg-primary">
                                                {assignment.subject}
                                            </span>

                                            <span
                                                className={`badge status-badge ${getStatusClass(
                                                    assignment.status
                                                )}`}
                                            >
                                                {assignment.status}
                                            </span>

                                        </div>

                                        <h5 className="mt-3">
                                            {assignment.title}
                                        </h5>

                                        <p className="text-muted">
                                            {assignment.description ||
                                                "No description provided."}
                                        </p>

                                        <p>
                                            <strong>Deadline:</strong>
                                            <br />

                                            {new Date(
                                                assignment.deadline
                                            ).toLocaleString()}
                                        </p>

                                        {assignment.submission && (
                                            <div className="alert alert-light">
                                                <strong>
                                                    Submitted:
                                                </strong>

                                                <br />

                                                {new Date(
                                                    assignment.submission
                                                        .submitted_at
                                                ).toLocaleString()}
                                            </div>
                                        )}

                                    </div>

                                    <div className="card-footer bg-white border-0">

                                        {!assignment.submission &&
                                            assignment.status !== "Missing" && (

                                                <Link
                                                    to={`/student/submit/${assignment.id}`}
                                                    className="btn btn-primary w-100"
                                                >
                                                    Submit Assignment
                                                </Link>

                                            )}

                                        {assignment.submission && (
                                            <button
                                                className="btn btn-success w-100"
                                                disabled
                                            >
                                                ✓ Submitted
                                            </button>
                                        )}

                                        {assignment.status === "Missing" &&
                                            !assignment.submission && (
                                                <button
                                                    className="btn btn-danger w-100"
                                                    disabled
                                                >
                                                    Submission Missed
                                                </button>
                                            )}

                                    </div>

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </div>

        </div>
    );
}

export default StudentDashboard;