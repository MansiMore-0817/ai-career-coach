import Progress from "../models/Progress.model.js";

export const toggleProgress = async (req, res) => {
  try {
    const { roadmapId, stepOrder } = req.body;
    const userId = req.user.userId;

    let progress = await Progress.findOne({
      user: userId,
      roadmap: roadmapId,
    });

    if (!progress) {
      progress = await Progress.create({
        user: userId,
        roadmap: roadmapId,
        completedSteps: [],
      });
    }

    if (progress.completedSteps.includes(stepOrder)) {
      progress.completedSteps.pull(stepOrder);
    } else {
      progress.completedSteps.push(stepOrder);
    }

    await progress.save();
    res.json(progress);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to toggle progress", error: error.message });
  }
};
