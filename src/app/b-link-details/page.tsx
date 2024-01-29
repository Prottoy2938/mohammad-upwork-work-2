// pages/[linkID].js
"use client"
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Table, TableContainer,Button, TableHead, TableBody, TableRow, TableCell, Paper } from '@mui/material';
import { getFirestore,limit, collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import firebase_app from "../../firebase/config";
import CircularProgress from "@mui/material/CircularProgress";
import { useSearchParams } from 'next/navigation'

// @ts-expect-error
function exportToCsv(filename, rows) {
  var processRow = function (row) {
      var finalVal = '';
      for (var j = 0; j < row.length; j++) {
          var innerValue = row[j] === null ? '' : row[j].toString();
          if (row[j] instanceof Date) {
              innerValue = row[j].toLocaleString();
          };
          var result = innerValue.replace(/"/g, '""');
          if (result.search(/("|,|\n)/g) >= 0)
              result = '"' + result + '"';
          if (j > 0)
              finalVal += ',';
          finalVal += result;
      }
      return finalVal + '\n';
  };

  var csvFile = '';
  for (var i = 0; i < rows.length; i++) {
      csvFile += processRow(rows[i]);
  }

  var blob = new Blob([csvFile], { type: 'text/csv;charset=utf-8;' });
  if (navigator.msSaveBlob) { // IE 10+
      navigator.msSaveBlob(blob, filename);
  } else {
      var link = document.createElement("a");
      if (link.download !== undefined) { // feature detection
          // Browsers that support HTML5 download attribute
          var url = URL.createObjectURL(blob);
          link.setAttribute("href", url);
          link.setAttribute("download", filename);
          link.style.visibility = 'hidden';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
      }
  }
}


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
        // @ts-expect-error
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


  const handleDownloadCSVFile=()=>{
    const headingOrder=['boostedLinkId', 'createdAt', 'email', 'name', 'providerId']
    console.log(data.map(Object.values))

  
   const excelData=data.map((obj: any) =>
    headingOrder.map((key: any) =>{
      if(key=="createdAt"){
        return new Date(obj[key].seconds * 1000 + obj[key].nanoseconds / 1e6).toLocaleDateString()
      }
      return  obj[key]
    })
  )

    exportToCsv(`${linkID}.csv`,  [
      headingOrder,	
      excelData,    
    ])
  }

  if (loading) {
    return <CircularProgress
    style={{ position: "fixed", left: "50vw", top: "35vh" }}
  />
  }

  return (
    <>
    <Button style={{margin:"0 auto", marginTop:"30px", marginBottom:"30px", marginLeft:"45vw"}} onClick={handleDownloadCSVFile}>Download Data</Button>
 
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
    </>
  );
};

export default LinkPage;
