import { FC, useState, useEffect } from "react";
// Importing MUI
import { Box, Button, Typography, Stack, TextField, TextareaAutosize } from "@mui/material";
import {openAIKeyDoc, openAIQueryDoc} from "../../firebase/firestore/queries"
import {getDoc} from "firebase/firestore"
import OpenAI from 'openai';


// Importing Styles
import "../../index.css";

const AboutUs: FC = () => {

  const [gptResponse, setGptResponse] = useState(null);
  const [gptResponseLoading, setGptResponseLoading] = useState(false);
  const [apiKey, setApiKey] = useState(null);
const [keywordsList, setKeywordsList] = useState<string>('')
const [articleTopic, setArticleTopic] = useState<string>('')
  const [openAIPrompt, setOpenAIPrompt] = useState<string>('')
const [articleLength, setArticleLength] = useState<any>(null)
  
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
          setOpenAIPrompt(apiKeyData.gpt4query);
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


//   useEffect(() => {
// let newOpenaiQuery: any=openaiQuery
// newOpenaiQuery=newOpenaiQuery.replace(`[topic]`, articleTopic)
// newOpenaiQuery=newOpenaiQuery.replace(`[keywords]`, keywordsList)
// newOpenaiQuery=newOpenaiQuery.replace(`[length]`, articleLength)

//   }, [articleTopic, keywordsList, articleLength])

  const makeOpenAiRequest = async () => {
    // Ensure we have an API key before making the request
    if (!apiKey) {
      alert('API key not available');
      return;
    }

    if(!articleLength || !keywordsList){
      alert("Please fill all the input field")
      return
    }

    // Set loading to true before making the request
    setGptResponseLoading(true);

    try {
      const openai = new OpenAI({
        apiKey: apiKey, // defaults to process.env["OPENAI_API_KEY"]
        dangerouslyAllowBrowser: true
      });

      // updating the topic based on query
      let gptPrompt=openAIPrompt.replace(`[topic]`, articleTopic).replace(`[keywords]`, keywordsList).replace(`[length]`, articleLength)


      const chatCompletion = await openai.chat.completions.create({
        messages: [{ role: 'user', content: gptPrompt}],
        model: 'gpt-4-1106-preview',
      });

      let gptResponse=''
     chatCompletion.choices.map(choice => {
      gptResponse=`${gptResponse}${choice.message}`
     })

     console.log(gptResponse)
      // setGptResponse(chatCompletion.data.choices[0].text);
    } catch (error) {
      console.error('Error making OpenAI request:', error);
    } finally {
      // Set loading to false when the request is done, regardless of success or failure
      setGptResponseLoading(false);
    }
  };



  return (
    <Box padding={10}>
      <Typography variant="h3">AI Article Writer</Typography>
    <Box>

  
      <Stack spacing={5} mt={10}>
    <Typography mt={2} variant="h5">Put here the news & the article from the website</Typography>
      <TextField
          id="standard-textarea"
          // label="Put here News & Article from the website"
          // placeholder="Put here News & Article from the website"
          multiline
          rows={20}
          
          variant="filled"
        />
      <TextField id="outlined-basic" label="Topic (Optional)" variant="filled"
      onChange={e=> setArticleTopic(e.target.value)}
      />
<TextField
onChange={e=> setKeywordsList(e.target.value)}
id="filled-basic" label="Keywords" variant="filled" />
<TextField
onChange={e=> setArticleLength(e.target.value)}
id="standard-basic" label="Article Length" variant="filled" />
</Stack>
<Box mt={5}>
<Button disabled={gptResponseLoading} size="large" variant="contained" onClick={makeOpenAiRequest}>Write Article</Button>
</Box>
      </Box>
      </Box>

  );
};
export default AboutUs;
