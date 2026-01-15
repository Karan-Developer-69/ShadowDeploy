const express = require("express");
const { createProject, getProject, getUserProjects, updateProject } = require("../controller/project.controller");
const { getTrafficStats, getTrafficLogs, getRecentDiffs, getEndpoints } = require("../controller/dashboard.controller");
const { requireAuth } = require("../middleware/auth.middleware");

const router = express.Router();

const { validateProject } = require("../controller/project.controller");

router.post("/details", async (req, res) => {
    const { apiKey, projectId } = req.body;

    if (!apiKey || !projectId) {
        return res.status(400).json({ message: "apiKey and projectId required" });
    }

    const project = await validateProject(apiKey, projectId);

    if (!project) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({
        shadowUrl: project.shadowUrl || "http://localhost:3002",
    })
})

// Protected routes - require authentication
router.post('/project', requireAuth, createProject);
router.get('/project/:id', requireAuth, getProject);
router.put('/project/:id', requireAuth, updateProject);
router.get('/user/projects', requireAuth, getUserProjects);

// Dashboard data endpoints - all protected
router.get('/endpoints', requireAuth, getEndpoints);
router.get('/diffs/recent', requireAuth, getRecentDiffs);
router.get('/traffic/stats', requireAuth, getTrafficStats);
router.get('/traffic/logs', requireAuth, getTrafficLogs);

module.exports = router