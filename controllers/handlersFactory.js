const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const AppError = require("../utils/appError");
const ApiFeatures = require("../utils/apiFeatures");

exports.getAll = (Model) =>
  asyncHandler(async (req, res) => {
    let filter = {};
    if (req.filter) {
      filter = req.filter;
    }
    const documentCounts = await Model.countDocuments();
    const features = new ApiFeatures(Model.find(filter), req.query)
      .paginate(documentCounts)
      .filter()
      .sort()
      .limitFields()
      .search();
    // .populate({ path: "category", select: "name -_id" });

    const { query, paginateResult } = features;
    // Execute Query
    const documents = await query;
    res.status(200).json({
      status: "success",
      results: documents.length,
      paginateResult,
      data: documents,
    });
  });

exports.getOne = (Model, populateOpt) =>
  asyncHandler(async (req, res, next) => {
    const id = req.params.id;

    let query = Model.findById(id);
    if (populateOpt) query = query.populate(populateOpt);

    const document = await query;
    if (!document) {
      return next(new AppError(`No document found with this ID: ${id}`, 404));
    }
    res.status(200).json({
      status: "success",
      data: document,
    });
  });

exports.createOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    if (!req.body.user && req.user) {
      req.body.user = req.user._id;
    }
    req.body.slug = slugify(req.body.name || req.body.title);
    const document = await Model.create(req.body);

    res.status(201).json({
      status: "success",
      data: document,
    });
  });

exports.updateOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const fieldValue = req.body.name || req.body.title;
    if (req.body && fieldValue) {
      req.body.slug = slugify(fieldValue);
    }
    const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!document) {
      return next(
        new AppError(`No document found with this ID: ${req.params.id}`, 404)
      );
    }
    res.status(200).json({
      status: "success",
      data: document,
    });
  });

exports.deleteOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const document = await Model.findByIdAndDelete(id);
    if (!document) {
      return next(new AppError(`No category found with this ID: ${id}`, 404));
    }
    res.status(204).json({
      status: "success",
      data: null,
    });
  });
