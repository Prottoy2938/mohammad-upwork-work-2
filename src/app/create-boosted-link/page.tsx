"use client"; // This is a client component 👈🏽

import { useState } from 'react';
import { TextField, Button, Checkbox, FormGroup, FormControlLabel, Container, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import firebase from 'firebase/app';
import 'firebase/firestore';
import firebase_app from "../../firebase/config";
import { getFirestore } from "firebase/firestore";
import {getDoc, addDoc, Timestamp, collection} from "firebase/firestore"
import { getAuth, onAuthStateChanged, User } from "firebase/auth";

// Get the Firestore instance
const db = getFirestore(firebase_app);
const auth = getAuth(firebase_app);


interface LinkData {
    boostApp: string;
    url: string;
    providers: string[];
  }
  
  const CreateLinkPage: React.FC = () => {
    const [linkData, setLinkData] = useState<LinkData>({
      boostApp: '',
      url: '',
      providers: [],
    });
  
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
      return Math.random().toString(36).substr(2, 6).toUpperCase();
    };
  
    const handleCreateLink = async () => {
      const id = generateId();
        //  saving the response on firebase
    onAuthStateChanged(auth, async (user) => {
     console.log({
        id,
      userData: user,
        ...linkData,
      })
     console.log(linkData)
      // await addDoc(collection(db, "boosted-links"),{
      //   id,
      // userData: user,
      //   ...linkData,
      // });

      setLinkData({
        boostApp: '',
        url: '',
        providers: [],
      });
    });

    };
  
    return (
      <Container>
        
  
        <TextField
          label="URL to shorten"
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
          <FormControlLabel
            control={<Checkbox checked={linkData.providers.includes('Instagram')} onChange={() => handleCheckboxChange('Instagram')} />}
            label="Instagram SignIn"
          />
          <FormControlLabel
            control={<Checkbox checked={linkData.providers.includes('Facebook')} onChange={() => handleCheckboxChange('Facebook')} />}
            label="Facebook SignIn"
          />
        </FormGroup>
  
        <Button variant="contained" color="primary" onClick={handleCreateLink}>
          Create Link
        </Button>
      </Container>
    );
  };
  
  export default CreateLinkPage;