import firebase from 'firebase';

console.log('FB_APIKEY: ', process.env.FB_APIKEY);
console.log('FB_AUTHDOM: ', process.env.FB_AUTHDOM);
console.log('DATA_URL: ', process.env.FB_DATAURL);
console.log('FB_STORAGE: ', process.env.FB_STORAGE);
console.log('FB_MESS_SENDERID: ', process.env.FB_MESS_SENDERID);

const config = {
  apiKey: process.env.FB_APIKEY,
  authDomain: process.env.FB_AUTHDOM,
  databaseURL: process.env.FB_DATAURL,
  storageBucket: process.env.FB_STORAGE,
  messagingSenderId: process.env.FB_MESS_SENDERID,
};

firebase.initializeApp(config);
let ref = firebase.database().ref();
const auth = firebase.auth();

const firebaseUtils = {
  createUser(user) {
    auth.createUserWithEmailAndPassword(user.email, user.password).then((createdUser) => {
      createdUser.updateProfile({
        displayName: user.name,
      });
      ref = firebase.database().ref('users').child(createdUser.uid);
      ref.set({
        name: user.name,
      });
    });
  },
  loginWithPW(user, cb, cbOnRegister) {
    auth.signInWithEmailAndPassword(user.email, user.password).catch((error) => {
      // Handle Errors here.
      cb(error.code);
    }).then((authData) => {
      firebaseUtils.onChange(true);
      if (cbOnRegister) {
        cb(authData);
        cbOnRegister(false);
      } else {
        cb(false);
      }
    });
  },
  loginWithGoogle(cb) {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider).catch((error) => {
      cb(error.code);
    }).then((authData) => {
      ref = firebase.database().ref('users').child(authData.user.uid);
      ref.once('value')
        .then((snapshot) => {
          const isNewUser = !snapshot.exists();
          if (authData && isNewUser) {
            ref.set({
              name: authData.user.displayName,
            }).catch((error) => {
              console.log(error);
            });
          }
        });
      firebaseUtils.onChange(true);
      cb(false);
    });
  },
  loginWithFacebook(cb) {
    const provider = new firebase.auth.FacebookAuthProvider();
    auth.signInWithPopup(provider).catch((error) => {
      cb(error.code);
    }).then((authData) => {
      console.log(authData);
      ref = firebase.database().ref('users').child(authData.user.uid);
      ref.once('value')
        .then((snapshot) => {
          const isNewUser = !snapshot.exists();
          if (authData && isNewUser) {
            ref.set({
              name: authData.user.displayName,
            }).catch((error) => {
              console.log(error);
            });
          }
        });
      firebaseUtils.onChange(true);
      cb(false);
    }).catch((error) => {
      console.log('Error:', error);
    });
  },
  isLoggedIn(cb) {
    auth.onAuthStateChanged((user) => {
      if (user) {
        cb(true, user);
      } else {
        cb(false, null);
      }
    });
  },
  getCurrentUser(cb) {
    auth.onAuthStateChanged((user) => {
      cb(user);
    });
    return auth.currentUser;
  },
  logout() {
    firebase.auth().signOut().then(() => {
      firebaseUtils.onChange(false);
    }, (error) => {
      console.log(error);
    });
  },
};

export default firebaseUtils;
