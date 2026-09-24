const express = require("express");

const {
    createAssignment,
    getAssignments,
    getAssignmentById,
    updateAssignment,
    deleteAssignment
} = require("../controllers/assignmentController");

const {
    authenticateToken,
    requireProfessor
} = require("../middleware/authMiddleware");

const router = express.Router();

// Get all assignments
router.get(
    "/",
    authenticateToken,
    getAssignments
);

// Get one assignment
router.get(
    "/:id",
    authenticateToken,
    getAssignmentById
);

// Create assignment
router.post(
    "/",
    authenticateToken,
    requireProfessor,
    createAssignment
);

// Update assignment
router.put(
    "/:id",
    authenticateToken,
    requireProfessor,
    updateAssignment
);

// Delete assignment
router.delete(
    "/:id",
    authenticateToken,
    requireProfessor,
    deleteAssignment
);

module.exports = router;