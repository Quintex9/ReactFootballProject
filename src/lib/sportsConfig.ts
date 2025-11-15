import { Match } from "./types";
import { normalizeFootball, normalizeV1 } from "./normalize";

export type SportKey =
  | "football"
  | "nba"
  | "mlb"
  | "nfl"
  | "hockey"
  | "handball";

export interface SportConfig {
  endpoint: string;
  normalize: (item: any) => Match;
  supportsLast?: boolean;
  supportsH2H?: boolean;
}

export const SPORT_CONFIG: Record<SportKey, SportConfig> = {
  football: {
    endpoint: "https://v3.football.api-sports.io/fixtures",
    normalize: normalizeFootball,
    supportsLast: true,
    supportsH2H: true,
  },
  nba: {
    endpoint: "https://v1.basketball.api-sports.io/games",
    normalize: normalizeV1,
  },
  mlb: {
    endpoint: "https://v1.baseball.api-sports.io/games",
    normalize: normalizeV1,
  },
  nfl: {
    endpoint: "https://v1.american-football.api-sports.io/games",
    normalize: normalizeV1,
  },
  hockey: {
    endpoint: "https://v1.hockey.api-sports.io/games",
    normalize: normalizeV1,
  },
  handball: {
    endpoint: "https://v1.handball.api-sports.io/games",
    normalize: normalizeV1,
  },
};

export function resolveSport(key: string | null | undefined): SportKey {
  const fallback: SportKey = "football";
  if (!key) return fallback;
  const typed = key as SportKey;
  return Object.prototype.hasOwnProperty.call(SPORT_CONFIG, typed)
    ? typed
    : fallback;
}

export function extractList(raw: any) {
  const list =
    raw?.response?.games ??
    raw?.games ??
    raw?.response ??
    raw?.fixtures ??
    [];

  return Array.isArray(list) ? list : [];
}


