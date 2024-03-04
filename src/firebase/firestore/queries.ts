import {
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  doc,
  where,
} from "firebase/firestore";
import firebase_app from "../config";
import { getFirestore } from "firebase/firestore";

// Get the Firestore instance
const db = getFirestore(firebase_app);

const articleQuery = query(
  collection(db, "articles"),
  orderBy("order"),
  limit(3)
);
const openAIKeyDoc = doc(db, "APIKeys", "openai-keys");
const openAIQueryDoc = doc(db, "queries", "openai-queries");
const boostedLinksQuery = (linkID: string): any => {
  return query(
    collection(db, "boosted-links"),
    where("id", "==", linkID),
    limit(1)
  );
};

const articleSearchQuery = (title: string): any => {
  return query(
    collection(db, "articles"),
    where("title", "==", title),
    limit(5)
  );
};

export {
  articleQuery,
  openAIKeyDoc,
  openAIQueryDoc,
  boostedLinksQuery,
  articleSearchQuery,
};
