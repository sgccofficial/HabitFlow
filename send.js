const admin = require("firebase-admin");

const serviceAccount = require("./serviceAccount.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

console.log("Worker started...");

setInterval(async () => {

  const now = Date.now();

  const snapshot = await db.collection("timers")
    .where("sent", "==", false)
    .get();

  for(const doc of snapshot.docs){

    const data = doc.data();

    if(now >= data.endTime){

      try{

        await admin.messaging().send({

          token: data.token,

          data: {
          title: "Timer Done ⏰",
          body: `${data.task} should be completed by now 😉`
          }

        });

        console.log("Sent:", data.task);

        await doc.ref.update({
          sent: true
        });

      }catch(err){

        console.error("Error:", err);

      }
    }
  }

}, 5000);
