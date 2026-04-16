import express from "express";
import admin from "firebase-admin";

const app = express();
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST");
  next();
});
app.use(express.json());

// Load from ENV (not file)
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
      notification: {
        title,
        body
      }
    });

    res.send("Notification sent");
  } catch (err) {
    console.log(err);
    res.status(500).send("Error");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server started"));
