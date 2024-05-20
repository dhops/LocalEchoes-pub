const admin = require('firebase-admin');

// Replace with the path to your Firebase Admin SDK JSON file
const serviceAccount = require('../../private/localechoes-firebase-adminsdk-qebyo-d31c39dbf6.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const addFieldToAllDocuments = async () => {
  const collectionRef = db.collection('stories'); // Replace 'stories' with your collection name
  const newField = { precise: false }; // Replace with your new field and its default value

  const snapshot = await collectionRef.get();

  const batch = db.batch();

  snapshot.forEach(doc => {
    const docRef = collectionRef.doc(doc.id);
    batch.update(docRef, newField);
  });

  await batch.commit();
  console.log('All documents have been updated');
};

addFieldToAllDocuments().catch(console.error);
