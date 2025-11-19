import bodyParser from "body-parser";
import express from "express";
import admin from "firebase-admin";
import * as serviceAccount from "./serviceAccountKey.json";
// Initialiser Firebase Admin SDK
const serviceAccount = serviceAccount;

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post("/check-token", async (req, res) => {
  const token = req.body.token;

  if (!token) {
    return res.status(400).send({ error: "Token is required" });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    res.status(200).send({ valid: true, decodedToken });
  } catch (error) {
    res.status(401).send({ valid: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
