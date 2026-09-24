import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";

function CreateAssignment() {

    const navigate = useNavigate();

    const [form, setForm] = useState({
        title: "",
        subject: "",
        description: "",
        deadline: ""
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {

            await api.post("/assignments", form);

            alert("Assignment created successfully!");

            navigate("/professor");

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Unable to create assignment"
            );

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="dashboard">

            <nav className="navbar navbar-custom">
                <div className="container">

                    <Link
                        to="/professor"
                        className="navbar-brand fw-bold"
                    >
                        ← Assignment Manager
                    </Link>

                </div>
            </nav>

            <div className="container py-5">

                <div className="card shadow-sm mx-auto"
                    style={{ maxWidth: "700px" }}>

                    <div className="card-body p-4">

                        <h2 className="mb-4">
                            Create Assignment
                        </h2>

                        {error && (
                            <div className="alert alert-danger">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>

                            <div className="mb-3">
                                <label className="form-label">
                                    Assignment Title *
                                </label>

                                <input
                                    type="text"
                                    name="title"
                                    className="form-control"
                                    placeholder="Example: Java OOP Assignment"
                                    value={form.title}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">
                                    Subject *
                                </label>

                                <input
                                    type="text"
                                    name="subject"
                                    className="form-control"
                                    placeholder="Example: Java"
                                    value={form.subject}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">
                                    Description
                                </label>

                                <textarea
                                    name="description"
                                    className="form-control"
                                    rows="4"
                                    placeholder="Assignment instructions..."
                                    value={form.description}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="mb-4">
                                <label className="form-label">
                                    Deadline *
                                </label>

                                <input
                                    type="datetime-local"
                                    name="deadline"
                                    className="form-control"
                                    value={form.deadline}
                                    onChange={handleChange}
                                    required
                                />

                                <small className="text-muted">
                                    Deadline must be in the future.
                                </small>
                            </div>

                            <div className="d-flex gap-2">

                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={loading}
                                >
                                    {loading
                                        ? "Creating..."
                                        : "Create Assignment"}
                                </button>

                                <Link
                                    to="/professor"
                                    className="btn btn-secondary"
                                >
                                    Cancel
                                </Link>

                            </div>

                        </form>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default CreateAssignment;