const express = require("express");
const router = express.Router();

const {
  generateCareerPlan,
} = require("../controllers/careerMentorController");

router.post("/generate", generateCareerPlan);

module.exports = router;