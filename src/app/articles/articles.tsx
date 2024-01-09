"use client"; // This is a client component 👈🏽

import { FC, useState, useEffect } from "react";
import { Box, Typography, Stack } from "@mui/material";
import { v4 as uuidv4 } from "uuid";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { ArticlesData } from "../../types/firestore";
import CircularProgress from "@mui/material/CircularProgress";
import { articleQuery } from "../../firebase/firestore/queries";
import { articlesBannerImage } from "../../constants/img-src";

const Articles: FC = () => {
  const [loading, setLoading] = useState(true);
  const [articles, setArticles] = useState<ArticlesData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      await getDocs(articleQuery)
        .then((querySnapshot) => {
          const articlesData: ArticlesData[] = [];
          querySnapshot.forEach((doc: any) => {
            articlesData.push(doc.data());
          });
          setArticles(articlesData);
          setLoading(false);
        })
        .catch((e) => {
          console.log(e);
        });
    };

    fetchData();
  }, []);
  return (
    <Box p={5}>
      {loading && (
        <CircularProgress
          style={{ position: "fixed", left: "50vw", top: "35vh" }}
        />
      )}
      {!loading && (
        <Box>
          <img
            style={{ margin: "0 auto" }}
            src={articlesBannerImage}
            alt="image-1"
            width={600}
            height={300}
          />

          <Box>
            <Stack spacing={12} padding="20px" mt={10}>
              {articles.map((article) => (
                <div key={uuidv4()}>
                  <Typography variant="h5">{article.title}</Typography>
                  <Typography mt={2}>{article.body}</Typography>
                </div>
              ))}
            </Stack>
          </Box>
        </Box>
      )}
    </Box>
  );
};
export default Articles;
