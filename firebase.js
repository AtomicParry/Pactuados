import {initializeApp} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {getAuth,signInAnonymously,onAuthStateChanged} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {getFirestore,doc,getDoc,setDoc,addDoc,deleteDoc,updateDoc,collection,onSnapshot,serverTimestamp} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBpdDRP1pmAyp1i_MSYDpm40GDACJRK9mQ",
  authDomain: "pactuados-3ee5d.firebaseapp.com",
  projectId: "pactuados-3ee5d",
  storageBucket: "pactuados-3ee5d.firebasestorage.app",
  messagingSenderId: "616239266961",
  appId: "1:616239266961:web:9dd8b0e641d31e0e849330"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export {doc,getDoc,setDoc,addDoc,deleteDoc,updateDoc,collection,onSnapshot,serverTimestamp};

// Login anônimo: cada navegador recebe uma identidade (uid)
export function entrar(){
  return new Promise((res,rej)=>{
    const un=onAuthStateChanged(auth,u=>{
      if(u){un();res(u)}else signInAnonymously(auth).catch(rej);
    });
  });
}
// Papel na mesa: 'jogador', 'mestre' ou null (ainda não entrou)
export async function meuPapel(uid){
  try{const s=await getDoc(doc(db,'membros',uid));return s.exists()?s.data().role:null}catch(e){return null}
}
// O servidor só aceita se o código bater com o que está em config/mesa
export async function entrarNaMesa(uid,codigo){
  for(const role of ['jogador','mestre']){
    try{await setDoc(doc(db,'membros',uid),{role,codigo});return role}catch(e){}
  }
  return null;
}
