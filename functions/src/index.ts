import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions'
import { isNullOrUndefined } from 'util';

admin.initializeApp(functions.config().firebase);


const firestoreInstance = admin.firestore();

async function getUserPrivateData(userId: string): Promise<FirebaseFirestore.DocumentSnapshot> {
      return await firestoreInstance.collection('users').doc(userId).get()
}

async function getUserAnswers(userId: string): Promise<any> {
      const userAnswers = await firestoreInstance.collection('answers').doc(userId).get();
      return userAnswers.data();
}

async function isLikedAlready(user: string, person: string): Promise<boolean> {
      const likeKey = [user, person].sort().join('-');
      const doc = await firestoreInstance.collection('likes').doc(likeKey).get();
      return doc.exists;
}

async function getAllPersonsScores(): Promise<any[]>  {
      const usersAnswers = await firestoreInstance.collection('answers').get();
      return usersAnswers.docs;
}

async function sendNotification(usersData: any[], notificationMessage) {
      let awaits = [];
      usersData.forEach(user => {
            if (!isNullOrUndefined(user) && !isNullOrUndefined(user.fcmtoken)) {
                  var message = {
                        data: {
                              text: notificationMessage
                        },
                        token: user.fcmtoken
                  };
                  awaits.push(admin.messaging().send(message));
            }
      })
      await Promise.all(awaits);
}

async function isMatch(change) {
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
                  await sendNotification(usersData, "Ai o potrivire noua!");
      } else {
            return;
      }
}

async function getSuggestions(user, suggestionsCount) {
      let userAnswers = await getUserAnswers(user);
      let allPersons = await getAllPersonsScores();
      allPersons.forEach(person => {
            if (isLikedAlready(user, person.id)) {
                  console.log(person.id + " already liked by " + user);
            } else {
                  console.log(person.id + " is good for " + user);
            }
      });
}

async function sendNewMessageNotification(convId, messageId) {
      const message = await firestoreInstance.collection('tinder').doc('messages').collection(convId).doc(messageId).get();
      const participants = convId.split('-');
      const otherPerson = participants[0] == message.data().sender ? participants[1] : participants[0];
      const senderPersonData = await getUserPrivateData(message.data().sender);      
      const otherPersonData = await getUserPrivateData(otherPerson);
      await sendNotification([otherPersonData.data()], senderPersonData.data().displayName + ' ti-a trimis un mesaj!');
}

export const personLiked = functions.firestore.document('/likes/{likes}').onWrite((change, context) => {
      return isMatch(change);
});

export const messageReceived = functions.firestore.document('/tinder/messages/{convId}/{messageId}').onWrite((change, context) => {
      return sendNewMessageNotification(context.params.convId, context.params.messageId)
});

export const findNewPersons = functions.https.onRequest((req, res) => {
      let user = req.query.user;
      return getSuggestions(user, 50);
});