import { collection, query, orderBy, limit, getDocs, doc } from "firebase/firestore";
import firebase_app from "../config";
import { getFirestore } from "firebase/firestore";

// Get the Firestore instance
const db = getFirestore(firebase_app);


const articleQuery = query(collection(db, "articles"), orderBy("order"), limit(3));
const openAIKeyDoc = doc(db, "APIKeys", "openai-keys");
const openAIQueryDoc = doc(db, "queries", "openai-queries")

export {
    articleQuery,
    openAIKeyDoc,
    openAIQueryDoc
}