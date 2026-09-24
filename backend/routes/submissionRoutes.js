const express = require("express");

const {
    submitAssignment,
    getMySubmissions,
    getAssignmentSubmissions
} = require("../controllers/submissionController");

const {
    authenticateToken,
    requireStudent,
    requireProfessor
} = require("../middleware/authMiddleware");

const router = express.Router();


// Student submits assignment
router.post(
    "/",
    authenticateToken,
    requireStudent,
    submitAssignment
);


// Student views own submissions
router.get(
    "/my",
    authenticateToken,
    requireStudent,
    getMySubmissions
);


// Professor views submissions for assignment
router.get(
    "/assignment/:assignmentId",
    authenticateToken,
    requireProfessor,
    getAssignmentSubmissions
);


module.exports = router;