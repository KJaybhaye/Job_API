const {createJob, getAll, getOne, updateJob, deleteJob} = require("../controllers/jobs");
const express = require("express");

const router = express.Router();

router.route("/").get(getAll).post(createJob);
router.route("/:id").get(getOne).patch(updateJob).delete(deleteJob);

module.exports = router;