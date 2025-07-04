import express from "express";
import "dotenv/config";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import "./src/db/dbConnection.js";
import productRouter from "./src/routes/productRouter.js";
import userRouter from "./src/routes/userRouter.js";
import cookieParser from "cookie-parser";
import verifyToken from "./src/middleware/protected/verifyToken.js";
import reviewRoutes from "./src/routes/reviewRouters.js";
import wishlistRouter from "./src/routes/wishlistRouter.js";


const port = process.env.PORT || 5001;
const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Frontend URL-i
    methods: ["GET", "POST"],
  },
});

//middleware
app.use(express.urlencoded({ extended: true }));

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true, 
  })
);
app.use(cookieParser());

//routes
app.use("/api/products", productRouter);
app.use("/auth", userRouter);
app.use("/api/user", userRouter);
app.use("/api/users", userRouter);
app.use("/images", express.static("src/images"));
app.use("/api/reviews", reviewRoutes);
app.use("/api/wishlist", wishlistRouter);
io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("sendMessage", (data) => {
    console.log(`New message from ${data.senderId}: ${data.content}`);

    io.emit("receiveMessage", {
      senderId: data.senderId,
      senderUsername: data.senderUsername, 
      content: data.content,
      timestamp: new Date().toISOString(),
    });
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

app.get("/", (req, res) => {
  res.send("Hello World");
});

const PORT = 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
