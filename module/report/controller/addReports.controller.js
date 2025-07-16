import Report from "../report.model.js";

export const addReports = async (req, res) => {
  try {
    const { title, summary, confidenceScore, industry, reportType, sources } =
      req.body;

    const report = new Report({
      title,
      summary,
      confidenceScore,
      industry,
      reportType,
      sources,
      createdBy: req.user._id,
    });

    await report.save();
    return res
      .status(201)
      .json({ message: "Report created", success: true, data: report });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error creating report",
      error: error.message,
    });
  }
};
