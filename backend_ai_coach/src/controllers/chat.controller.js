import ActiveMentorship from "../models/ActiveMentorship.model.js";
import ChatMessage from "../models/ChatMessage.model.js";

export const sendMessage = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { mentorshipId } = req.params;
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }

    const mentorship = await ActiveMentorship.findById(mentorshipId);

    if (!mentorship || mentorship.status !== "active") {
      return res.status(404).json({ message: "Mentorship not active" });
    }

    // only student or mentor can send
    if (
      mentorship.student.toString() !== userId &&
      mentorship.mentor.toString() !== userId
    ) {
      return res.status(403).json({ message: "Not allowed" });
    }

    const chat = await ChatMessage.create({
      mentorship: mentorshipId,
      sender: userId,
      message
    });

    res.status(201).json(chat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Get chat messages for a mentorship
export const getMessages = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { mentorshipId } = req.params;

    const mentorship = await ActiveMentorship.findById(mentorshipId);

    if (!mentorship) {
      return res.status(404).json({ message: "Mentorship not found" });
    }

    if (
      mentorship.student.toString() !== userId &&
      mentorship.mentor.toString() !== userId
    ) {
      return res.status(403).json({ message: "Not allowed" });
    }

    const messages = await ChatMessage.find({
      mentorship: mentorshipId
    })
      .populate("sender", "name role")
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
