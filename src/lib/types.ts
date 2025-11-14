// Rozhranie pre tím
export interface Team {
    id : number;
    name : string;
    logo : string;
}

// Rozhranie pre zápas
export interface Match {
  fixture: {
    id: number;
    date: string; 
    status: {
      long: string;  
      short: string;  
      elapsed: number;
    };
  };
  league: {
    id: number;
    name: string;
    logo: string;
  };
  teams: {
    home: Team; 
    away: Team; 
  };
  goals: {
    home: number | null; 
    away: number | null; 
  };
}

// Rozhranie pre odpoveď z API
export interface ApiResponse {
  sport: string;
  response: Match[]; 
}

