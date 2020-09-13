import firebase from 'firebase'
import "firebase/auth"
import "firebase/storage"

var config = {
  apiKey: "AIzaSyBJJJ7coKgS-9DNi2u6IvMuyL05GLfZ52A",
  authDomain: "project-predicto.firebaseapp.com",
  databaseURL: "https://project-predicto.firebaseio.com",
  projectId: "project-predicto",
  storageBucket: "project-predicto.appspot.com",
  messagingSenderId: "273796537155",
  appId: "1:273796537155:web:1776f69687cf0c07396df6",
  measurementId: "G-0G968JEC81"
  };

if (!firebase.apps.length) {
  firebase.initializeApp(config)
}
export const auth = firebase.auth()
export const db = firebase.database()
export const storage = firebase.storage()
