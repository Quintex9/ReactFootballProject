// Rozhranie pre tím
export interface Team {
    id : number | string;
    name : string;
    logo : string | null;
}

// Rozhranie pre zápas, funkčnosť pre všetky športy
export interface Match {
  id: number | string;
  date: string;
  season?: number | string;
  venue?: string;

  league: {
    id: number | string;
    name: string;
    logo: string | null;
  };

  status: {
    long: string;
    short: string;
    elapsed: number | null;
  };

  home: Team;
  away: Team;

  score: {
    home: number | null;
    away: number | null;
  };
}

// Rozhranie pre odpoveď z API
export interface ApiResponse {
  sport: string;
  response: Match[]; 
}

