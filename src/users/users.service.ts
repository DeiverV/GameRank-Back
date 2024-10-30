import { Injectable } from '@nestjs/common';
import { faker } from '@faker-js/faker';
import { v4 as uuidv4 } from 'uuid';

import { DetailsUser, User, UserSummary } from './entities';
import { CreateUserDto, UpdateUserDto } from './dto';
import { FilterGameUserDto } from './dto/filter-game-user.dto';
import {
  PaginationReceivedDto,
  PaginatorDto,
} from 'src/common/dto/pagination.dto';
import { ValidateUserDto } from './dto/validate-user.dto';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class UsersService {
  private users: User[] = [];

  constructor(private readonly prismaService: PrismaService) {
    this.generateMockData();
  }

  private generateMockData(): void {
    for (let i = 0; i < 1000; i++) {
      this.users.push({
        id: uuidv4(),
        email: faker.internet.email(),
        image: faker.internet.url(),
        isActive: true,
        isBlocked: false,
        name: faker.internet.userName(),
        password: faker.internet.password(),
        role: 'PLAYER',
        username: faker.internet.userName(),
      });
    }
  }

  getAllUsers({
    limit,
    page,
  }: PaginationReceivedDto): PaginatorDto<DetailsUser> {
    const allUsers: DetailsUser[] = this.users
      .filter((user) => user.role === 'PLAYER')
      .slice(page * limit - limit, page * limit)
      .map((user) => ({
        email: user.email,
        highestScore: Math.random(),
        id: user.id,
        image: user.image,
        isBlocked: user.isBlocked,
        name: user.name,
        rank: Math.random(),
        role: user.role,
        username: user.username,
      }));

    return {
      data: allUsers,
      limit,
      page,
      totalCount: this.users.length,
      totalPages: Math.ceil(this.users.length / limit),
    };
  }

  validateUser({ password, email }: ValidateUserDto) {
    const user = this.users.find(
      (user) => user.email === email && user.password === password,
    );

    return user;
  }

  getUserByUsername(id: string): DetailsUser {
    const user = this.users.find((user) => user.id === id);
    const detailsUser = {
      email: user.email,
      highestScore: Math.random(),
      id: user.id,
      image: user.image,
      isBlocked: user.isBlocked,
      name: user.name,
      rank: Math.random(),
      role: user.role,
      username: user.username,
    };

    return detailsUser;
  }

  createUser(createUserDto: CreateUserDto) {
    const newUser: User = {
      id: uuidv4(),
      isActive: true,
      isBlocked: true,
      role: 'PLAYER',
      ...createUserDto,
    };

    this.users.push(newUser);
  }

  updateUser(updateUserDto: UpdateUserDto): User {
    const userIndex = this.users.findIndex(
      (user) => user.id === updateUserDto.userId,
    );
    if (userIndex === -1) {
      return null;
    }

    this.users[userIndex] = {
      ...this.users[userIndex],
      username: updateUserDto.username,
      image: updateUserDto.image.name,
    };

    return this.users[userIndex];
  }

  getUsersByGameAndRank(
    filterDto: FilterGameUserDto,
  ): PaginatorDto<UserSummary> {
    // const scoresRanking = call Ms of Scores(filterDto)

    const { data, limit, page, totalCount, totalPages } = {
      data: [{ score: 100, userId: uuidv4() }],
      limit: 5,
      page: 1,
      totalCount: 1,
      totalPages: 1,
    };

    const leaderboard: UserSummary[] = data.map((score) => {
      const user = this.users.find((user) => user.id === score.userId);
      return {
        name: user.name,
        username: user.username,
        image: user.image,
        email: user.email,
        highestScore: score.score,
        game: filterDto.game,
      };
    });

    return {
      data: leaderboard,
      limit,
      page,
      totalCount,
      totalPages,
    };
  }

  blockOrUnblockUser(id: string): User {
    const userIndex = this.users.findIndex((user) => user.id === id);
    if (userIndex === -1) {
      return null;
    }

    this.users[userIndex] = {
      ...this.users[userIndex],
      isBlocked: !this.users[userIndex].isBlocked,
    };

    return this.users[userIndex];
  }

  deleteUser(id: string): void {
    const userIndex = this.users.findIndex((user) => user.id === id);
    if (userIndex === -1) {
      return null;
    }

    this.users[userIndex] = {
      ...this.users[userIndex],
      isActive: false,
    };
  }
}
