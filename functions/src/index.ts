import * as functions from 'firebase-functions';

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
            console.log(id + " " + newValue + " " + previousValue);
    
            // perform desired operations ...
      });
