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

    const totalAssignments = assignments.length;

    const pendingCount = assignments.filter(
        (assignment) =>
            assignment.status === "Pending"
    ).length;

    const onTimeCount = assignments.filter(
        (assignment) =>
            assignment.status === "On Time"
    ).length;

    const lateCount = assignments.filter(
        (assignment) =>
            assignment.status === "Late"
    ).length;

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

                {/* Header */}

                <div className="mb-4">

                    <h2>Student Dashboard</h2>

                    <p className="text-muted mb-0">
                        View assignments and track your submissions
                    </p>

                </div>

                {/* Summary */}

                <div className="row g-3 mb-4">

                    <div className="col-6 col-lg-3">

                        <div className="card border-0 shadow-sm h-100">

                            <div className="card-body">

                                <p className="text-muted mb-1">
                                    Total
                                </p>

                                <h3 className="fw-bold mb-0">
                                    {totalAssignments}
                                </h3>

                            </div>

                        </div>

                    </div>

                    <div className="col-6 col-lg-3">

                        <div className="card border-0 shadow-sm h-100">

                            <div className="card-body">

                                <p className="text-muted mb-1">
                                    Pending
                                </p>

                                <h3 className="fw-bold mb-0">
                                    {pendingCount}
                                </h3>

                            </div>

                        </div>

                    </div>

                    <div className="col-6 col-lg-3">

                        <div className="card border-0 shadow-sm h-100">

                            <div className="card-body">

                                <p className="text-muted mb-1">
                                    On Time
                                </p>

                                <h3 className="fw-bold mb-0">
                                    {onTimeCount}
                                </h3>

                            </div>

                        </div>

                    </div>

                    <div className="col-6 col-lg-3">

                        <div className="card border-0 shadow-sm h-100">

                            <div className="card-body">

                                <p className="text-muted mb-1">
                                    Late
                                </p>

                                <h3 className="fw-bold mb-0">
                                    {lateCount}
                                </h3>

                            </div>

                        </div>

                    </div>

                </div>

                {/* Error */}

                {error && (
                    <div className="alert alert-danger">
                        {error}
                    </div>
                )}

                {/* Content */}

                {loading ? (

                    <div className="text-center py-5">
                        Loading assignments...
                    </div>

                ) : assignments.length === 0 ? (

                    <div className="card p-5 text-center shadow-sm">

                        <h4>No assignments available</h4>

                        <p className="text-muted mb-0">
                            Your professor has not posted any assignments yet.
                        </p>

                    </div>

                ) : (

                    <>

                        <h4 className="mb-3">
                            Your Assignments
                        </h4>

                        <div className="row g-4">

                            {assignments.map((assignment) => (

                                <div
                                    className="col-md-6 col-lg-4"
                                    key={assignment.id}
                                >

                                    <div className="card assignment-card h-100">

                                        <div className="card-body">

                                            <div className="d-flex justify-content-between align-items-start gap-2">

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
                                                <strong>
                                                    Deadline:
                                                </strong>

                                                <br />

                                                {new Date(
                                                    assignment.deadline
                                                ).toLocaleString()}
                                            </p>

                                            {assignment.submission && (

                                                <div className="alert alert-light mb-0">

                                                    <strong>
                                                        Submitted:
                                                    </strong>

                                                    <br />

                                                    {new Date(
                                                        assignment.submission.submitted_at
                                                    ).toLocaleString()}

                                                </div>

                                            )}

                                        </div>

                                        <div className="card-footer bg-white border-0 pb-3">

                                            {!assignment.submission && (

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

                                        </div>

                                    </div>

                                </div>

                            ))}

                        </div>

                    </>

                )}

            </div>

        </div>
    );
}

export default StudentDashboard;