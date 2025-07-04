// import jwt from "jsonwebtoken";
// import user from "../../models/userModel.js";

// export const protect = async (req, res, next) => {
//     const token = req.cookies.token || (req.headers.authorization && req.headers.authorization.split(" ")[1]);

//   if (!token) {
//     return res.status(401).json({ success: false, message: "Not authorized, no token" });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
//     // `isAdmin`-in də gəldiyindən əmin olmaq üçün `select("-password isAdmin")`
//     req.User = await user.findById(decoded.id).select("-password isAdmin");

//     if (!req.User) {
//       return res.status(401).json({ success: false, message: "User not found" });
//     }

//     next();
//   } catch (error) {
//     res.status(401).json({ success: false, message: "Not authorized, token failed" });
//   }
// };
