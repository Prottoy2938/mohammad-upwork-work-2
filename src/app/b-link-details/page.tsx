// pages/[linkID].js
"use client"
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Table, TableContainer, TableHead, TableBody, TableRow, TableCell, Paper } from '@mui/material';
import { getFirestore,limit, collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import firebase_app from "../../firebase/config";
import CircularProgress from "@mui/material/CircularProgress";
import { useSearchParams } from 'next/navigation'


const db = getFirestore(firebase_app);

const LinkPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true)
  const router = useRouter();
  const searchParams = useSearchParams();
  const linkID = searchParams.get('id')

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
const userDocRef = collection(db, 'boosted-links', linkID, 'signed-users');
// Query the posts collection, orderBy createdAt, and limit to the first 100 documents
const postsQuery = query(userDocRef, orderBy('createdAt'), limit(100));
const signedUsersSnapshot=await getDocs(postsQuery)
        // Extract and set the data for rendering
        const userData = signedUsersSnapshot.docs.map((doc) => doc.data());
        console.log(userData)
            // @ts-expect-error
        setData(userData);
        setLoading(false)
      } catch (error) {
        setLoading(false)
        console.error('Error fetching data:', error);
      }
    };

    if (linkID) {
      fetchData();
    } else {
      // Redirect or handle if linkID is not available
      router.push('/'); // Replace with your desired redirection
    }
  }, [linkID, router]);

  if (loading) {
    return <CircularProgress
    style={{ position: "fixed", left: "50vw", top: "35vh" }}
  />
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Email</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>CreatedAt</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((user: any) => (
            <TableRow key={user.email}>
              <TableCell>{user.email? user.email :"User didn't give email"}</TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.createdAt.toDate().toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default LinkPage;
