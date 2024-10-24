export type UserRole = 'PLAYER' | 'ADMIN'

export class User {
  id: string;
  name: string;
  username: string;
  password: string;
  email: string;
  image?: string;
  role: UserRole;
  isBlocked: boolean;
  isActive: boolean;
}

export class DetailsUser {
  id: string;
  name: string;
  username: string;
  email: string;
  image: string;
  role: string;
  isBlocked: boolean;
  rank: number;
  highestScore: number;
}

export class UserSummary {
  name: string;
  username: string;
  image: string;
  email: string;
  game: string;
  highestScore: number;
}
