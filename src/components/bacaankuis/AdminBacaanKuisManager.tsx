"use client";

import { useEffect, useMemo, useState } from "react";

import {
  adminCreateArticle,
  adminCreateQuiz,
  adminDeleteArticle,
  adminDeleteQuiz,
  adminUpdateQuiz,
  getArticles,
  getQuizzes,
} from "@/src/lib/api/bacaankuis";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import type { Article, QuizQuestion } from "@/src/lib/bacaankuis";

type Props = {
  adminName: string;
};

const emptyArticleForm = {
  id: "",
  title: "",
  content: "",
  category: "",
};

const emptyQuizForm = {
  id: "",
  question: "",
  options: "",
  answer: "",
};

const emptyQuizUpdateForm = {
  quizId: "",
  question: "",
  options: "",
  answer: "",
};

export function AdminBacaanKuisManager({ adminName }: Props) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedArticleId, setSelectedArticleId] = useState("");
  const [quizzes, setQuizzes] = useState<QuizQuestion[]>([]);
  const [articleForm, setArticleForm] = useState(emptyArticleForm);
  const [quizForm, setQuizForm] = useState(emptyQuizForm);
  const [quizUpdateForm, setQuizUpdateForm] = useState(emptyQuizUpdateForm);
  const [deleteQuizId, setDeleteQuizId] = useState("");
  const [deleteArticleId, setDeleteArticleId] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingArticles, setLoadingArticles] = useState(true);
  const [busyKey, setBusyKey] = useState<string | null>(null);

  const articleOptions = useMemo(
    () => articles.map((article) => ({ id: article.id, title: article.title })),
    [articles],
  );

  const loadArticles = async () => {
    setLoadingArticles(true);
    const response = await getArticles();
    setLoadingArticles(false);

    if (!response.success || !("data" in response) || !response.data) {
      setError(response.message);
      return;
    }

    setArticles(response.data);
    setError(null);
  };

  const loadQuizzes = async (articleId: string) => {
    if (!articleId) {
      setQuizzes([]);
      return;
    }

    const response = await getQuizzes(articleId);

    if (!response.success || !("data" in response) || !response.data) {
      setError(response.message);
      setQuizzes([]);
      return;
    }

    setQuizzes(response.data);
    setError(null);
  };

  useEffect(() => {
    let active = true;

    const run = async () => {
      setLoadingArticles(true);
      const response = await getArticles();

      if (!active) {
        return;
      }

      setLoadingArticles(false);

      if (!response.success || !("data" in response) || !response.data) {
        setError(response.message);
        return;
      }

      setArticles(response.data);
      setError(null);
    };

    void run();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;

    const run = async () => {
      if (!selectedArticleId) {
        setQuizzes([]);
        return;
      }

      const response = await getQuizzes(selectedArticleId);

      if (!active) {
        return;
      }

      if (!response.success || !("data" in response) || !response.data) {
        setError(response.message);
        setQuizzes([]);
        return;
      }

      setQuizzes(response.data);
      setError(null);
    };

    void run();

    return () => {
      active = false;
    };
  }, [selectedArticleId]);

  const resetMessages = () => {
    setFeedback(null);
    setError(null);
  };

  const handleCreateArticle = async () => {
    resetMessages();
    setBusyKey("create-article");

    const response = await adminCreateArticle(articleForm);
    setBusyKey(null);

    if (!response.success) {
      setError(response.message);
      return;
    }

    setFeedback("Artikel berhasil dibuat.");
    setArticleForm(emptyArticleForm);
    await loadArticles();
  };

  const handleCreateQuiz = async () => {
    if (!selectedArticleId) {
      setError("Pilih artikel dulu untuk menambahkan kuis.");
      return;
    }

    resetMessages();
    setBusyKey("create-quiz");

    const response = await adminCreateQuiz(selectedArticleId, quizForm);
    setBusyKey(null);

    if (!response.success) {
      setError(response.message);
      return;
    }

    setFeedback("Kuis berhasil dibuat.");
    setQuizForm(emptyQuizForm);
    await loadQuizzes(selectedArticleId);
  };

  const handleUpdateQuiz = async () => {
    if (!quizUpdateForm.quizId.trim()) {
      setError("Quiz ID wajib diisi untuk edit.");
      return;
    }

    resetMessages();
    setBusyKey("update-quiz");

    const response = await adminUpdateQuiz(quizUpdateForm.quizId.trim(), {
      question: quizUpdateForm.question,
      options: quizUpdateForm.options,
      answer: quizUpdateForm.answer,
    });
    setBusyKey(null);

    if (!response.success) {
      setError(response.message);
      return;
    }

    setFeedback("Kuis berhasil diperbarui.");
    if (selectedArticleId) {
      await loadQuizzes(selectedArticleId);
    }
  };

  const handleDeleteQuiz = async () => {
    if (!deleteQuizId.trim()) {
      setError("Quiz ID wajib diisi untuk hapus.");
      return;
    }

    resetMessages();
    setBusyKey("delete-quiz");

    const response = await adminDeleteQuiz(deleteQuizId.trim());
    setBusyKey(null);

    if (!response.success) {
      setError(response.message);
      return;
    }

    setFeedback("Kuis berhasil dihapus.");
    setDeleteQuizId("");
    if (selectedArticleId) {
      await loadQuizzes(selectedArticleId);
    }
  };

  const handleDeleteArticle = async () => {
    if (!deleteArticleId.trim()) {
      setError("Article ID wajib diisi untuk hapus.");
      return;
    }

    resetMessages();
    setBusyKey("delete-article");

    const response = await adminDeleteArticle(deleteArticleId.trim());
    setBusyKey(null);

    if (!response.success) {
      setError(response.message);
      return;
    }

    setFeedback("Artikel berhasil dihapus.");
    if (selectedArticleId === deleteArticleId.trim()) {
      setSelectedArticleId("");
      setQuizzes([]);
    }
    setDeleteArticleId("");
    await loadArticles();
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">Hello Admin, {adminName}</h1>
        <p className="text-sm text-zinc-500">
          Kelola artikel dan kuis langsung dari frontend. Semua action di sini memakai endpoint admin backend.
        </p>
      </div>

      {feedback ? <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{feedback}</p> : null}
      {error ? <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Buat Artikel</CardTitle>
            <CardDescription>Tambahkan bacaan baru ke katalog publik.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Article ID, mis. art-010"
              value={articleForm.id}
              onChange={(event) => setArticleForm((current) => ({ ...current, id: event.target.value }))}
            />
            <Input
              placeholder="Judul Bacaan"
              value={articleForm.title}
              onChange={(event) => setArticleForm((current) => ({ ...current, title: event.target.value }))}
            />
            <Input
              placeholder="Kategori"
              value={articleForm.category}
              onChange={(event) => setArticleForm((current) => ({ ...current, category: event.target.value }))}
            />
            <Textarea
              placeholder="Isi bacaan"
              rows={8}
              value={articleForm.content}
              onChange={(event) => setArticleForm((current) => ({ ...current, content: event.target.value }))}
            />
            <Button
              type="button"
              onClick={handleCreateArticle}
              disabled={busyKey === "create-article"}
            >
              {busyKey === "create-article" ? "Membuat..." : "Buat Artikel"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Daftar Artikel</CardTitle>
            <CardDescription>Pilih artikel untuk menambah atau meninjau kuisnya.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {loadingArticles ? <p className="text-sm text-zinc-500">Memuat artikel...</p> : null}
            <div className="grid gap-3">
              {articleOptions.map((article) => (
                <button
                  key={article.id}
                  type="button"
                  className={`rounded-xl border px-4 py-3 text-left transition ${
                    selectedArticleId === article.id
                      ? "border-zinc-950 bg-zinc-950 text-white"
                      : "border-zinc-200 bg-white text-zinc-800 hover:border-zinc-300"
                  }`}
                  onClick={() => setSelectedArticleId(article.id)}
                >
                  <p className="text-xs uppercase opacity-70">{article.id}</p>
                  <p className="mt-1 font-medium">{article.title}</p>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Tambah Kuis</CardTitle>
            <CardDescription>
              {selectedArticleId
                ? `Artikel aktif: ${selectedArticleId}`
                : "Pilih artikel dari daftar agar kuis bisa ditautkan."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Quiz ID, mis. quiz-010"
              value={quizForm.id}
              onChange={(event) => setQuizForm((current) => ({ ...current, id: event.target.value }))}
            />
            <Textarea
              placeholder="Pertanyaan"
              rows={3}
              value={quizForm.question}
              onChange={(event) => setQuizForm((current) => ({ ...current, question: event.target.value }))}
            />
            <Input
              placeholder="Options dipisah titik koma, mis. A;B;C;D"
              value={quizForm.options}
              onChange={(event) => setQuizForm((current) => ({ ...current, options: event.target.value }))}
            />
            <Input
              placeholder="Jawaban benar"
              value={quizForm.answer}
              onChange={(event) => setQuizForm((current) => ({ ...current, answer: event.target.value }))}
            />
            <Button type="button" onClick={handleCreateQuiz} disabled={busyKey === "create-quiz"}>
              {busyKey === "create-quiz" ? "Membuat..." : "Buat Kuis"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Kuis Artikel Terpilih</CardTitle>
            <CardDescription>
              Backend publik tidak mengirim jawaban benar, jadi panel ini dipakai untuk konteks ID dan soal.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {!selectedArticleId ? <p className="text-sm text-zinc-500">Belum ada artikel yang dipilih.</p> : null}
            {selectedArticleId && quizzes.length === 0 ? (
              <p className="text-sm text-zinc-500">Belum ada kuis untuk artikel ini.</p>
            ) : null}
            {quizzes.map((quiz) => (
              <div key={quiz.id} className="rounded-xl border border-zinc-200 p-4">
                <p className="text-xs uppercase text-zinc-500">{quiz.id}</p>
                <p className="mt-1 font-medium text-zinc-900">{quiz.question}</p>
                <p className="mt-2 text-sm text-zinc-500">{quiz.options}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Edit Kuis</CardTitle>
            <CardDescription>
              Isi ulang seluruh field karena endpoint admin update tidak punya GET detail jawaban benar.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Quiz ID"
              value={quizUpdateForm.quizId}
              onChange={(event) =>
                setQuizUpdateForm((current) => ({ ...current, quizId: event.target.value }))
              }
            />
            <Textarea
              placeholder="Pertanyaan baru"
              rows={3}
              value={quizUpdateForm.question}
              onChange={(event) =>
                setQuizUpdateForm((current) => ({ ...current, question: event.target.value }))
              }
            />
            <Input
              placeholder="Options dipisah titik koma"
              value={quizUpdateForm.options}
              onChange={(event) =>
                setQuizUpdateForm((current) => ({ ...current, options: event.target.value }))
              }
            />
            <Input
              placeholder="Jawaban benar baru"
              value={quizUpdateForm.answer}
              onChange={(event) =>
                setQuizUpdateForm((current) => ({ ...current, answer: event.target.value }))
              }
            />
            <Button type="button" onClick={handleUpdateQuiz} disabled={busyKey === "update-quiz"}>
              {busyKey === "update-quiz" ? "Menyimpan..." : "Simpan Perubahan Kuis"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Danger Zone</CardTitle>
            <CardDescription>Hapus artikel atau kuis bila memang perlu.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-3">
              <p className="text-sm font-medium">Hapus Kuis</p>
              <Input
                placeholder="Quiz ID"
                value={deleteQuizId}
                onChange={(event) => setDeleteQuizId(event.target.value)}
              />
              <Button type="button" variant="outline" onClick={handleDeleteQuiz} disabled={busyKey === "delete-quiz"}>
                {busyKey === "delete-quiz" ? "Menghapus..." : "Hapus Kuis"}
              </Button>
            </div>

            <div className="space-y-3 border-t border-zinc-100 pt-5">
              <p className="text-sm font-medium">Hapus Artikel</p>
              <Input
                placeholder="Article ID"
                value={deleteArticleId}
                onChange={(event) => setDeleteArticleId(event.target.value)}
              />
              <Button type="button" variant="outline" onClick={handleDeleteArticle} disabled={busyKey === "delete-article"}>
                {busyKey === "delete-article" ? "Menghapus..." : "Hapus Artikel"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
