const express = require("express");

const router = express.Router();

const {
  createAssignment,
  getAssignments,
  updateAssignment,
  deleteAssignment,
  toggleAssignmentStatus,
  toggleMilestoneStatus,
} = require("../controllers/assignmentController");

// Create Assignment
router.post("/", createAssignment);

// Get All Assignments
router.get("/", getAssignments);

// Update Assignment
router.put("/:id", updateAssignment);

// Delete Assignment
router.delete("/:id", deleteAssignment);

// Toggle Complete / Pending
router.patch("/:id/toggle", toggleAssignmentStatus);
router.patch(
  "/:assignmentId/milestones/:milestoneId/toggle",
  toggleMilestoneStatus
);

module.exports = router;