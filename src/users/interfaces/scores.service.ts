export interface UserBestScore {
  score: number;
  userId: string;
}
export interface UsersScoreRanking {
  data: UserBestScore[];
  limit: number;
  page: number;
  totalCount: number;
  totalPages: number;
}

export interface GetUsersRankingRequest {
  page: number;
  limit: number;
  game: string;
}

export interface ScoresService {
  getUsersRankingByGame(
    request: GetUsersRankingRequest,
  ): Promise<UsersScoreRanking>;
}
