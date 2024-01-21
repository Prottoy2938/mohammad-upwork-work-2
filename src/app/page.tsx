"use client"; // This is a client component 👈🏽

import { FC, useState, useEffect } from "react";
// Importing MUI
import { Box, Button, Link, Grid, Typography, Stack } from "@mui/material";
import { getDoc, doc } from "firebase/firestore";
import { HomepageData } from "../types/firestore";
import CircularProgress from "@mui/material/CircularProgress";
import { image2, image3, image4 } from "../constants/img-src";

import firebase_app from "../firebase/config";
import { getFirestore } from "firebase/firestore";

// Get the Firestore instance
const db = getFirestore(firebase_app);

const Homepage: FC = () => {
  const [loading, setLoading] = useState(true);
  const [homePageData, setHomePageData] = useState<HomepageData>();
  useEffect(() => {
    console.log("alert, runng here")
    const fetchHomePageData = async () => {
      const docRef = doc(db, "home", "home-page");
      console.log("HERE 1")

      try {
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          // @ts-expect-error
          setHomePageData(docSnap.data());
          console.log("HERE ")
        } else {
          console.log("No such document exists!");
        }
      } catch (error) {
        console.error("Error getting document:", error);
      }

      setLoading(false);
    };

    fetchHomePageData();
  }, []);

  return (
    <Box mt={5}>
      <div>
        {loading && (
          <CircularProgress
            style={{ position: "fixed", left: "50vw", top: "35vh" }}
          />
        )}
        {!loading && homePageData && (
          <Stack spacing={10} padding={5}>
            <Grid container spacing={2}>
              <Grid item xs={5}>
                <img src={image2} alt="image-2" width={300} height={150} />
              </Grid>
              <Grid item xs={7}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography>{homePageData.mainLine1}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="h5">
                      {homePageData.mainLine2}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography>{homePageData.mainLine3}</Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            <Typography textAlign={"center"}>
              {homePageData.mainLine4}
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={5}>
                <img src={image3} alt="image-3" width={300} height={150} />
              </Grid>
              <Grid item xs={7}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography>{homePageData.mainLine5}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography>{homePageData.mainLine6}</Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={7}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography>{homePageData.mainLine7}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography>{homePageData.mainLine8}</Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={5}>
                <img src={image4} alt="image-4" width={300} height={150} />
              </Grid>
            </Grid>
          </Stack>
        )}
      </div>
    </Box>
  );
};
export default Homepage;
