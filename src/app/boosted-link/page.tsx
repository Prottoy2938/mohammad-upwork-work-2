// pages/boosted-links/[id].tsx
"use client"; // This is a client component 👈🏽
// pages/boosted-links/[id].tsx

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, CircularProgress, Snackbar } from '@mui/material';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { getAuth, GoogleAuthProvider, FacebookAuthProvider, TwitterAuthProvider, signInWithPopup, signOut, GithubAuthProvider,} from 'firebase/auth';
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
import MicrosoftIcon from '@mui/icons-material/Microsoft';
import TwitterIcon from '@mui/icons-material/Twitter';
import GoogleIcon from '@mui/icons-material/Google';
import { useSearchParams } from 'next/navigation'
import axios from 'axios'
import { OAuthProvider } from "firebase/auth";
import GithubIcon from '@mui/icons-material/GitHub';


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
  const [boostedLink, setBoostedLink] = useState<BoostedLink | any>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const searchParams = useSearchParams()


const id = searchParams.get('id')



const responseInstagram = async (accessToken: any) => {
  console.log(accessToken, "<<");
  const response = await axios.get(`https://graph.instagram.com/v12.0/me?fields=id,username,email&access_token=${accessToken}`);
    
  // Extract user information
  const { id, username, email } = response.data;
};





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
        
const docRef = doc(db, "boosted-links", boostedLink.id, 'signed-users',user.uid);
await updateDoc(doc(db, "boosted-links", boostedLink.id), {
  totalEmailGathered: increment(1)
});

setDoc(docRef,{...signedUserData,
  providerId: provider.providerId,
          createdAt: Timestamp.now(),
          boostedLinkId: boostedLink.id
});

        // setSnackbarMessage('Sign-in successful');
        // setSnackbarOpen(true);
    signOut(getAuth()).then(() =>{
      window.location.href = boostedLink.url;
    })

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
              {boostedLink.providers.includes('Google')?<Button startIcon={<GoogleIcon />} variant="outlined" onClick={() => handleSignIn(new GoogleAuthProvider())}>Sign in with Google</Button> :""}
              {boostedLink.providers.includes('Facebook')?<Button startIcon={<FacebookIcon />} variant="outlined" onClick={() => handleSignIn(new FacebookAuthProvider())}>Sign in with Facebook</Button> :""}
              {boostedLink.providers.includes('Twitter')? <Button startIcon={<TwitterIcon />} variant="outlined" onClick={() => handleSignIn(new TwitterAuthProvider())}>Sign in with Twitter</Button>:""}
              {boostedLink.providers.includes('Microsoft')?<Button startIcon={<MicrosoftIcon />} variant="outlined" onClick={() => handleSignIn(new OAuthProvider('microsoft.com'))}>Sign in with Microsoft</Button> :""}
              {boostedLink.providers.includes('Github')?<Button startIcon={<GithubIcon />} variant="outlined" onClick={() => handleSignIn(new GithubAuthProvider)}>Sign in with GitHub</Button> :""}


          
            
            
            
            
</Stack>
          

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
