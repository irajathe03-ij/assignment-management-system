import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../api";

function EditAssignment() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        title: "",
        subject: "",
        description: "",
        deadline: ""
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {

        const loadAssignment = async () => {

            try {

                const response = await api.get(
                    `/assignments/${id}`
                );

                const assignment = response.data;

                // Convert database date to datetime-local format
                const date = new Date(
                    assignment.deadline
                );

                const localDate =
                    new Date(
                        date.getTime() -
                        date.getTimezoneOffset() * 60000
                    )
                    .toISOString()
                    .slice(0, 16);

                setForm({
                    title: assignment.title,
                    subject: assignment.subject,
                    description:
                        assignment.description || "",
                    deadline: localDate
                });

            } catch (error) {

                setError(
                    error.response?.data?.message ||
                    "Unable to load assignment"
                );

            } finally {

                setLoading(false);

            }
        };

        loadAssignment();

    }, [id]);


    const handleChange = (e) => {

        setForm({
            ...form,
            [e.target.name]: e.target.value
        });

    };


    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");
        setSaving(true);

        try {

            await api.put(
                `/assignments/${id}`,
                form
            );

            alert(
                "Assignment updated successfully!"
            );

            navigate("/professor");

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Unable to update assignment"
            );

        } finally {

            setSaving(false);

        }
    };


    if (loading) {

        return (
            <div className="container py-5 text-center">
                Loading assignment...
            </div>
        );

    }


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

                <div
                    className="card shadow-sm mx-auto"
                    style={{ maxWidth: "700px" }}
                >

                    <div className="card-body p-4">

                        <h2 className="mb-4">
                            Edit Assignment
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
                                    rows="5"
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
                                    Deadline must remain in the future.
                                </small>

                            </div>


                            <div className="d-flex gap-2">

                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={saving}
                                >
                                    {saving
                                        ? "Saving..."
                                        : "Save Changes"}
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

export default EditAssignment;