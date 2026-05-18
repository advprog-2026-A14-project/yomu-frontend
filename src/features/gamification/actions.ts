export type Mission = {
  id: string;
  title: string;
  description: string;
  progress: number;
  target: number;
  status: "locked" | "active" | "claimable" | "claimed";
};

export type Achievement = {
  id: string;
  title: string;
  description: string;
  earned_at?: string | null;
  rarity: "common" | "rare" | "epic" | "legendary";
};
