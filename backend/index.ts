import {config} from "dotenv";
config();

import app from "./app.js";
import connectDB from "./config/db.js";

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
  }
})();
