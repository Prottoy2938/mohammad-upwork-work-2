const functions = require("firebase-functions");
const admin = require("firebase-admin");

const privateKey = "";
const clientEmail = "";
const projectId = "";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId,
      clientEmail,
      privateKey: privateKey.replace(/\\n/g, "\n"),
    }),
    databaseURL: `https://${projectId}.firebaseio.com`,
  });
}

exports.newCloudFunction2 = functions
  .region("us-central1")
  .https.onRequest(async (req, res) => {
    const stripe = require("stripe")(functions.config().stripe.secret_key);
    const firestore = admin.firestore(); // Initialize Firestore

    let event;

    try {
      const whSec = functions.config().stripe.webhook_secret;

      event = stripe.webhooks.constructEvent(
        req.rawBody,
        req.headers["stripe-signature"],
        whSec
      );
    } catch (err) {
      console.error("⚠️ Webhook signature verification failed.", err);
      return res
        .status(400)
        .send("Webhook Error: Signature Verification Failed");
    }

    const dataObject = event.data.object;
    const querySnapshot = await firestore
      .collection("customers")
      .where("customer_email", "==", dataObject.email)
      .limit(1)
      .get();

    // Check if any document is found
    if (querySnapshot.empty) {
      return res.status(404).send("No matching documents found.");
    }

    // Update the first document found
    const doc = querySnapshot.docs[0];
    // Get customer_uid from the document data
    const customerData = doc.data();
    const customerUid = customerData.customer_uid;

    const querySnapshot1 = await firestore
      .collection("customer_subscriptions")
      .where("customer_id", "==", customerUid)
      .limit(1)
      .get();

    // Check if any document is found
    if (querySnapshot1.empty) {
      return res.status(404).send("No matching documents found.");
    }
    const doc1 = querySnapshot.docs[0];

    await doc1.ref.update({
      subscribtion_status: true,
      payment_status: true,
    });
    customer_email;
    // Process dataObject as needed

    return res.sendStatus(200);
  });
