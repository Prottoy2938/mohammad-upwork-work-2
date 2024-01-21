"use client"; // This is a client component 👈🏽

// pages/boostedLinks.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getFirestore, collection, query, limit,where, orderBy, getDocs, updateDoc, doc } from 'firebase/firestore';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { Table, TableBody, FormControlLabel,Snackbar,TableCell,  TableContainer, TableHead, TableRow, Paper, Checkbox, Button } from '@mui/material';
import { useAuthContext } from "@/context/AuthContext";
import {boostedLoginProviders} from "@/constants/boosted-login-providers"
import CircularProgress from "@mui/material/CircularProgress";
import Typography from '@mui/material/Typography';


const updateSelectedProviders = (allProviders: any, linksData: any) => {
  const updatedProviders = {};

  // Ensure all providers are initialized to false for all linkIds
  linksData.forEach(({ id: linkId }: any) => {
    // @ts-expect-error
    updatedProviders[linkId] = {};
    // @ts-expect-error
    allProviders.forEach((provider) => {
    // @ts-expect-error
      updatedProviders[linkId][provider] = false;
    });
  });

  // Update the selected providers based on the provided data
    // @ts-expect-error
  linksData.forEach(({ id: linkId, providers: selectedProviders }) => {
    // @ts-expect-error
    selectedProviders.forEach((provider) => {
    // @ts-expect-error
      updatedProviders[linkId][provider] = true;
    });
  });

  // Return the updated providers object
  return updatedProviders;
};


const BoostedLinks = () => {
  const [links, setLinks] = useState([]);
  const [selectedProviders, setSelectedProviders] = useState({});
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { user } = useAuthContext() as { user: any }; // Use 'as' to assert the type as { user: any }
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackBarType, setSnackbarType] = useState("error")



  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  useEffect(() => {
    const fetchLinks = async () => {
      const db = getFirestore();
      const q = query(
        collection(db, 'boosted-links'),
        where('createdBy', '==', user.uid),
        orderBy('createdAt'),
        limit(100)
      );

      try {
        const querySnapshot = await getDocs(q);
        const linksData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        console.log(linksData)
        setSelectedProviders(updateSelectedProviders(boostedLoginProviders,linksData ))
    // @ts-expect-error
        setLinks(linksData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching boosted links:', error);
        setLoading(false);
      }
    };

    if (user) {
      console.log(user)
      fetchLinks();
    } 
  }, [user, router]);
    // @ts-expect-error
  const handleCheckboxChange = (linkId, provider) => {
    setSelectedProviders((prevSelectedProviders) => {
      const updatedProviders = { ...prevSelectedProviders };
    // @ts-expect-error
      updatedProviders[linkId] = { ...updatedProviders[linkId], [provider]: !updatedProviders[linkId][provider] };
      return updatedProviders;
    });
  };
    // @ts-expect-error
  const handleSave = async (linkId) => {
    const db = getFirestore();
    const linkRef = doc(db, 'boosted-links', linkId);

    try {
    // @ts-expect-error
      await updateDoc(linkRef, { providers: Object.keys(selectedProviders[linkId]).filter((provider) => selectedProviders[linkId][provider]) });

      alert("Successfully updated")

      // Optionally, you can update the state or perform any other actions upon successful save
      // setSnackbarMessage('Boosted link provider updated');
      // setSnackbarType("success")
      // setSnackbarOpen(true);
    } catch (error) {
      // setSnackbarMessage('Something went wrong');
      // setSnackbarType("error")
      // setSnackbarOpen(true);
      alert("Something went wrong")

      console.error('Error updating boosted link:', error);
    }
  };

  if (loading) {
    return <CircularProgress
    style={{ position: "fixed", left: "50vw", top: "35vh" }}
  />
  }

  return (
    <>
     <Typography variant="h2" gutterBottom>
        Your Boosted URLs
      </Typography>
    <TableContainer style={{marginTop: "10px"}} component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell><b>Created At</b></TableCell>
            <TableCell><b>Main URL</b></TableCell>
            <TableCell><b>Boosted URL</b></TableCell>
            <TableCell><b>Emails Collected</b></TableCell>
            <TableCell><b>Providers</b></TableCell>
            <TableCell><b>Action</b></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {links.map((link: any) => (
            <TableRow key={link.id}>
              <TableCell>{link.createdAt.toDate().toLocaleString()}</TableCell>
              <TableCell>{link.url}</TableCell>
             
              <TableCell> <a href={ `${typeof window === 'object' && window.location.origin}/boosted-link/${link.id}`}>{ `${typeof window === 'object' && window.location.origin}/boosted-link/${link.id}`}  </a></TableCell>
            
             
              <TableCell> <a href={`/b-link-details/${link.id}`}><b>Emails: {link.totalEmailGathered}</b> <br /><span style={{borderBottom: "2px solid black", fontSize: "15px", marginTop:"10px"}}>See all emails     </span>         </a></TableCell>

              {/* <TableCell>{}</TableCell> */}
              <TableCell>
                {['Facebook', 'Google', 'Instagram', 'Twitter', 'LinkedIn'].map((provider) => (
                   <FormControlLabel
                   control={  <Checkbox
    // @ts-expect-error
                    checked={selectedProviders[link.id]?.[provider] || false}
                    onChange={() => handleCheckboxChange(link.id, provider)}
                  />}
                  label={provider}
                  key={provider}

                 />
                
                ))}
              </TableCell>
              <TableCell>
                <Button onClick={() => handleSave(link.id)} variant="contained" color="primary">
                  Save
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
    </TableContainer>
     {/* Snackbar for displaying success/error messages */}
     {/* <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <MuiAlert severity={snackBarType} elevation={6} variant="filled" onClose={handleCloseSnackbar}>
          {snackbarMessage}
        </MuiAlert>
      </Snackbar> */}
    </>
  );
};

export default BoostedLinks;

