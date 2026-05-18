"use client";

import { useEffect, useState } from "react";

import { ReadingCatalog } from "@/src/components/bacaankuis/ReadingCatalog";
import { getArticles, type ReadingArticle } from "@/src/lib/api/reading";
import { mockArticles } from "@/src/lib/mock/bacaankuis";

const fallbackArticles: ReadingArticle[] = mockArticles.map((article) => ({
  ...article,
  source: "mock",
}));

export function ReadingCatalogClient() {
  const [articles, setArticles] = useState<ReadingArticle[]>(fallbackArticles);
  const [notice, setNotice] = useState("Memuat artikel dari Java Core...");

  useEffect(() => {
    let active = true;

    const loadArticles = async () => {
      const response = await getArticles();

      if (!active) {
        return;
      }

      if (response.success && "data" in response && response.data && response.data.length > 0) {
        setArticles(response.data);
        setNotice("Data artikel aktif dari Java Core.");
        return;
      }

      setNotice(`Memakai mock karena artikel backend belum tersedia: ${response.message}`);
    };

    loadArticles();

    return () => {
      active = false;
    };
  }, []);

  return <ReadingCatalog articles={articles} notice={notice} />;
}
