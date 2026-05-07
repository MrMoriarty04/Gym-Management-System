const Session = require("../models/Session");

const getSessions = async (req, res) => {
  try {
    const traineeId = req.user._id; 
    
    const sessions = await Session.find({ traineeId })
      .populate("coachId", "name email");
      
    res.status(200).json(sessions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const bookSession = async (req, res) => {
  try {
    const traineeId = req.user._id;
    const { coachId, date, startTime, endTime, location } = req.body;

    const session = new Session({
      traineeId,
      coachId,
      date,
      startTime,
      endTime,
      location
    });

    await session.save();
    res.status(201).json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateSession = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const session = await Session.findByIdAndUpdate(id, updates, { new: true });
    res.status(200).json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteSession = async (req, res) => {
  try {
    const { id } = req.params;

    await Session.findByIdAndDelete(id);
    res.status(200).json({ message: "Session deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getSessions, bookSession, updateSession, deleteSession };