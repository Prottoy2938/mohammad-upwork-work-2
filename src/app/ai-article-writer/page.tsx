"use client"; // This is a client component 👈🏽

import { FC, useState, useEffect, useReducer } from "react";
// Importing MUI
import { Box, Button, FormControl,InputLabel, Typography, Stack, TextField, TextareaAutosize, MenuItem, Select } from "@mui/material";

import { openAIKeyDoc, openAIQueryDoc } from "../../firebase/firestore/queries";
import OpenAI from "openai";
import CircularProgress from "@mui/material/CircularProgress";
import { IconButton } from '@mui/material';
import {CopyAll} from "@mui/icons-material"
import {CopyToClipboard} from 'react-copy-to-clipboard';
import {getDoc, addDoc, Timestamp, collection} from "firebase/firestore"
import { getAuth, onAuthStateChanged, User } from "firebase/auth";

import firebase_app from "../../firebase/config";
import { getFirestore } from "firebase/firestore";

const regexPattern = /[!@#$%^&*()_+\[\]:;<>,.?~\\/-]/g;

// Initialize Firebase auth instance
const auth = getAuth(firebase_app);


// Get the Firestore instance
const db = getFirestore(firebase_app);

// Importing Styles

const AboutUs: FC = () => {

  const [gptResponse, setGptResponse] = useState<any>(null);
  const [gptResponseLoading, setGptResponseLoading] = useState(false);
  const [apiKey, setApiKey] = useState(null);
  const [openAIPrompt, setOpenAIPrompt] = useState<string>('')
  const [elements, setElements] = useState<any>({});
  const [selectedElement, setSelectedElement] = useState("");
const [componentValues, setComponentValues] = useState({});



const getReplacedSentence = () => {
  let replacedSentence = openAIPrompt.replace(regexPattern, '');
  Object.entries(componentValues).forEach(([componentName, value]) => {
    const regex = new RegExp(`{{${componentName.replace(regexPattern, '')}}}`, 'g');
    // @ts-expect-error
    replacedSentence = replacedSentence.replace(regex, value);
  });
  return replacedSentence;
};




  useEffect(() => {
    // Retrieve API key from Firestore
    const fetchApiKey = async () => {
      try {
        const apiKeySnapshot =await getDoc(openAIKeyDoc)
// @ts-expect-error
        if (apiKeySnapshot.exists) {
          const apiKeyData: any = apiKeySnapshot.data();
          setApiKey(apiKeyData.key);
        } else {
          alert('API key not found in Firestore');
        }
      } catch (error) {
        console.error('Error fetching API key from Firestore:', error);
      }
    };
// fetching openai query
    const fetchOpenAIQuery = async () => {
      try {
        const apiKeySnapshot =await getDoc(openAIQueryDoc)
// @ts-expect-error
        if (apiKeySnapshot.exists) {
          const apiKeyData: any = apiKeySnapshot.data();
          setElements(apiKeyData);
        } else {
          alert('No Query found in Firestore');
        }
      } catch (error) {
        console.error('Error fetching API key from Firestore:', error);
      }
    };

    

    fetchApiKey();
    fetchOpenAIQuery()
  }, []);

  useEffect(() => {
    setOpenAIPrompt(elements[selectedElement]);
  }, [selectedElement, elements]);


 
  useEffect(() => {
    if(openAIPrompt){
 // Extract components inside {{}}
 const regex = /{{(.*?)}}/g;
 const matches = openAIPrompt.match(regex);

 if (matches) {
   // Create initial state with component names as keys and values as empty strings
   const initialComponentValues: any = {};
   matches.forEach((match: any) => {
     const componentName = match.replace(/[{}]/g, '').trim();
     initialComponentValues[componentName] = "";
   });
   setComponentValues(initialComponentValues);
 }
    }
   
  }, [openAIPrompt]);
 


  // @ts-expect-error
  const handleInputChange = (componentName, value) => {
    // Update the state for the respective component
    setComponentValues(prevValues => ({
      ...prevValues,
      [componentName]: value,
    }));
  };






  const makeOpenAiRequest = async () => {
    // Ensure we have an API key before making the request
    if (!apiKey) {
      alert('API key not available');
      return;
    }


    // Set loading to true before making the request
    setGptResponseLoading(true);
    try {
      const openai = new OpenAI({
        apiKey: apiKey, // defaults to process.env["OPENAI_API_KEY"]
        dangerouslyAllowBrowser: true
      });

      // updating the topic based on query
      let gptPrompt=getReplacedSentence()
      console.log(gptPrompt)

const gptModel='gpt-4-1106-preview'
      const chatCompletion = await openai.chat.completions.create({
        messages: [{ role: 'user', content: gptPrompt}],
        model: gptModel,
      });

      let gptResponse=''
     chatCompletion.choices.map(choice => {
      console.log(choice)
      gptResponse=`${gptResponse}${choice.message.content}`
     })

    //  saving the response on firebase
    onAuthStateChanged(auth, async (user) => {
      // if theres user then saving the uid
        if(user){
        await addDoc(collection(db, "ai-generated-articles"), {
            uid: user.uid, 
            gptPrompt: gptPrompt,
            gptModel: gptModel,
            gptResponse,
            createdAt: Timestamp.now()
           });
      
        }else{
          await addDoc(collection(db, "ai-generated-articles"), {
            uid: "not-logged",
            gptPrompt: gptPrompt,
            gptModel: gptModel,
            gptResponse,
            createdAt: Timestamp.now()
           });
         
        }
     
    });
   
// finally adding updating the state
      setGptResponse(gptResponse);
    } catch (error) {
      console.error('Error making OpenAI request:', error);
    } finally {
      // Set loading to false when the request is done, regardless of success or failure
      setGptResponseLoading(false);
    }
  };



  return (
    <Box padding={10}>
      <Typography variant="h3">Article Writer</Typography>
    <Box>

  
      <Stack spacing={5} mt={10}>
    <Typography mt={2} variant="h5">Put here the news & the article from the website</Typography>
      <TextField
          id="standard-textarea"
          // label="Put here News & Article from the website"
          // placeholder="Put here News & Article from the website"
          multiline
          rows={20}
          // va
          variant="filled"
        />
   
{/* {Object.entries(componentValues).map(([componentName, value]) => (
  <TextField
  key={componentName}
  label={componentName}
  value={value}
  onChange={(e) => handleInputChange(componentName, e.target.value)}
variant="filled" />
))} */}
<FormControl fullWidth>
  <InputLabel id="demo-simple-select-label">Query Options</InputLabel>

  <Select
        value={selectedElement}
        onChange={(e: any) => setSelectedElement(e.target.value)}
        label="Choose Query"
      >
        {Object.keys(elements).map((elementKey) => (
          <MenuItem key={elementKey} value={elementKey}>
            {elementKey}
          </MenuItem>
        ))}
      </Select>
      </FormControl>
      {/* Render Material-UI TextField for each component */}
      {Object.entries(componentValues).map(([componentName, value]) => (
        <TextField
          key={componentName}
          label={componentName}
          value={value}
          onChange={(e) => handleInputChange(componentName, e.target.value)}
          margin="normal"
        />
      ))}
</Stack>
<Box mt={5}>
<Button disabled={gptResponseLoading} size="large" variant="contained" onClick={makeOpenAiRequest}>Write Article</Button>
</Box>

{gptResponseLoading && 
  
  <CircularProgress
          style={{ position: "fixed", left: "50vw", top: "35vh" }}
        />}

        {gptResponse &&
 <Box>
    <Typography mt={2} variant="h5">AI Generated Article</Typography>
          
<CopyToClipboard text={gptResponse}>
  <IconButton style={{position: "absolute", right: 0}} aria-label="copy" >
  <CopyAll />
</IconButton>
</CopyToClipboard>

<TextField
          id="standard-textarea"
          // label="Put here News & Article from the website"
          // placeholder="Put here News & Article from the website"
          multiline
          rows={20}
          fullWidth
          variant="filled"
          value={gptResponse}
          onChange={e => setGptResponse(e.target.value)}
        />

</Box>
  
  }

        </Box>

      </Box>

  );
};
export default AboutUs;
