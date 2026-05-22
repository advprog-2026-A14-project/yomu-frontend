// Gamification feature barrel — re-exports all public and admin API functions
// so feature-level imports stay decoupled from the lib/api layer.
// Note: auth is localStorage-based (CSR), so these cannot be Next.js Server Actions.

export {
  getDailyMissions,
  claimMission,
  getUserAchievements,
  toggleAchievementVisibility,
  adminCreateAchievement,
  adminCreateDailyMission,
  adminUpdateDailyMission,
  adminDeleteDailyMission,
  type DailyMissionItem,
  type DailyMissionsData,
  type UserAchievementItem,
  type UserAchievementsData,
  type ToggleProfileVisibilityData,
  type CreateAchievementData,
  type CreateMissionData,
} from "@/src/lib/api/gamification";

export type { CreateAchievementPayload, CreateMissionPayload } from "@/src/types/gamification";
