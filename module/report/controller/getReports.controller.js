import Source from "../../source/source.model.js";
import Report from "../report.model.js";

export const getReports = async (req, res) => {
  try {
    const { reportType, industry, confidenceScore, search } = req.query;

    let query = {};

    if (reportType) query.reportType = reportType;
    if (industry) query.industry = industry;
    if (confidenceScore) query.confidenceScore = { $gte: confidenceScore };
    if (search) query.$text = { $search: search };

    // Advanced filtering (gt, gte, lt, lte)
    let queryStr = JSON.stringify(req.query);
    queryStr = queryStr.replace(
      /\b(gt|gte|lt|lte|in)\b/g,
      (match) => `$${match}`
    );

    const reports = await Report.find(JSON.parse(queryStr))
      .populate("sources")
      .populate("createdBy", "firstName lastName");

    return res.status(200).json({
      message: "Report retrived successfully",
      success: true,
      totalRecords: reports.length,
      data: reports,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error retriving report",
      error: error.message,
    });
  }
};

export const getReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id)
      .populate({
        path: "sources",
        select: "name type reliabilityScore description url date",
      })
      .populate("createdBy", "firstName lastName");

    if (!report) {
      return res.status(404).json({
        success: false,
        message: `Report not found with id of ${req.params.id}`,
        error: "",
      });
    }

    return res.status(200).json({
      message: "Report retrived successfully",
      success: true,
      data: report,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error retriving report",
      error: error.message,
    });
  }
};
