// pages/boosted-links/[id].tsx
"use client"; // This is a client component 👈🏽
// pages/boosted-links/[id].tsx

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, CircularProgress, Snackbar } from '@mui/material';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { getAuth, GoogleAuthProvider, FacebookAuthProvider, TwitterAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore, doc,  addDoc,getDocs,increment,updateDoc, setDoc, collection , Timestamp} from 'firebase/firestore';
import { boostedLinksQuery } from "../../firebase/firestore/queries";
import firebase_app from "../../firebase/config";
import { onAuthStateChanged, User } from "firebase/auth";
import { useLinkedIn } from 'react-linkedin-login-oauth2';
// You can use provided image shipped by this package or using your own
import linkedin from 'react-linkedin-login-oauth2/assets/linkedin.png';
import Stack from '@mui/material/Stack';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import GoogleIcon from '@mui/icons-material/Google';
import { useSearchParams } from 'next/navigation'



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

const BoostedLinkPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [boostedLink, setBoostedLink] = useState<BoostedLink | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const searchParams = useSearchParams()
// @ts-expect-error
const {id} = searchParams.get('id')

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
    // const { id } = params;

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
          setLoading(false);

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
  }, [id]);

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
   // @ts-expect-error
          boostedLinkId: boostedLink.id
});

        // setSnackbarMessage('Sign-in successful');
        // setSnackbarOpen(true);
    signOut(getAuth());
     // @ts-expect-error
    window.location.href = boostedLink.url;

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
        <CircularProgress 
        style={{ position: "fixed", left: "50vw", top: "35vh" }}
        />
      ) : (
        <>       
          {/* Social media login buttons */}
          <div>
          <Stack spacing={4} style={{
border: "2px dashed gray",
padding: '50px 70px',
margin: '0 auto',
marginTop: '150px',
width: 'fit-content'
            }}>
          <Button startIcon={<GoogleIcon />} variant="outlined" onClick={() => handleSignIn(new GoogleAuthProvider())}>Sign in with Google</Button>
            <Button startIcon={<FacebookIcon />} variant="outlined" onClick={() => handleSignIn(new FacebookAuthProvider())}>Sign in with Facebook</Button>
            <Button startIcon={<TwitterIcon />} variant="outlined" onClick={() => handleSignIn(new TwitterAuthProvider())}>Sign in with Twitter</Button>
            <Button startIcon={<InstagramIcon />} variant="outlined" onClick={() => handleSignIn(new TwitterAuthProvider())}>Sign in with Instagram</Button>
            <Button startIcon={<LinkedInIcon />} variant="outlined" onClick={() => handleSignIn(new TwitterAuthProvider())}>Sign in with LinkedIn</Button>
</Stack>
          
  {/* <img
      onClick={linkedInLogin}
    // @ts-expect-error
      src={linkedin}
      alt="Sign in with Linked In"
      style={{ maxWidth: '180px', cursor: 'pointer' }}
    /> */}
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
