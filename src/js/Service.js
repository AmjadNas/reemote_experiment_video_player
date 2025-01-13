import axios from 'axios';

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore"; 


const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MASSAGE_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

let g_listener = null
let status = false

onAuthStateChanged(auth, (user) => {
  if (user) {
    g_listener(true);
  } else {
    g_listener(false);

  }
});

const getEmailFromUsername =  async (username) =>{
  const usersCollection = "users";
  try {
    const userDocRef = doc(db, usersCollection, username); 
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      return userData.email; 
    } else {
      return null; // User not found
    }
  } catch (error) {
    console.error("Error getting email from username:", error);
    throw error; 
  }

} 

const setCookie = (data, hours) => {
  const dt = new Date();
  dt.setHours(dt.setHours() + hours);
  document.cookie = `user=${data}; expires= ${dt}; path=/;`;
};

// const config = {
//   headers: {
//     'Content-Type': 'application/json',
//     'Access-Control-Allow-Origin': '*',
//   },
//   withCredentials: true
// };

class ServiceObj {
  registerListener(listener){
      
    g_listener = listener
  }

  async login(form) {
    try{
      const email = await getEmailFromUsername(form.username); 

      if(email == null)
        return 400;

      const auth = getAuth();
      await signInWithEmailAndPassword(auth, email, form.password);

    }catch(error){
      return 400;
    }
    
    // const res = await axios.post(`${api_link}/amjad/AmjadApp/Upload`, form, config);
    // axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token};`
    // setCookie(res.data.token, 3);
    // , {
    //   withCredentials: true,
    //   headers: {
    //     'Access-Control-Allow-Credentials': true,
    //   },
    // }
    // .then((res) => {
    //     axios.defaults.headers.common['Authorization'] = res.data.token;

    //     console.log(new Cookies('user'));

    //   })

    return 200;
  }

  async sendData(data, name) {
    try{
      // Upload user data to Firebase Storage
    const userData = data;
    const documentId = name;
    await setDoc(doc(db, "data", documentId), userData);
    
    }catch(error){
      console.error("could not upload data", error)
      throw error;;
    }
    return 200;
    // return await axios.post(`${api_link}/Upload`, data, config);
  }

  isLogged() {
    return status;
  }

  logOut() {
    signOut(auth);
  }
}

const Service = (function () {
  let instance;

  function createInstance() {
    const object = new ServiceObj();
    return object;
  }

  return {
    getInstance: function () {
      if (!instance) {
        instance = createInstance();
      }
      return instance;
    },
  };
})();

export default Service.getInstance();

