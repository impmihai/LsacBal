"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const admin = require("firebase-admin");
const functions = require("firebase-functions");
const util_1 = require("util");
admin.initializeApp(functions.config().firebase);
const firestoreInstance = admin.firestore();
function getUserPrivateData(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield firestoreInstance.collection('users').doc(userId).get();
    });
}
function getUserAnswers(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const userAnswers = yield firestoreInstance.collection('answers').doc(userId).get();
        return userAnswers.data();
    });
}
function isLikedAlready(user, person) {
    return __awaiter(this, void 0, void 0, function* () {
        const likeKey = [user, person].sort().join('-');
        const doc = yield firestoreInstance.collection('likes').doc(likeKey).get();
        return doc.exists;
    });
}
function getAllPersonsScores() {
    return __awaiter(this, void 0, void 0, function* () {
        const usersAnswers = yield firestoreInstance.collection('answers').get();
        return usersAnswers.docs;
    });
}
function sendNotification(usersData, notificationMessage) {
    return __awaiter(this, void 0, void 0, function* () {
        let awaits = [];
        usersData.forEach(user => {
            if (!util_1.isNullOrUndefined(user) && !util_1.isNullOrUndefined(user.fcmtoken)) {
                var message = {
                    data: {
                        text: notificationMessage
                    },
                    token: user.fcmtoken
                };
                awaits.push(admin.messaging().send(message));
            }
        });
        yield Promise.all(awaits);
    });
}
function isMatch(change) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!change.after.exists)
            return;
        const id = change.after.id;
        const newValue = change.after.data();
        const persons = id.split('-');
        if (!util_1.isNullOrUndefined(newValue[persons[0]]) && newValue[persons[0]] === true &&
            !util_1.isNullOrUndefined(newValue[persons[1]]) && newValue[persons[1]] === true) {
            var doc = firestoreInstance.collection('tinder').doc('matches');
            var a = doc.collection(persons[0]).doc(persons[1]).set({});
            var b = doc.collection(persons[1]).doc(persons[0]).set({});
            yield Promise.all([a, b]);
            const usersData = [yield getUserPrivateData(persons[0]), yield getUserPrivateData(persons[1])];
            yield sendNotification(usersData, "Ai o potrivire noua!");
        }
        else {
            return;
        }
    });
}
function getSuggestions(user, suggestionsCount) {
    return __awaiter(this, void 0, void 0, function* () {
        let userAnswers = yield getUserAnswers(user);
        let allPersons = yield getAllPersonsScores();
        allPersons.forEach(person => {
            if (isLikedAlready(user, person.id)) {
                console.log(person.id + " already liked by " + user);
            }
            else {
                console.log(person.id + " is good for " + user);
            }
        });
    });
}
function sendNewMessageNotification(convId, messageId) {
    return __awaiter(this, void 0, void 0, function* () {
        const message = yield firestoreInstance.collection('tinder').doc('messages').collection(convId).doc(messageId).get();
        const messageData = message.data();
        const participants = convId.split('-');
        const otherPerson = participants[0] == messageData.sender ? participants[1] : participants[0];
        const senderPersonData = yield getUserPrivateData(messageData.sender);
        const otherPersonData = yield getUserPrivateData(otherPerson);
        yield sendNotification([otherPersonData.data()], senderPersonData.data().displayName + ' ti-a trimis un mesaj!');
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
        yield Promise.all(convUpdates);
    });
}
exports.personLiked = functions.firestore.document('/likes/{likes}').onWrite((change, context) => {
    return isMatch(change);
});
exports.messageReceived = functions.firestore.document('/tinder/messages/{convId}/{messageId}').onWrite((change, context) => {
    return sendNewMessageNotification(context.params.convId, context.params.messageId);
});
exports.findNewPersons = functions.https.onRequest((req, res) => {
    let user = req.query.user;
    return getSuggestions(user, 50);
});
//# sourceMappingURL=index.js.map