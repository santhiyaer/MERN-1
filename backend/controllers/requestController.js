import Request from "../models/RequestModel.js";

// Send a new request
export const sendRequest = async (req, res) => {
  try {
    const newRequest = new Request({
      sender: req.user.id,
      receiver: req.body.receiver,
      message: req.body.message,
    });
    await newRequest.save();
    res.status(201).json(newRequest);
  } catch (err) {
    res.status(500).json({ message: "Error sending request", error: err });
  }
};

// Get all requests related to the logged-in user
export const getRequests = async (req, res) => {
  try {
    const requests = await Request.find({
      $or: [{ sender: req.user.id }, { receiver: req.user.id }],
    })
      .populate("sender", "username email")
      .populate("receiver", "username email");
    res.status(200).json(requests);
  } catch (err) {
    res.status(500).json({ message: "Error fetching requests", error: err });
  }
};

// Update request status (accept / reject)
export const updateRequest = async (req, res) => {
  try {
    const updated = await Request.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: "Error updating request", error: err });
  }
};

// Delete a request
export const deleteRequest = async (req, res) => {
  try {
    await Request.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Request deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting request", error: err });
  }
};
