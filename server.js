const express = require("express");
const admin = require("firebase-admin");

const app = express();
app.use(express.json());

// 🔑 Your Firebase service key (we'll add next)
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// 🔔 Send notification
app.post("/send", async (req, res) => {
  const { token, title, body } = req.body;

  try {
    await admin.messaging().send({
      token: token,
      notification: {
        title: title,
        body: body
      }
    });

    res.send("Notification sent");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error sending notification");
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));
