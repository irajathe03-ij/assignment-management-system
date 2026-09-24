const { pool } = require("../config/db");

const {
    calculateAssignmentStatus
} = require("../utils/statusCalculator");

// CREATE ASSIGNMENT
async function createAssignment(req, res) {
    try {

        const {
            title,
            subject,
            description,
            deadline
        } = req.body;

        // Required fields
        if (!title || !subject || !deadline) {
            return res.status(400).json({
                message:
                    "Title, subject and deadline are required"
            });
        }

        const deadlineDate = new Date(deadline);

        // Validate date
        if (isNaN(deadlineDate.getTime())) {
            return res.status(400).json({
                message: "Invalid deadline"
            });
        }

        // Deadline must be future
        if (deadlineDate <= new Date()) {
            return res.status(400).json({
                message:
                    "Deadline must be in the future"
            });
        }

        const [result] = await pool.execute(
            `INSERT INTO assignments
            (title, subject, description, deadline)
            VALUES (?, ?, ?, ?)`,
            [
                title.trim(),
                subject.trim(),
                description || "",
                deadlineDate
            ]
        );

        res.status(201).json({
            message:
                "Assignment created successfully",
            assignmentId: result.insertId
        });

    } catch (error) {

        console.error(
            "Create assignment error:",
            error
        );

        res.status(500).json({
            message: "Server error"
        });
    }
}


// GET ALL ASSIGNMENTS
async function getAssignments(req, res) {

    try {

        const [assignments] = await pool.execute(
            `SELECT
                id,
                title,
                subject,
                description,
                deadline,
                created_at
             FROM assignments
             ORDER BY deadline ASC`
        );

        // Student receives calculated status
        if (req.user.role === "STUDENT") {

            const [submissions] =
                await pool.execute(
                    `SELECT
                        id,
                        student_id,
                        assignment_id,
                        submission_content,
                        submitted_at,
                        status
                     FROM submissions
                     WHERE student_id = ?`,
                    [req.user.id]
                );

            const result = assignments.map(
                (assignment) => {

                    const submission =
                        submissions.find(
                            (item) =>
                                item.assignment_id ===
                                assignment.id
                        );

                    return {
                        ...assignment,

                        status:
                            calculateAssignmentStatus(
                                assignment.deadline,
                                submission
                            ),

                        submission:
                            submission || null
                    };
                }
            );

            return res.json(result);
        }

        // Professor gets normal assignment list
        res.json(assignments);

    } catch (error) {

        console.error(
            "Get assignments error:",
            error
        );

        res.status(500).json({
            message: "Server error"
        });
    }
}


// GET SINGLE ASSIGNMENT
async function getAssignmentById(req, res) {

    try {

        const { id } = req.params;

        const [assignments] =
            await pool.execute(
                `SELECT
                    id,
                    title,
                    subject,
                    description,
                    deadline,
                    created_at
                 FROM assignments
                 WHERE id = ?`,
                [id]
            );

        if (assignments.length === 0) {

            return res.status(404).json({
                message: "Assignment not found"
            });
        }

        res.json(assignments[0]);

    } catch (error) {

        console.error(
            "Get assignment error:",
            error
        );

        res.status(500).json({
            message: "Server error"
        });
    }
}


// UPDATE ASSIGNMENT
async function updateAssignment(req, res) {

    try {

        const { id } = req.params;

        const {
            title,
            subject,
            description,
            deadline
        } = req.body;

        if (!title || !subject || !deadline) {

            return res.status(400).json({
                message:
                    "Title, subject and deadline are required"
            });
        }

        const deadlineDate = new Date(deadline);

        if (
            isNaN(deadlineDate.getTime()) ||
            deadlineDate <= new Date()
        ) {

            return res.status(400).json({
                message:
                    "Deadline must be a valid future date"
            });
        }

        const [result] =
            await pool.execute(
                `UPDATE assignments
                 SET title = ?,
                     subject = ?,
                     description = ?,
                     deadline = ?
                 WHERE id = ?`,
                [
                    title.trim(),
                    subject.trim(),
                    description || "",
                    deadlineDate,
                    id
                ]
            );

        if (result.affectedRows === 0) {

            return res.status(404).json({
                message:
                    "Assignment not found"
            });
        }

        res.json({
            message:
                "Assignment updated successfully"
        });

    } catch (error) {

        console.error(
            "Update assignment error:",
            error
        );

        res.status(500).json({
            message: "Server error"
        });
    }
}


// DELETE ASSIGNMENT
async function deleteAssignment(req, res) {

    try {

        const { id } = req.params;

        const [result] =
            await pool.execute(
                "DELETE FROM assignments WHERE id = ?",
                [id]
            );

        if (result.affectedRows === 0) {

            return res.status(404).json({
                message:
                    "Assignment not found"
            });
        }

        res.json({
            message:
                "Assignment deleted successfully"
        });

    } catch (error) {

        console.error(
            "Delete assignment error:",
            error.message
        );

        res.status(500).json({
            message:
                "Cannot delete assignment. It may have submissions."
        });
    }
}


module.exports = {
    createAssignment,
    getAssignments,
    getAssignmentById,
    updateAssignment,
    deleteAssignment
};