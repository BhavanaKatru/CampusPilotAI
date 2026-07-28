const Assignment = require("../models/Assignment");

// Create assignment
const createAssignment = async (req, res) => {
  try {
   const {
  title,
  subject,
  dueDate,
  priority,
  aiOverview,
  milestones,
} = req.body;

    if (!title || !subject || !dueDate) {
      return res.status(400).json({
        message: "Title, subject and due date are required",
      });
    }

const assignment = await Assignment.create({
  title,
  subject,
  dueDate,
  priority: priority || "Medium",
  aiOverview: aiOverview || "",
  milestones: Array.isArray(milestones) ? milestones : [],
});
    res.status(201).json({
      message: "Assignment created successfully",
      assignment,
    });
  } catch (error) {
    console.error("Create assignment error:", error);

    res.status(500).json({
      message: "Failed to create assignment",
    });
  }
};

// Get all assignments
const getAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find().sort({
      dueDate: 1,
      createdAt: -1,
    });

    res.status(200).json(assignments);
  } catch (error) {
    console.error("Get assignments error:", error);

    res.status(500).json({
      message: "Failed to fetch assignments",
    });
  }
};

// Update assignment
const updateAssignment = async (req, res) => {
  try {
    const { id } = req.params;

    const assignment = await Assignment.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!assignment) {
      return res.status(404).json({
        message: "Assignment not found",
      });
    }

    res.status(200).json({
      message: "Assignment updated successfully",
      assignment,
    });
  } catch (error) {
    console.error("Update assignment error:", error);

    res.status(500).json({
      message: "Failed to update assignment",
    });
  }
};

// Delete assignment
const deleteAssignment = async (req, res) => {
  try {
    const { id } = req.params;

    const assignment = await Assignment.findByIdAndDelete(id);

    if (!assignment) {
      return res.status(404).json({
        message: "Assignment not found",
      });
    }

    res.status(200).json({
      message: "Assignment deleted successfully",
    });
  } catch (error) {
    console.error("Delete assignment error:", error);

    res.status(500).json({
      message: "Failed to delete assignment",
    });
  }
};

// Toggle complete/pending
const toggleAssignmentStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const assignment = await Assignment.findById(id);

    if (!assignment) {
      return res.status(404).json({
        message: "Assignment not found",
      });
    }

    assignment.status =
      assignment.status === "Completed"
        ? "Pending"
        : "Completed";

    await assignment.save();

    res.status(200).json({
      message: "Assignment status updated",
      assignment,
    });
  } catch (error) {
    console.error("Toggle status error:", error);

    res.status(500).json({
      message: "Failed to update assignment status",
    });
  }
};
const toggleMilestoneStatus = async (req, res) => {
  try {
    const { assignmentId, milestoneId } = req.params;

    const assignment = await Assignment.findById(assignmentId);

    if (!assignment) {
      return res.status(404).json({
        message: "Assignment not found",
      });
    }

    const milestone = assignment.milestones.id(milestoneId);

    if (!milestone) {
      return res.status(404).json({
        message: "Milestone not found",
      });
    }

    milestone.completed = !milestone.completed;

const allMilestonesCompleted =
  assignment.milestones.length > 0 &&
  assignment.milestones.every(
    (item) => item.completed
  );

assignment.status = allMilestonesCompleted
  ? "Completed"
  : "Pending";

await assignment.save();

    res.status(200).json({
      message: "Milestone status updated",
      assignment,
    });
  } catch (error) {
    console.error("Toggle milestone error:", error);

    res.status(500).json({
      message: "Failed to update milestone",
    });
  }
};

module.exports = {
  createAssignment,
  getAssignments,
  updateAssignment,
  deleteAssignment,
  toggleAssignmentStatus,
  toggleMilestoneStatus,
};