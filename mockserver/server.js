import express from "express";
import cors from "cors";
import userRoutes from "./UserRoutes.js"; // default export

const app = express();
const PORT = 3000;

app.use(express.json()); // parse JSON body
app.use(cors());

app.use("/mockServer/users", userRoutes);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
