const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            message: "Authentication required"
        });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = decoded;

        next();
    } catch (error) {
        return res.status(403).json({
            message: "Invalid or expired token"
        });
    }
}

function requireProfessor(req, res, next) {
    if (req.user.role !== "PROFESSOR") {
        return res.status(403).json({
            message: "Professor access required"
        });
    }

    next();
}

function requireStudent(req, res, next) {
    if (req.user.role !== "STUDENT") {
        return res.status(403).json({
            message: "Student access required"
        });
    }

    next();
}

module.exports = {
    authenticateToken,
    requireProfessor,
    requireStudent
};