import { VideoList } from "../model/video-list.js";
import { User } from './../model/user-details.js';


export const getAllVideosController = async (req, res) => {
  // const userId = req.query.userId;
  
  // if (!userId) {
  //   return res.status(400).json({ error: "Missing userId" });
  // }

  try {
    // let user = await User.findOne({ userId });

    // if (!user) {
    //   user = new User({ userId });
    //   await user.save();
    // }

    const videos = await VideoList.find({});
    res.status(200).json({ videos
      // ,user
     });
  } catch (error) {
    console.error("Error fetching videos or handling user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
