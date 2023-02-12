const Job = require("../models/Job");
const {StatusCodes} = require("http-status-codes");
const {BadRequestError, CustomError} = require("../error");



const createJob = async (req, res, next) => {
    // console.log(req.user);
    req.body.createdBy = req.user.userId;
    const job = await Job.create(req.body);
    res.status(StatusCodes.CREATED).json(job);
}

const getAll = async (req, res, next) => {
    const jobs = await Job.find({createdBy: req.user.userId}).sort("createdAt");
    res.status(StatusCodes.OK).json(jobs);
}

const getOne = async (req, res, next) => {
    // destructring object user (from req) asigned to value after :, which meand {userId} = user
    // simialarly params => {id:jobId} = {id,...} , so id = id and then id => jobId
    const {user:{userId}, params:{id:jobId}} = req;
    const job = await Job.find({_id:jobId, createdBy:userId});
    if(!job || job.length === 0){
        throw new CustomError(`no job with id ${jobId}`, StatusCodes.NOT_FOUND);
    }
    res.status(StatusCodes.OK).json(job);
}

const updateJob = async (req, res, next) => {
    const {
        body: { company, position },
        user: { userId },
        params: { id: jobId },
      } = req;
    
      if (company === '' || position === '') {
        throw new BadRequestError('Company or Position fields cannot be empty');
      }
      const job = await Job.findByIdAndUpdate(
        { _id: jobId, createdBy: userId },
        req.body,
        { new: true, runValidators: true }
      );
      if (!job) {
        throw new NotFoundError(`No job with id ${jobId}`);
      }
      res.status(StatusCodes.OK).json({ job });
}

const deleteJob = async (req, res, next) => {
    const {
        user: { userId },
        params: { id: jobId },
      } = req ;
    
      const job = await Job.findByIdAndRemove({
        _id: jobId,
        createdBy: userId,
      });
      if (!job) {
        throw new NotFoundError(`No job with id ${jobId}`);
      }
      res.status(StatusCodes.OK).json({msg: "Job deleted"});
}

module.exports = {createJob, getAll, getOne, updateJob, deleteJob};