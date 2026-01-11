import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    roomId: { type: String, required: true }, //freelancerid and clientid
    text: { type: String, required: true },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "senderRole",
      required: true,
    },
    senderRole: {
      type: String,
      enum: ["Client", "Freelancer"],
      required: true,
    },
  },
  { timestamps: true }
);

 const Message = mongoose.models.Message || mongoose.model("Message", messageSchema);
export default Message;



