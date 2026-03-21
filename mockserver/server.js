import express from "express";
import cors from "cors";
import userRoutes from "./routes/UserRoutes.js";
import cartRoutes from "./routes/CartRoutes.js";
import scannerRoutes from "./routes/ScannerRoutes.js";
import retailerRoutes from "./routes/RetailerRoutes.js";
import multer from "multer";


const app = express();
const PORT = 3000;

app.use(express.json()); // parse JSON body
app.use(cors());

app.use("/mockserver/users", userRoutes);
app.use("/mockserver/cart", cartRoutes);
app.use("/mockserver/scanner", scannerRoutes);
app.use("/mockserver", retailerRoutes);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
