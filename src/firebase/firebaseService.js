import firebase from './firebaseConfig';

const getStories = async (filter) => {
  let stories = [];
  let query = firebase.firestore().collection('stories');

  // Apply filter
  if (filter !== 'all') {
    query = query.where('source', '==', filter);
  }

  const snapshot = await query.get();

  snapshot.forEach(doc => {
    stories.push({ id: doc.id, ...doc.data() });
  });

  return stories;
};

const getStoriesByIds = async (ids) => {
  // Early return if ids array is empty
  if (ids.length === 0) return [];

  let stories = [];
  const query = firebase.firestore().collection('stories').where(firebase.firestore.FieldPath.documentId(), 'in', ids);

  const snapshot = await query.get();

  snapshot.forEach(doc => {
    stories.push({ id: doc.id, ...doc.data() });
  });

  return stories;
};

export { getStories, getStoriesByIds };
