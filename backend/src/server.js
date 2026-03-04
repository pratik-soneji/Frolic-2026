import dotenv from "dotenv";
dotenv.config();
import {app} from "./app.js";
import { connectDB } from "./db/db.js";



const PORT = process.env.PORT || 5000;

// Start Server
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch(err => console.log('Mongo connection error:', err));
