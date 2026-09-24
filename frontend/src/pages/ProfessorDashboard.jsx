import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";

function ProfessorDashboard() {
    const navigate = useNavigate();

    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const user = JSON.parse(localStorage.getItem("user"));

    const loadAssignments = async () => {
        try {
            setLoading(true);

            const response = await api.get("/assignments");

            setAssignments(response.data);
            setError("");
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

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this assignment?"
        );

        if (!confirmed) {
            return;
        }

        try {
            await api.delete(`/assignments/${id}`);

            alert("Assignment deleted successfully!");

            loadAssignments();
        } catch (error) {
            alert(
                error.response?.data?.message ||
                "Unable to delete assignment"
            );
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
    };

    return (
        <div className="dashboard">

            <nav className="navbar navbar-expand-lg navbar-custom">

                <div className="container">

                    <span className="navbar-brand fw-bold">
                        Assignment Manager
                    </span>

                    <div className="d-flex align-items-center gap-3">

                        <span>
                            👨‍🏫 {user?.name}
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

                <div className="d-flex justify-content-between align-items-center mb-4">

                    <div>

                        <h2>
                            Professor Dashboard
                        </h2>

                        <p className="text-muted mb-0">
                            Create and manage assignments
                        </p>

                    </div>

                    <Link
                        to="/professor/create"
                        className="btn btn-primary"
                    >
                        + Create Assignment
                    </Link>

                </div>

                {error && (
                    <div className="alert alert-danger">
                        {error}
                    </div>
                )}

                {loading ? (

                    <div className="text-center py-5">

                        <div
                            className="spinner-border text-primary"
                            role="status"
                        >
                            <span className="visually-hidden">
                                Loading...
                            </span>
                        </div>

                        <p className="mt-3 text-muted">
                            Loading assignments...
                        </p>

                    </div>

                ) : assignments.length === 0 ? (

                    <div className="card p-5 text-center shadow-sm">

                        <h4>
                            No assignments yet
                        </h4>

                        <p className="text-muted">
                            Create your first assignment to get started.
                        </p>

                        <Link
                            to="/professor/create"
                            className="btn btn-primary mx-auto"
                        >
                            Create Assignment
                        </Link>

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

                                        <span className="badge bg-primary mb-2">
                                            {assignment.subject}
                                        </span>

                                        <h5 className="card-title">
                                            {assignment.title}
                                        </h5>

                                        <p className="card-text text-muted">
                                            {assignment.description ||
                                                "No description provided."}
                                        </p>

                                        <p className="mb-1">
                                            <strong>
                                                Deadline:
                                            </strong>
                                        </p>

                                        <p className="text-danger">
                                            {new Date(
                                                assignment.deadline
                                            ).toLocaleString()}
                                        </p>

                                    </div>

                                    <div className="card-footer bg-white border-0 pb-3">

                                        <div className="d-flex gap-2 flex-wrap">

                                            {/* EDIT */}

                                            <Link
                                                to={`/professor/edit/${assignment.id}`}
                                                className="btn btn-outline-primary btn-sm"
                                            >
                                                Edit
                                            </Link>

                                            {/* VIEW SUBMISSIONS */}

                                            <Link
                                                to={`/professor/submissions/${assignment.id}`}
                                                className="btn btn-outline-success btn-sm"
                                            >
                                                View Submissions
                                            </Link>

                                            {/* DELETE */}

                                            <button
                                                className="btn btn-outline-danger btn-sm"
                                                onClick={() =>
                                                    handleDelete(
                                                        assignment.id
                                                    )
                                                }
                                            >
                                                Delete
                                            </button>

                                        </div>

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

export default ProfessorDashboard;