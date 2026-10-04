import {initializeApp} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {getAuth,onAuthStateChanged,createUserWithEmailAndPassword,signInWithEmailAndPassword,signOut,updateProfile} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
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

// Usuário logado (ou null). O login é por nome + senha.
export function entrar(){
  return new Promise(res=>{const un=onAuthStateChanged(auth,u=>{un();res(u)})});
}
const mail=n=>n+'@pactuados.app'; // e-mail fictício só para o Firebase aceitar nome+senha
export async function criarConta(nome,senha){
  const c=await createUserWithEmailAndPassword(auth,mail(nome),senha);
  await updateProfile(c.user,{displayName:nome});
  return c.user;
}
export const login=(nome,senha)=>signInWithEmailAndPassword(auth,mail(nome),senha).then(c=>c.user);
export const sair=()=>signOut(auth);

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
// Troca de modo. Quem já provou ser mestre volta ao modo mestre sem digitar o código de novo.
export async function paraMestre(uid,codigo){
  const ref=doc(db,'membros',uid);
  try{
    if(!codigo){const s=await getDoc(ref);codigo=s.exists()?s.data().codigo:''}
    await setDoc(ref,{role:'mestre',codigo});return true;
  }catch(e){return false}
}
export async function paraJogador(uid){
  const ref=doc(db,'membros',uid);
  try{const s=await getDoc(ref);await setDoc(ref,{role:'jogador',codigo:s.data().codigo});return true}catch(e){return false}
}
