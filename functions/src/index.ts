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

async function addLikes(): Promise<any> {
      const users = await firestoreInstance.collection('users').get();
      const noLikesUsers = users.docs.filter(user => user.data().likesCount == 0);

      let awaits = [];
      awaits.push(sendNotification(noLikesUsers, "Poti sa dai din nou like-uri!"));
      users.forEach(user => {
            awaits.push(firestoreInstance.collection('users').doc(user.id).set({likesCount: user.data().likesCount + 5}, {merge: true}));
      });
       
      await Promise.all(awaits);
}

async function isLikedAlready(user: string, person: string): Promise<boolean> {
      const likeKey = [user, person].sort().join('-');
      const doc = await firestoreInstance.collection('likes').doc(likeKey).get();
      console.log(doc.data);
      return doc.exists;
}

async function getAllPersonsScores(): Promise<any[]>  {
      const usersAnswers = await firestoreInstance.collection('answers').get();
      return usersAnswers.docs;
}

async function getUserMatches(userId: string): Promise<any[]>  {
      const usersAnswers = await firestoreInstance.collection('tinder').doc('matches').collection(userId).get();
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
async function getSuggestions() {
      let allPersons = await getAllPersonsScores();
      let i: number = 0;
      const awaits = [];
      for (i = 0; i < allPersons.length; i++) {
            const person = allPersons[i];
            let suggestions;
            if (person.data().score > 1000000) {
                  suggestions = allPersons.filter(pers => pers.data() !== person.data() && pers.data().score < 1000000).map(pers => pers.data().id);
            } else {
                  suggestions = allPersons.filter(pers => pers.data() !== person.data() && pers.data().score > 1000000).map(pers => pers.data().id);                  
            }

            const matches = await getUserMatches(person.data().id);
            let j = 0;
            for (j = 0; j < matches.length; j++) {
                  if (suggestions.indexOf(matches[j].data().id) > 0)
                        suggestions.splice(suggestions.indexOf(matches[j].data().id), 1);
            }
            suggestions.forEach(suggestion => awaits.push(firestoreInstance.collection('tinder').doc('persons').collection(person.data().id()).doc(suggestion).set({s: true}, {merge: true})));
      }
      await Promise.all(awaits);
}

async function sendNewMessageNotification(convId, messageId) {
      const message = await firestoreInstance.collection('tinder').doc('messages').collection(convId).doc(messageId).get();
      const messageData = message.data();
      const participants = convId.split('-');
      const otherPerson = participants[0] === messageData.sender ? participants[1] : participants[0];
      const senderPersonData = await getUserPrivateData(messageData.sender);      
      const otherPersonData = await getUserPrivateData(otherPerson);
      await sendNotification([otherPersonData.data()], senderPersonData.data().displayName + ' ti-a trimis un mesaj!');

      const convUpdates = [
            firestoreInstance.collection('users').doc(otherPerson).collection('conversations').doc(convId).set({
                  lastMessage: messageData.message,
                  lastMessageTime: messageData.timestamp,
                  otherPersonId: messageData.sender
            }),
            firestoreInstance.collection('users').doc(messageData.sender).collection('conversations').doc(convId).set({
                  lastMessage: messageData.message,
                  lastMessageTime: messageData.timestamp,
                  otherPersonId: otherPerson
            })
      ];

      await Promise.all(convUpdates);
}

export const personLiked = functions.firestore.document('/likes/{likes}').onWrite((change, context) => {
      return isMatch(change);
});

export const messageReceived = functions.firestore.document('/tinder/messages/{convId}/{messageId}').onWrite((change, context) => {
      return sendNewMessageNotification(context.params.convId, context.params.messageId)
});

export const findNewPersons = functions.https.onRequest((req, res) => {
      let user = req.query.user;
      res.status(200);    
      getSuggestions().then(a => res.status(200)).catch(b => res.status(400));
});

export const addLikesEvent = functions.https.onRequest((req, res) => {
      let key = req.query.key;
      res.status(200);
      addLikes().then(a => res.status(200)).catch(b => res.status(400));
});