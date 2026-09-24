import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../api";

function SubmitAssignment() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [assignment, setAssignment] = useState(null);
    const [submissionContent, setSubmissionContent] = useState("");
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [result, setResult] = useState(null);

    useEffect(() => {

        const loadAssignment = async () => {

            try {

                const response = await api.get(
                    `/assignments/${id}`
                );

                setAssignment(response.data);

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

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!submissionContent.trim()) {
            setError("Submission content is required");
            return;
        }

        setError("");
        setSubmitting(true);

        try {

            const response = await api.post(
                "/submissions",
                {
                    assignmentId: Number(id),
                    submissionContent
                }
            );

            setResult(response.data);

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Submission failed"
            );

        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="container py-5">
                Loading assignment...
            </div>
        );
    }

    if (!assignment) {
        return (
            <div className="container py-5">
                <div className="alert alert-danger">
                    {error || "Assignment not found"}
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard">

            <nav className="navbar navbar-custom">

                <div className="container">

                    <Link
                        to="/student"
                        className="navbar-brand fw-bold"
                    >
                        ← Student Dashboard
                    </Link>

                </div>

            </nav>

            <div className="container py-5">

                <div
                    className="card shadow-sm mx-auto"
                    style={{ maxWidth: "750px" }}
                >

                    <div className="card-body p-4">

                        <span className="badge bg-primary mb-2">
                            {assignment.subject}
                        </span>

                        <h2>
                            {assignment.title}
                        </h2>

                        <p className="text-muted">
                            {assignment.description}
                        </p>

                        <div className="alert alert-warning">
                            <strong>Deadline:</strong>{" "}
                            {new Date(
                                assignment.deadline
                            ).toLocaleString()}
                        </div>

                        {error && (
                            <div className="alert alert-danger">
                                {error}
                            </div>
                        )}

                        {result ? (

                            <div className="text-center">

                                <div className="alert alert-success">

                                    <h4>
                                        Submission Successful!
                                    </h4>

                                    <p>
                                        Your submission was recorded
                                        by the server.
                                    </p>

                                    <hr />

                                    <p>
                                        <strong>Status:</strong>{" "}
                                        <span
    className={`badge ${
        result.status === "On Time"
            ? "bg-success"
            : "bg-warning text-dark"
    }`}
>
    {result.status}
</span>
                                    </p>

                                    <p>
                                        <strong>Submitted At:</strong>
                                        <br />

                                        {new Date(
                                            result.submittedAt
                                        ).toLocaleString()}
                                    </p>

                                </div>

                                <button
                                    className="btn btn-primary"
                                    onClick={() =>
                                        navigate("/student")
                                    }
                                >
                                    Back to Dashboard
                                </button>

                            </div>

                        ) : (

                            <form onSubmit={handleSubmit}>

                                <div className="mb-4">

                                    <label className="form-label">
                                        Submission Content / File Link *
                                    </label>

                                    <textarea
                                        className="form-control"
                                        rows="8"
                                        value={submissionContent}
                                        onChange={(e) =>
                                            setSubmissionContent(
                                                e.target.value
                                            )
                                        }
                                        placeholder="Enter your solution, GitHub link, Google Drive link, or file reference..."
                                        required
                                    />

                                </div>

                                <div className="d-flex gap-2">

                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={submitting}
                                    >
                                        {submitting
                                            ? "Submitting..."
                                            : "Submit Assignment"}
                                    </button>

                                    <Link
                                        to="/student"
                                        className="btn btn-secondary"
                                    >
                                        Cancel
                                    </Link>

                                </div>

                            </form>

                        )}

                    </div>

                </div>

            </div>

        </div>
    );
}

export default SubmitAssignment;