import express from "express";
import admin from "firebase-admin";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

// Load from ENV
const serviceAccount = JSON.parse(process.env.FIREBASE_KEY);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Test route
app.get("/", (req, res) => {
  res.send("Server running");
});

// Send notification
app.post("/send", async (req, res) => {
  const { token, title, body } = req.body;

  try {
    await admin.messaging().send({
      token,
      notification: { title, body }
    });

    res.send("Notification sent");
  } catch (err) {
  console.error("FCM ERROR FULL:", err);
  res.status(500).send(err.message);
}
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server started on", PORT));
