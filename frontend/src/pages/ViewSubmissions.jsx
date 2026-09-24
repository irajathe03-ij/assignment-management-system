import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api";

function ViewSubmissions() {

    const { id } = useParams();

    const [assignment, setAssignment] =
        useState(null);

    const [submissions, setSubmissions] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    useEffect(() => {

        const loadData = async () => {

            try {

                const assignmentResponse =
                    await api.get(
                        `/assignments/${id}`
                    );

                const submissionResponse =
                    await api.get(
                        `/submissions/assignment/${id}`
                    );

                setAssignment(
                    assignmentResponse.data
                );

                setSubmissions(
                    submissionResponse.data
                );

            } catch (error) {

                setError(
                    error.response?.data?.message ||
                    "Unable to load submissions"
                );

            } finally {

                setLoading(false);

            }
        };

        loadData();

    }, [id]);


    const getStatusClass = (status) => {

        if (status === "On Time") {
            return "bg-success";
        }

        if (status === "Late") {
            return "bg-warning text-dark";
        }

        return "bg-secondary";
    };


    if (loading) {

        return (
            <div className="container py-5 text-center">
                Loading submissions...
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

                {error && (

                    <div className="alert alert-danger">
                        {error}
                    </div>

                )}


                {assignment && (

                    <div className="mb-4">

                        <h2>
                            {assignment.title}
                        </h2>

                        <p className="text-muted">
                            {assignment.subject}
                        </p>

                        <p>
                            <strong>
                                Deadline:
                            </strong>{" "}

                            {new Date(
                                assignment.deadline
                            ).toLocaleString()}
                        </p>

                    </div>

                )}


                {submissions.length === 0 ? (

                    <div className="card p-5 text-center">

                        <h4>
                            No submissions yet
                        </h4>

                        <p className="text-muted">
                            Students have not submitted
                            this assignment.
                        </p>

                    </div>

                ) : (

                    <div className="card shadow-sm">

                        <div className="card-body">

                            <h4 className="mb-4">
                                Student Submissions
                            </h4>


                            <div className="table-responsive">

                                <table className="table table-hover align-middle">

                                    <thead>

                                        <tr>

                                            <th>
                                                Student
                                            </th>

                                            <th>
                                                Email
                                            </th>

                                            <th>
                                                Submission
                                            </th>

                                            <th>
                                                Submitted At
                                            </th>

                                            <th>
                                                Status
                                            </th>

                                        </tr>

                                    </thead>


                                    <tbody>

                                        {submissions.map(
                                            (submission) => (

                                                <tr
                                                    key={
                                                        submission.id
                                                    }
                                                >

                                                    <td>
                                                        {
                                                            submission.student_name
                                                        }
                                                    </td>

                                                    <td>
                                                        {
                                                            submission.student_email
                                                        }
                                                    </td>

                                                    <td
                                                        style={{
                                                            maxWidth:
                                                                "300px",
                                                            wordBreak:
                                                                "break-word"
                                                        }}
                                                    >
                                                        {
                                                            submission.submission_content
                                                        }
                                                    </td>

                                                    <td>
                                                        {new Date(
                                                            submission.submitted_at
                                                        ).toLocaleString()}
                                                    </td>

                                                    <td>

                                                        <span
                                                            className={`badge ${getStatusClass(
                                                                submission.status
                                                            )}`}
                                                        >
                                                            {
                                                                submission.status
                                                            }
                                                        </span>

                                                    </td>

                                                </tr>

                                            )
                                        )}

                                    </tbody>

                                </table>

                            </div>

                        </div>

                    </div>

                )}


            </div>

        </div>

    );
}

export default ViewSubmissions;