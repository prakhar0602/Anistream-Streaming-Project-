import { GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth } from "./firebase";

export const createUser=async(email,password)=>{
   try{ let user;
    user=await createUserWithEmailAndPassword(auth,email,password);
    return user;}
    catch(e){
        throw new Error(e.message)
    }
}
export const signIn=async(email,password)=>{
    try{
    let user= await signInWithEmailAndPassword(auth,email,password)
    return user;
    }
    catch(e){
        throw new Error(e.message)
    }
}
export const signInwithGoogle=async()=>{
    const provider=new GoogleAuthProvider();
    const result=await signInWithPopup(auth,provider);
    // result.user
    return result;
}
export const signOut=()=>{
    return auth.signOut();
}