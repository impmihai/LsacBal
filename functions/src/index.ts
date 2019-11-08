import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions'
import { isNullOrUndefined } from 'util';
import { resolve } from 'path';

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
            awaits.push(firestoreInstance.collection('users').doc(user.id).set({likesCount: user.data().likesCount + 3}, {merge: true}));
      });
       
      await Promise.all(awaits);
}

async function isLikedAlready(user: string, person: string): Promise<boolean> {
      const likeKey = [user, person].sort().join('-');
      const doc = await firestoreInstance.collection('likes').doc(likeKey).get();
      console.log(doc.data);
      return doc.exists;
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
      let allPersons = await firestoreInstance.collection('answers').get();
      let i: number = 0;
      const awaits = [];
      for (i = 0; i < allPersons.docs.length; i++) {
            const person = allPersons.docs[i];
            let suggestions;

            if (person.data().score > 1000000) {
                  suggestions = allPersons.docs.filter(pers => pers.id != person.id && pers.data().score < 1000000);
            } else {
                  suggestions = allPersons.docs.filter(pers => pers.id != person.id && pers.data().score > 1000000);                  
            }

            const matches = await firestoreInstance.collection('tinder').doc('matches').collection(person.id).get();
            const matchesIds = matches.docs.map(match => match.id);

            const persons = await firestoreInstance.collection('tinder').doc('persons').collection(person.id).get();
            const personsIds = persons.docs.map(pers => pers.id);

            suggestions = suggestions.filter(sugestie => matchesIds.indexOf(sugestie.id) < 0 && personsIds.indexOf(sugestie.id) < 0);
            
            suggestions.sort((p1,p2) => {
                  if (Math.abs(p1.score - person.data().score) > Math.abs(p2.score - person.data().score)) {
                      return 1;
                  }
              
                  if (Math.abs(p1.score - person.data().score) < Math.abs(p2.score - person.data().score)) {
                      return -1;
                  }
              
                  return 0;
              })

            let timest = admin.firestore.FieldValue.serverTimestamp()
            suggestions.forEach(suggestion => awaits.push(firestoreInstance.collection('tinder').doc('persons').collection(person.id).doc(suggestion.id).set({timestamp: timest}, { merge: true})));
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

      const matchUpdate = [
            firestoreInstance.collection('tinder').doc('matches').collection(otherPerson).doc(messageData.sender).set({
                  show: false
            }),
            firestoreInstance.collection('tinder').doc('matches').collection(messageData.sender).doc(otherPerson).set({
                  show: false
            }),
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
      getSuggestions().then(a => res.status(200).send('done!')).catch(b => res.status(400).send(b));
});

export const newPersonJoined = functions.firestore.document('/answers/{userId}').onWrite((change, context) => {
      return getSuggestions();
});

export const addLikesEvent = functions.https.onRequest((req, res) => {
      let key = req.query.key;
      res.status(200);
      addLikes().then(a => res.status(200).send('done!')).catch(b => res.status(400));
});