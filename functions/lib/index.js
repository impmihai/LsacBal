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
exports.firestoreInstance = admin.firestore();
function getUserPrivateData(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield exports.firestoreInstance.collection('users').doc(userId).get();
    });
}
function getUserAnswers(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const userAnswers = yield exports.firestoreInstance.collection('answers').doc(userId).get();
        return userAnswers.data();
    });
}
function getAllPersonsScores() {
    return __awaiter(this, void 0, void 0, function* () {
        const usersAnswers = yield exports.firestoreInstance.collection('answers').get();
        return usersAnswers.docs;
    });
}
exports.getAllPersonsScores = getAllPersonsScores;
function isMatch(change) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!change.after.exists)
            return;
        const id = change.after.id;
        const newValue = change.after.data();
        const persons = id.split('-');
        if (!util_1.isNullOrUndefined(newValue[persons[0]]) && newValue[persons[0]] === true &&
            !util_1.isNullOrUndefined(newValue[persons[1]]) && newValue[persons[1]] === true) {
            var doc = exports.firestoreInstance.collection('tinder').doc('matches');
            var a = doc.collection(persons[0]).doc(persons[1]).set({});
            var b = doc.collection(persons[1]).doc(persons[0]).set({});
            yield Promise.all([a, b]);
            const usersData = [yield getUserPrivateData(persons[0]), yield getUserPrivateData(persons[1])];
            let awaits = [];
            usersData.forEach(user => {
                if (!util_1.isNullOrUndefined(user) && !util_1.isNullOrUndefined(user.data().fcmtoken)) {
                    var message = {
                        data: {
                            score: '850',
                            time: '2:45'
                        },
                        token: user.data().fcmtoken
                    };
                    awaits.push(admin.messaging().send(message));
                }
            });
            yield Promise.all(awaits);
        }
        else {
            return;
        }
    });
}
exports.isMatch = isMatch;
exports.personLiked = functions.firestore.document('/likes/{likes}').onWrite((change, context) => {
    return isMatch(change);
});
exports.findNewPersons = functions.https.onRequest((req, res) => {
    let user = req.query.user;
    console.log(user);
});
//# sourceMappingURL=index.js.map