"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Shield, SquarePen, Trash2 } from "lucide-react";

import {
  adminCreateQuiz,
  adminDeleteArticle,
  adminDeleteQuiz,
  adminUpdateQuiz,
} from "@/src/lib/api/bacaankuis";
import { Button } from "@/src/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/src/components/ui/alert-dialog";
import { Card, CardContent } from "@/src/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog";
import { Input } from "@/src/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs";
import { Textarea } from "@/src/components/ui/textarea";
import type { QuizCreateRequest, QuizQuestion } from "@/src/lib/bacaankuis";

type Props = {
  articleId: string;
  articleTitle: string;
  adminName: string;
  quizzes: QuizQuestion[];
};

type QuizDraft = QuizCreateRequest & {
  localId: string;
};

const createEmptyDraft = (index: number): QuizDraft => ({
  localId: `draft-${Date.now()}-${index}`,
  id: "",
  question: "",
  options: "",
  answer: "",
});

const emptyEditState = {
  quizId: "",
  question: "",
  options: "",
  answer: "",
};

export function ArticleAdminPanel({ articleId, articleTitle, adminName, quizzes }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"create" | "edit">("create");
  const [drafts, setDrafts] = useState<QuizDraft[]>([createEmptyDraft(0)]);
  const [editState, setEditState] = useState(emptyEditState);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busyAction, setBusyAction] = useState<string | null>(null);

  const sortedQuizzes = useMemo(
    () => [...quizzes].sort((left, right) => left.id.localeCompare(right.id)),
    [quizzes],
  );

  const resetMessages = () => {
    setFeedback(null);
    setError(null);
  };

  const addDraft = () => {
    setDrafts((current) => [...current, createEmptyDraft(current.length)]);
  };

  const removeDraft = (localId: string) => {
    setDrafts((current) => (current.length === 1 ? current : current.filter((draft) => draft.localId !== localId)));
  };

  const updateDraft = (localId: string, field: keyof QuizCreateRequest, value: string) => {
    setDrafts((current) =>
      current.map((draft) => (draft.localId === localId ? { ...draft, [field]: value } : draft)),
    );
  };

  const submitDrafts = async () => {
    resetMessages();
    setBusyAction("create");

    for (const draft of drafts) {
      const response = await adminCreateQuiz(articleId, {
        id: draft.id,
        question: draft.question,
        options: draft.options,
        answer: draft.answer,
      });

      if (!response.success) {
        setBusyAction(null);
        setError(`Gagal menambahkan soal ${draft.id || "(tanpa ID)"}: ${response.message}`);
        return;
      }
    }

    setBusyAction(null);
    setFeedback(`${drafts.length} soal berhasil ditambahkan ke artikel ini.`);
    setDrafts([createEmptyDraft(0)]);
    router.refresh();
  };

  const beginEditQuiz = (quiz: QuizQuestion) => {
    setActiveTab("edit");
    setEditState({
      quizId: quiz.id,
      question: quiz.question,
      options: quiz.options,
      answer: "",
    });
    setOpen(true);
  };

  const saveQuizUpdate = async () => {
    if (!editState.quizId.trim()) {
      setError("Pilih soal yang ingin diperbarui terlebih dulu.");
      return;
    }

    resetMessages();
    setBusyAction("edit");

    const response = await adminUpdateQuiz(editState.quizId, {
      question: editState.question,
      options: editState.options,
      answer: editState.answer,
    });

    setBusyAction(null);

    if (!response.success) {
      setError(response.message);
      return;
    }

    setFeedback("Soal berhasil diperbarui.");
    router.refresh();
  };

  const removeQuiz = async (quizId: string) => {
    resetMessages();
    setBusyAction(`delete-quiz-${quizId}`);

    const response = await adminDeleteQuiz(quizId);

    setBusyAction(null);

    if (!response.success) {
      setError(response.message);
      return;
    }

    setFeedback(`Soal ${quizId} berhasil dihapus.`);
    router.refresh();
  };

  const removeArticle = async () => {
    resetMessages();
    setBusyAction("delete-article");

    const response = await adminDeleteArticle(articleId);

    setBusyAction(null);

    if (!response.success) {
      setError(response.message);
      return;
    }

    router.push("/bacaankuis");
    router.refresh();
  };

  return (
    <Card className="overflow-hidden border-emerald-900/10 bg-white/92 shadow-[0_22px_50px_-35px_rgba(39,88,62,0.45)]">
      <CardContent className="space-y-5 p-5">
        <div className="flex flex-col gap-4 rounded-[1.5rem] bg-emerald-50/80 p-4 md:flex-row md:items-start md:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-emerald-700 p-2 text-white">
                <Shield className="size-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-emerald-950">Mode admin aktif</p>
                <p className="text-xs text-emerald-900/75">Kelola kuis artikel ini langsung dari konteks bacaannya, {adminName}.</p>
              </div>
            </div>
            <p className="text-sm leading-6 text-emerald-950/80">
              Tambah banyak soal sekaligus, sunting soal yang sudah ada, atau hapus artikel tanpa keluar dari halaman ini.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Dialog
              open={open}
              onOpenChange={(nextOpen) => {
                setOpen(nextOpen);
                if (!nextOpen) {
                  setActiveTab("create");
                  setError(null);
                  setFeedback(null);
                }
              }}
            >
              <DialogTrigger asChild>
                <Button className="rounded-full bg-emerald-700 text-white hover:bg-emerald-800">
                  <Plus className="size-4" />
                  Kelola Soal
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-6xl rounded-[2rem] border-0 bg-[#fffdf8] p-0 shadow-[0_35px_90px_-40px_rgba(60,88,68,0.5)]">
                <div className="grid min-h-[70vh] gap-0 lg:grid-cols-[0.95fr_1.25fr]">
                  <div className="border-b border-zinc-200/70 bg-zinc-950 px-7 py-8 text-white lg:border-r lg:border-b-0">
                    <DialogHeader className="space-y-3 text-left">
                      <DialogTitle className="text-2xl">Studio kuis artikel</DialogTitle>
                      <DialogDescription className="text-sm leading-6 text-zinc-400">
                        {articleTitle}
                      </DialogDescription>
                    </DialogHeader>

                    <div className="mt-8 space-y-4">
                      <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                        <p className="text-xs tracking-[0.18em] text-zinc-400 uppercase">Ringkasan</p>
                        <p className="mt-3 text-3xl font-semibold">{sortedQuizzes.length}</p>
                        <p className="mt-2 text-sm leading-6 text-zinc-400">Soal yang saat ini sudah terpasang pada artikel ini.</p>
                      </div>

                      <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4 text-sm leading-6 text-zinc-400">
                        <p>Format `options` tetap memakai titik koma seperti kontrak backend: `A;B;C;D`.</p>
                        <p className="mt-2">Karena public quiz endpoint tidak mengirim jawaban benar, tab edit akan mengisi pertanyaan dan opsi dari data yang ada, lalu jawaban benar perlu kamu isi ulang saat menyimpan.</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-5 px-7 py-8">
                    <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "create" | "edit")} className="space-y-5">
                      <TabsList className="grid w-full grid-cols-2 rounded-full bg-zinc-100 p-1">
                        <TabsTrigger value="create" className="rounded-full">Tambah beberapa soal</TabsTrigger>
                        <TabsTrigger value="edit" className="rounded-full">Sunting soal yang ada</TabsTrigger>
                      </TabsList>

                      <TabsContent value="create" className="space-y-5">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-lg font-semibold text-zinc-950">Batch builder</p>
                            <p className="text-sm text-zinc-500">Tambah beberapa pertanyaan dulu, lalu kirim sekaligus.</p>
                          </div>
                          <Button type="button" variant="outline" className="rounded-full" onClick={addDraft}>
                            <Plus className="size-4" />
                            Tambah slot pertanyaan
                          </Button>
                        </div>

                        <div className="max-h-[48vh] space-y-4 overflow-y-auto pr-1">
                          {drafts.map((draft, index) => (
                            <div key={draft.localId} className="rounded-[1.5rem] border border-zinc-200 bg-white p-5">
                              <div className="flex items-center justify-between">
                                <p className="text-sm font-medium text-zinc-900">Pertanyaan {index + 1}</p>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  className="rounded-full text-zinc-500 hover:text-zinc-900"
                                  onClick={() => removeDraft(draft.localId)}
                                  disabled={drafts.length === 1}
                                >
                                  Hapus slot
                                </Button>
                              </div>

                              <div className="mt-4 grid gap-4">
                                <Input
                                  placeholder="Quiz ID, mis. quiz-olahraga-01"
                                  value={draft.id}
                                  onChange={(event) => updateDraft(draft.localId, "id", event.target.value)}
                                />
                                <Textarea
                                  rows={3}
                                  placeholder="Tulis pertanyaan"
                                  value={draft.question}
                                  onChange={(event) => updateDraft(draft.localId, "question", event.target.value)}
                                />
                                <Input
                                  placeholder="Pilihan dipisah titik koma, mis. Sprint;Maraton;Renang;Sepak bola"
                                  value={draft.options}
                                  onChange={(event) => updateDraft(draft.localId, "options", event.target.value)}
                                />
                                <Input
                                  placeholder="Jawaban benar"
                                  value={draft.answer}
                                  onChange={(event) => updateDraft(draft.localId, "answer", event.target.value)}
                                />
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="flex justify-end">
                          <Button
                            type="button"
                            className="rounded-full bg-zinc-950 text-white hover:bg-zinc-800"
                            onClick={submitDrafts}
                            disabled={busyAction === "create"}
                          >
                            {busyAction === "create" ? "Menyimpan batch..." : "Simpan Semua Soal Baru"}
                          </Button>
                        </div>
                      </TabsContent>

                      <TabsContent value="edit" className="space-y-5">
                        <div>
                          <p className="text-lg font-semibold text-zinc-950">Soal yang sudah ada</p>
                          <p className="text-sm text-zinc-500">Klik satu soal untuk langsung memuat form edit.</p>
                        </div>

                        <div className="grid max-h-[24vh] gap-3 overflow-y-auto pr-1">
                          {sortedQuizzes.length === 0 ? (
                            <div className="rounded-[1.5rem] border border-dashed border-zinc-300 bg-zinc-50 px-4 py-5 text-sm text-zinc-500">
                              Belum ada soal pada artikel ini.
                            </div>
                          ) : null}

                          {sortedQuizzes.map((quiz) => (
                            <div
                              key={quiz.id}
                              className="flex flex-col gap-3 rounded-[1.5rem] border border-zinc-200 bg-white p-4 md:flex-row md:items-start md:justify-between"
                            >
                              <div className="space-y-2">
                                <p className="text-xs tracking-[0.18em] text-zinc-500 uppercase">{quiz.id}</p>
                                <p className="font-medium text-zinc-950">{quiz.question}</p>
                                <p className="text-sm text-zinc-500">{quiz.options}</p>
                              </div>

                              <div className="flex gap-2">
                                <Button type="button" variant="outline" className="rounded-full" onClick={() => beginEditQuiz(quiz)}>
                                  <SquarePen className="size-4" />
                                  Edit
                                </Button>

                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button type="button" variant="outline" className="rounded-full border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800">
                                      <Trash2 className="size-4" />
                                      Hapus
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent className="rounded-[1.5rem]">
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Hapus soal ini?</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Soal `{quiz.id}` akan dihapus dari artikel ini dan tidak bisa dipakai lagi.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel className="rounded-full">Batal</AlertDialogCancel>
                                      <AlertDialogAction
                                        className="rounded-full bg-red-700 text-white hover:bg-red-800"
                                        onClick={() => removeQuiz(quiz.id)}
                                      >
                                        {busyAction === `delete-quiz-${quiz.id}` ? "Menghapus..." : "Ya, hapus soal"}
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="rounded-[1.5rem] border border-zinc-200 bg-white p-5">
                          <div className="space-y-1">
                            <p className="text-sm font-medium text-zinc-900">Form edit aktif</p>
                            <p className="text-sm text-zinc-500">Pertanyaan dan opsi bisa diprefill. Jawaban benar perlu kamu isi ulang sebelum menyimpan.</p>
                          </div>

                          <div className="mt-4 grid gap-4">
                            <Input
                              placeholder="Quiz ID"
                              value={editState.quizId}
                              onChange={(event) => setEditState((current) => ({ ...current, quizId: event.target.value }))}
                            />
                            <Textarea
                              rows={3}
                              placeholder="Pertanyaan"
                              value={editState.question}
                              onChange={(event) => setEditState((current) => ({ ...current, question: event.target.value }))}
                            />
                            <Input
                              placeholder="Pilihan dipisah titik koma"
                              value={editState.options}
                              onChange={(event) => setEditState((current) => ({ ...current, options: event.target.value }))}
                            />
                            <Input
                              placeholder="Jawaban benar"
                              value={editState.answer}
                              onChange={(event) => setEditState((current) => ({ ...current, answer: event.target.value }))}
                            />
                          </div>

                          <div className="mt-5 flex justify-end">
                            <Button
                              type="button"
                              className="rounded-full bg-zinc-950 text-white hover:bg-zinc-800"
                              onClick={saveQuizUpdate}
                              disabled={busyAction === "edit"}
                            >
                              {busyAction === "edit" ? "Menyimpan perubahan..." : "Simpan Perubahan Soal"}
                            </Button>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>

                    {error ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}
                    {feedback ? <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{feedback}</p> : null}
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="rounded-full border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800">
                  <Trash2 className="size-4" />
                  Hapus Artikel
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="rounded-[1.5rem]">
                <AlertDialogHeader>
                  <AlertDialogTitle>Hapus artikel ini?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Semua kuis yang terkait dengan `{articleId}` juga akan ikut terhapus.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="rounded-full">Batal</AlertDialogCancel>
                  <AlertDialogAction
                    className="rounded-full bg-red-700 text-white hover:bg-red-800"
                    onClick={removeArticle}
                  >
                    {busyAction === "delete-article" ? "Menghapus..." : "Ya, hapus artikel"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
