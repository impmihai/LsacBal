import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions'
import { isNullOrUndefined } from 'util';

admin.initializeApp(functions.config().firebase);


export const firestoreInstance = admin.firestore();

async function getUserPrivateData(userId: string): Promise<FirebaseFirestore.DocumentSnapshot> {
      return await firestoreInstance.collection('users').doc(userId).get()
}

async function getUserAnswers(userId: string): Promise<any> {
      const userAnswers = await firestoreInstance.collection('answers').doc(userId).get();
      return userAnswers.data();
}

export async function isLikedAlready(user: string, person: string): Promise<boolean> {
      const likeKey = [user, person].sort().join('-');
      const doc = await firestoreInstance.collection('likes').doc(likeKey).get();
      return doc.exists;
}

export async function getAllPersonsScores(): Promise<any[]>  {
      const usersAnswers = await firestoreInstance.collection('answers').get();
      return usersAnswers.docs;
}



export async function isMatch(change) {
      if (!change.after.exists) return;

      const id = change.after.id;
      const newValue = change.after.data();
      const persons = id.split('-');
      if (!isNullOrUndefined(newValue[persons[0]]) && newValue[persons[0]] === true &&
            !isNullOrUndefined(newValue[persons[1]]) && newValue[persons[1]] === true) {
                  var doc = firestoreInstance.collection('tinder').doc('matches');
                  var a = doc.collection(persons[0]).doc(persons[1]).set({});
                  var b = doc.collection(persons[1]).doc(persons[0]).set({});
                  await Promise.all([a, b]);
                  
                  const usersData = [await getUserPrivateData(persons[0]), await getUserPrivateData(persons[1])];
                  let awaits = [];
                  usersData.forEach(user => {
                        if (!isNullOrUndefined(user) && !isNullOrUndefined(user.data().fcmtoken)) {
                              var message = {
                                    data: {
                                    score: '850',
                                    time: '2:45'
                                    },
                                    token: user.data().fcmtoken
                              };
                              awaits.push(admin.messaging().send(message));
                        }
                  })
                  await Promise.all(awaits);
      } else {
            return;
      }
}

export const personLiked = functions.firestore.document('/likes/{likes}').onWrite((change, context) => {
      return isMatch(change);
});

async function getSuggestions(user, suggestionsCount) {
      let userAnswers = await getUserAnswers(user);
      let allPersons = await getAllPersonsScores();
}

export const findNewPersons = functions.https.onRequest((req, res) => {
      let user = req.query.user;
      return getSuggestions(user, 50);
});