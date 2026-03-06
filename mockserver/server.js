import express from "express";
import cors from "cors";
import userRoutes from "./routes/UserRoutes.js";
import cartRoutes from "./routes/CartRoutes.js";
import scannerRoutes from "./routes/ScannerRoutes.js";

const app = express();
const PORT = 3000;

app.use(express.json()); // parse JSON body
app.use(cors());

app.use("/mockServer/users", userRoutes);
app.use("/mockserver/cart", cartRoutes);
app.use("/mockserver/scanner", scannerRoutes);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
