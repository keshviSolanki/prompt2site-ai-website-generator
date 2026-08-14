export const getCurrent = async (req, res) => {
  try {
    // console.log("userController.js req.user =", req.user);
    if (!req.user) {
      return res.status(400).json({
        message: "No user found in request",
      });
    }
    return res.status(200).json(req.user);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "get current user error", error });
  }
};
