import "dotenv/config";
import connectDB from "./src/config/db.js";
import app from "./src/app.js";

connectDB();

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
