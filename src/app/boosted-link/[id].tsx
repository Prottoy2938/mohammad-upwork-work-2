
// pages/boosted-links/[id].tsx
"use client"; // This is a client component 👈🏽
// pages/boosted-links/[id].tsx

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Button, CircularProgress, Snackbar } from '@mui/material';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { getAuth, GoogleAuthProvider, FacebookAuthProvider, TwitterAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc, collection } from 'firebase/firestore';

import firebase_app from "../../firebase/config";
import { onAuthStateChanged, User } from "firebase/auth";

interface BoostedLink {
  // Define the structure of your boosted link document
  id: string;
  // Add other fields as needed
}

interface SignedUser {
  name: string;
  email: string;
  // Add other fields as needed
}

const db = getFirestore(firebase_app);
const auth = getAuth(firebase_app);



interface BoostedLink {
  // Define the structure of your boosted link document
  id: string;
  // Add other fields as needed
}

interface SignedUser {
  name: string;
  email: string;
  // Add other fields as needed
}

const BoostedLinkPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [boostedLink, setBoostedLink] = useState<BoostedLink | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    // Logout user on page load
    signOut(getAuth());

    // Get the id from the query parameters
    const { id } = router.query;

    if (id) {
      // Fetch data from Firestore
      const fetchBoostedLink = async () => {
        try {
          const boostedLinkDocRef = doc(getFirestore(), 'boosted-links', id as string);
          const boostedLinkDoc = await getDoc(boostedLinkDocRef);

          if (boostedLinkDoc.exists()) {
            setBoostedLink(boostedLinkDoc.data() as BoostedLink);
          } else {
            setSnackbarMessage('Boosted link not found');
            setSnackbarOpen(true);
          }
        } catch (error) {
          console.error('Error fetching boosted link:', error);
          setSnackbarMessage('Error fetching boosted link');
          setSnackbarOpen(true);
        } finally {
          setLoading(false);
        }
      };

      fetchBoostedLink();
    } else {
      setSnackbarMessage('Boosted link ID not provided');
      setSnackbarOpen(true);
      setLoading(false);
    }
  }, [router.query.id]);

  const handleSignIn = async (provider: GoogleAuthProvider | FacebookAuthProvider | TwitterAuthProvider) => {
    try {
      // Sign in with the selected provider
      const result = await signInWithPopup(getAuth(), provider);
      const user = result.user;

      if (user) {
        const signedUserData: SignedUser = {
          name: user.displayName || '',
          email: user.email || '',
        };

        // Save user data in the "signed-users" collection
        // @ts-expect-error
        await setDoc(doc(db, 'boosted-links', boostedLink.id, 'signed-users', user.uid), signedUserData);

        setSnackbarMessage('Sign-in successful');
        setSnackbarOpen(true);

        // Disable login buttons after successful sign-in
        // You may need to adjust this based on your UI
      }
    } catch (error) {
      console.error('Error signing in:', error);
      setSnackbarMessage('Error signing in');
      setSnackbarOpen(true);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <div>
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          {/* Show your boosted link content here */}
          <div>
            <h1>{boostedLink?.id}</h1>
          </div>

          {/* Social media login buttons */}
          <div>
            <Button onClick={() => handleSignIn(new GoogleAuthProvider())}>Sign in with Google</Button>
            <Button onClick={() => handleSignIn(new FacebookAuthProvider())}>Sign in with Facebook</Button>
            <Button onClick={() => handleSignIn(new TwitterAuthProvider())}>Sign in with Twitter</Button>
            {/* Add buttons for other providers as needed */}
          </div>
        </>
      )}

      {/* Snackbar for displaying success/error messages */}
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <MuiAlert elevation={6} variant="filled" severity="success" onClose={handleCloseSnackbar}>
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </div>
  );
};

export default BoostedLinkPage;