import * as functions from 'firebase-functions';
import { isNullOrUndefined } from 'util';

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//

export const test = functions.firestore.document('/likes/{likes}')
    .onWrite((change, context) => {

            // Get an object representing the document
            // e.g. {'name': 'Marie', 'age': 66}
            const id = change.after.id;

            const newValue = change.after.data();
    
            // ...or the previous value before this update
            const previousValue = change.before.data();
    
            // access a particular field as you would any JS property
            const persons = id.split('-');
            if (!isNullOrUndefined(newValue[persons[0]]) && newValue[persons[0]] === true &&
                !isNullOrUndefined(newValue[persons[1]]) && newValue[persons[1]] === true) {
                  console.log("MATCH!");
            } else {
                  console.log("id: " + newValue[persons[0]] + ", " + isNullOrUndefined(newValue[persons[0]]) + ", " + newValue[persons[0]]);
                  console.log("id: " + newValue[persons[1]] + ", " + isNullOrUndefined(newValue[persons[1]]) + ", " + newValue[persons[1]]);
            }
    
            // perform desired operations ...
      });
