import * as firebase from 'firebase'

const firebaseConfig = {
  apiKey: "AIzaSyCDv9ViM5f03ZnI9i8vKz9xI_conVCyKx8",
  authDomain: "new-zipi.firebaseapp.com",
  databaseURL: "https://new-zipi-default-rtdb.firebaseio.com",
  projectId: "new-zipi",
  storageBucket: "new-zipi.appspot.com",
  messagingSenderId: "56654691536",
  appId: "1:56654691536:web:fd0144a5cdc9e41da4b2d5",
  storageBucket: "gs://new-zipi.appspot.com"
};



  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  export default firebase;