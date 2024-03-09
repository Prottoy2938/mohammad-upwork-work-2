"use client"; // This is a client component 👈🏽

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { TextField } from "@mui/material";
import { articleSearchQuery } from "../../firebase/firestore/queries";
import { Box, Typography, Stack } from "@mui/material";
import { ArticlesData } from "../../types/firestore";
import { v4 as uuidv4 } from "uuid";
import CircularProgress from "@mui/material/CircularProgress";
import { articlesBannerImage } from "../../constants/img-src";

export default function SearchPage() {
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [articles, setArticles] = useState<ArticlesData[]>([]);

  useEffect(() => {
    if (searchQuery) {
      const fetchData = async () => {
        await getDocs(articleSearchQuery(searchQuery))
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
    }
  }, [searchQuery]);

  useEffect(() => {
    // @ts-expect-error
    const { q } = searchParams.get("q");

    if (q) {
      setSearchQuery(q.toString());
    }
  }, [searchParams]);

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
                </div>
              ))}
            </Stack>
          </Box>
        </Box>
      )}
    </Box>
  );
}
