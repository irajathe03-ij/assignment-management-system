const { pool } = require("../config/db");
const {
    calculateSubmissionStatus
} = require("../utils/statusCalculator");

async function submitAssignment(req, res) {
    try {
        const { assignmentId, submissionContent } = req.body;

        if (!assignmentId || !submissionContent) {
            return res.status(400).json({
                message: "Assignment and submission content are required"
            });
        }

        const [assignments] = await pool.execute(
            "SELECT * FROM assignments WHERE id = ?",
            [assignmentId]
        );

        if (assignments.length === 0) {
            return res.status(404).json({
                message: "Assignment not found"
            });
        }

        const assignment = assignments[0];

        const [existing] = await pool.execute(
            `SELECT id
             FROM submissions
             WHERE student_id = ?
             AND assignment_id = ?`,
            [
                req.user.id,
                assignmentId
            ]
        );

        if (existing.length > 0) {
            return res.status(409).json({
                message: "You have already submitted this assignment"
            });
        }

        // Server-side timestamp.
        // Do not accept submittedAt from the frontend.
        const submittedAt = new Date();

        const status = calculateSubmissionStatus(
            submittedAt,
            assignment.deadline
        );

        const [result] = await pool.execute(
            `INSERT INTO submissions
            (
                student_id,
                assignment_id,
                submission_content,
                submitted_at,
                status
            )
            VALUES (?, ?, ?, ?, ?)`,
            [
                req.user.id,
                assignmentId,
                submissionContent,
                submittedAt,
                status
            ]
        );

        res.status(201).json({
            message: "Assignment submitted successfully",
            submissionId: result.insertId,
            submittedAt,
            status
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
}

async function getMySubmissions(req, res) {
    try {
        const [submissions] = await pool.execute(
            `SELECT
                s.id,
                s.assignment_id,
                a.title,
                a.subject,
                a.deadline,
                s.submission_content,
                s.submitted_at,
                s.status
             FROM submissions s
             JOIN assignments a
             ON s.assignment_id = a.id
             WHERE s.student_id = ?
             ORDER BY s.submitted_at DESC`,
            [req.user.id]
        );

        res.json(submissions);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
}

async function getAssignmentSubmissions(req, res) {
    try {
        const { assignmentId } = req.params;

        const [submissions] = await pool.execute(
            `SELECT
                s.id,
                u.name AS student_name,
                u.email AS student_email,
                s.submission_content,
                s.submitted_at,
                s.status
             FROM submissions s
             JOIN users u
             ON s.student_id = u.id
             WHERE s.assignment_id = ?
             ORDER BY s.submitted_at ASC`,
            [assignmentId]
        );

        res.json(submissions);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
}

module.exports = {
    submitAssignment,
    getMySubmissions,
    getAssignmentSubmissions
};