"use client"; // This is a client component 👈🏽

import { useState } from 'react';
import { TextField, Button, Checkbox, FormGroup, FormControlLabel, Container, FormControl, InputLabel, Select, MenuItem, Snackbar, Alert } from '@mui/material';
import firebase from 'firebase/app';
import 'firebase/firestore';
import firebase_app from "../../firebase/config";
import { getFirestore } from "firebase/firestore";
import {getDoc, addDoc,setDoc,doc, Timestamp, collection} from "firebase/firestore"
import { getAuth, onAuthStateChanged, User } from "firebase/auth";

// Get the Firestore instance
const db = getFirestore(firebase_app);
const auth = getAuth(firebase_app);


interface LinkData {
    boostApp: string;
    url: string;
    providers: string[];
    id: string;
  }
  
  const CreateLinkPage: React.FC = () => {
    const [linkData, setLinkData] = useState<LinkData>({
      boostApp: '',
      url: '',
      providers: [],
      id: ''
    });

    const [openSnackbar, setOpenSnackbar] = useState(false);

  
    const handleInputChange = (e: any) => {
      const { name, value } = e.target;
  
      setLinkData((prevData) => ({
        ...prevData,
        [name as string]: value,
      }));
    };
  
    const handleCheckboxChange = (provider: string) => {
      const updatedProviders = linkData.providers.includes(provider)
        ? linkData.providers.filter((p) => p !== provider)
        : [...linkData.providers, provider];
  
      setLinkData((prevData) => ({
        ...prevData,
        providers: updatedProviders,
      }));
    };
  
    const generateId = () => {
      return Math.random().toString(36).substr(2, 8).toUpperCase();
    };
  
    const handleCreateLink = async () => {
      if(linkData.url || linkData.providers.length){
  
      const id = generateId();
      setLinkData((prevData) => ({
        ...prevData,
        id,
      }));
        //  saving the response on firebase
    onAuthStateChanged(auth, async (user) => {
    // console.log(user)
      await setDoc(doc(db, "boosted-links", id),{
      createdBy: user?.uid,
      createdAt: Timestamp.now(),
        ...linkData,
        id,
        totalEmailGathered: 0
      });
      setOpenSnackbar(true);

      // setLinkData({
      //   boostApp: '',
      //   url: '',
      //   providers: [],
      // });
    });
      
  }else{
    alert("Please fill all the input")
  }
    };

    const handleCloseSnackbar = () => {
      setOpenSnackbar(false);
    };

    const boostedLink = `${typeof window === 'object' && window.location.origin}/l?id=${linkData.id}`;

  
    return (
      <Container style={{marginTop:"70px"}}>
        
  
        <TextField
          label="Target URL"
          variant="outlined"
          name="url"
          value={linkData.url}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
  
        <FormGroup>
          <FormControlLabel
            control={<Checkbox checked={linkData.providers.includes('Google')} onChange={() => handleCheckboxChange('Google')} />}
            label="Google SignIn"
          />
          {/* <FormControlLabel
            control={<Checkbox checked={linkData.providers.includes('Apple')} onChange={() => handleCheckboxChange('Apple')} />}
            label="Apple SignIn"
          /> */}
          <FormControlLabel
            control={<Checkbox checked={linkData.providers.includes('Facebook')} onChange={() => handleCheckboxChange('Facebook')} />}
            label="Facebook SignIn"
          />
            <FormControlLabel
            control={<Checkbox checked={linkData.providers.includes('Twitter')} onChange={() => handleCheckboxChange('Twitter')} />}
            label="Twitter SignIn"
          />
            <FormControlLabel
            control={<Checkbox checked={linkData.providers.includes('Microsoft')} onChange={() => handleCheckboxChange('Microsoft')} />}
            label="Microsoft SignIn"
          />
           <FormControlLabel
            control={<Checkbox checked={linkData.providers.includes('Github')} onChange={() => handleCheckboxChange('Github')} />}
            label="Github SignIn"
          />
        </FormGroup>
  
        <Button variant="contained" color="primary" onClick={handleCreateLink}>
          Create Link
        </Button>
        <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="success">
          <p>Boosted Link created</p>
          <p>
            <a href={boostedLink} target="_blank" rel="noopener noreferrer">
              {boostedLink}
            </a>
          </p>
          <Button
            onClick={() => {
              navigator.clipboard.writeText(boostedLink);
              setOpenSnackbar(false);
            }}
          >
            Copy Link
          </Button>
        </Alert>
      </Snackbar>
      </Container>
    );
  };
  
  export default CreateLinkPage;