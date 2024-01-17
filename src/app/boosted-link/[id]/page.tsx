// pages/boosted-links/[id].tsx
"use client"; // This is a client component 👈🏽
// pages/boosted-links/[id].tsx

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, CircularProgress, Snackbar } from '@mui/material';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { getAuth, GoogleAuthProvider, FacebookAuthProvider, TwitterAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore, doc,  addDoc,getDocs,increment,updateDoc, setDoc, collection , Timestamp} from 'firebase/firestore';
import { boostedLinksQuery } from "../../../firebase/firestore/queries";
import firebase_app from "../../../firebase/config";
import { onAuthStateChanged, User } from "firebase/auth";
import { InstagramLogin } from '@amraneze/react-instagram-login';
import { useLinkedIn } from 'react-linkedin-login-oauth2';
// You can use provided image shipped by this package or using your own
import linkedin from 'react-linkedin-login-oauth2/assets/linkedin.png';

// Get the Firestore instance
const db = getFirestore(firebase_app);


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

// @ts-expect-error
const BoostedLinkPage = ({params}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [boostedLink, setBoostedLink] = useState<BoostedLink | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const responseInstagram = (response: any) => {
    console.log(response);
  };


  
  const { linkedInLogin } = useLinkedIn({
    clientId: '867gc5r3st2fnr',
    redirectUri:`${typeof window === 'object' && window.location.origin}/linkedin`, // for Next.js, you can use `${typeof window === 'object' && window.location.origin}/linkedin`
    onSuccess: (code) => {
      console.log(code);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  useEffect(() => {
    // Logout user on page load
    signOut(getAuth());

    // Get the id from the query parameters
    const { id } = params;

    if (id) {
      // Fetch data from Firestore
      const fetchBoostedLink = async () => {
        try {

          const boostedLinkDoc = await getDocs(boostedLinksQuery(id))
          boostedLinkDoc.forEach((doc) => {
            if (doc.exists()) {
               // Access the data of the first document using .data()
            const documentData = doc.data();
            console.log("First document data:", documentData);
              setBoostedLink(doc.data() as BoostedLink);
            } else {
              setSnackbarMessage('Boosted link not found');
              setSnackbarOpen(true);
            }
           
          });
         
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
  }, [params.id]);

  const handleSignIn = async (provider: GoogleAuthProvider | FacebookAuthProvider | TwitterAuthProvider) => {
    try {
//  for facebook to get email
      provider.addScope('email');
      console.log(provider,"<<<<<<<<<<<<<<")
      // Sign in with the selected provider
      const result = await signInWithPopup(getAuth(), provider);
      const user = result.user;
      if (user) {
        console.log(user)
        const signedUserData: SignedUser = {
          name: user.displayName || '',
          email: user.email || '',
        };
        
        // @ts-expect-error
const docRef = doc(db, "boosted-links", boostedLink.id, 'signed-users',user.uid);
        // @ts-expect-error
await updateDoc(doc(db, "boosted-links", boostedLink.id), {
  totalEmailGathered: increment(1)
});

setDoc(docRef,{...signedUserData,
  providerId: provider.providerId,
          createdAt: Timestamp.now(),
   //   // @ts-expect-error
          boostedLinkId: boostedLink.id
});

        setSnackbarMessage('Sign-in successful');
        setSnackbarOpen(true);
// Twitter Thing
// REMOVE THE NAVBAR
        // LOGOUT USER
        // WINDOW REDIRECT TO THE NEW ROUTE
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
            <Button onClick={() => handleSignIn(new TwitterAuthProvider())}>Sign in with Instagram</Button>
            <InstagramLogin
    clientId="CLIENT_ID"
    buttonText="Login"
    onSuccess={responseInstagram}
    onFailure={responseInstagram}
  />
  <img
      onClick={linkedInLogin}
      src={linkedin}
      alt="Sign in with Linked In"
      style={{ maxWidth: '180px', cursor: 'pointer' }}
    />
            {/* Add buttons for other providers as needed */}
          </div>
        </>
      )}

      {/* Snackbar for displaying success/error messages */}
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <MuiAlert elevation={6} variant="filled"  onClose={handleCloseSnackbar}>
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </div>
  );
};

export default BoostedLinkPage;
