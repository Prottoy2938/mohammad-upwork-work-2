"use client"; // This is a client component 👈🏽

// pages/boostedLinks.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getFirestore, collection, query, limit,where, orderBy, getDocs, updateDoc, doc } from 'firebase/firestore';
import { Table, TableBody, FormControlLabel,TableCell,  TableContainer, TableHead, TableRow, Paper, Checkbox, Button } from '@mui/material';
import { useAuthContext } from "@/context/AuthContext";
import {boostedLoginProviders} from "@/constants/boosted-login-providers"


const updateSelectedProviders = (allProviders: any, linksData: any) => {
  const updatedProviders = {};

  // Ensure all providers are initialized to false for all linkIds
  linksData.forEach(({ id: linkId }) => {
    updatedProviders[linkId] = {};
    allProviders.forEach((provider) => {
      updatedProviders[linkId][provider] = false;
    });
  });

  // Update the selected providers based on the provided data
  linksData.forEach(({ id: linkId, providers: selectedProviders }) => {
    selectedProviders.forEach((provider) => {
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
        setSelectedProviders(updateSelectedProviders(boostedLoginProviders,linksData ))
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

  const handleCheckboxChange = (linkId, provider) => {
    setSelectedProviders((prevSelectedProviders) => {
      const updatedProviders = { ...prevSelectedProviders };
      updatedProviders[linkId] = { ...updatedProviders[linkId], [provider]: !updatedProviders[linkId][provider] };
      return updatedProviders;
    });
  };

  const handleSave = async (linkId) => {
    const db = getFirestore();
    const linkRef = doc(db, 'boosted-links', linkId);

    try {
      await updateDoc(linkRef, { providers: Object.keys(selectedProviders[linkId]).filter((provider) => selectedProviders[linkId][provider]) });
      // Optionally, you can update the state or perform any other actions upon successful save
    } catch (error) {
      console.error('Error updating boosted link:', error);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Created At</TableCell>
            <TableCell>URL</TableCell>
            <TableCell>Total Email Gathered</TableCell>
            <TableCell>Providers</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {links.map((link) => (
            <TableRow key={link.id}>
              <TableCell>{link.createdAt.toDate().toLocaleString()}</TableCell>
              <TableCell>{link.url}</TableCell>
              <TableCell>{link.totalEmailGathered}</TableCell>
              <TableCell>
                {['Facebook', 'Google', 'Instagram', 'Twitter', 'LinkedIn'].map((provider) => (
                   <FormControlLabel
                   control={  <Checkbox
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
  );
};

export default BoostedLinks;

