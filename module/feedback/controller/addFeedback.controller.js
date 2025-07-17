export const addFeedback = async (req, res) => {
  try {
    const {
      reportId,
      userComment,
      flaggedSection,
      suggestedImprovements,
      confidenceScoreImpact,
    } = req.body;

    const feedback = new Report({
      reportId,
      userId: req.user._id,
      userComment,
      flaggedSection,
      suggestedImprovements,
      confidenceScoreImpact,
    });

    await feedback.save();
    return res
      .status(201)
      .json({ message: "Feedback created", success: true, data: feedback });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error creating feedback",
      error: error.message,
    });
  }
};
