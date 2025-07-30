// backend/server.js

import app from "./app.js";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Serveur backend lancé sur http://0.0.0.0:${PORT}`);
});

