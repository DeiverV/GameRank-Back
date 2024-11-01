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
import { RpcException } from '@nestjs/microservices';
// import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class UsersService {
  private users: User[] = [];
  // private readonly prismaService: PrismaService
  constructor() {
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
      .filter((user) => user.role === 'PLAYER' && user.isActive)
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

  getUserByUsername(username: string) {
    const user = this.users.find((user) => user.username === username);

    if (!user) throw new RpcException('User was not found!');

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
    const userIndex = this.users.findIndex((user) =>
      user?.id ? user?.id === updateUserDto.userId : false,
    );

    if (userIndex === -1) throw new RpcException('User was not found!');

    // const buffer = Buffer.from(updateUserDto.image, 'base64');
    this.users[userIndex] = {
      ...this.users[userIndex],
      username: updateUserDto.username,
      image: `${updateUserDto.username}-profilePic`,
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

  blockOrUnblockUser(id: string) {
    const userIndex = this.users.findIndex((user) => user.id === id);
    if (userIndex !== -1) {
      this.users[userIndex] = {
        ...this.users[userIndex],
        isBlocked: !this.users[userIndex].isBlocked,
      };
    }
  }

  deleteUser(id: string): void {
    const userIndex = this.users.findIndex((user) => user.id === id);
    if (userIndex !== -1) {
      this.users[userIndex] = {
        ...this.users[userIndex],
        isActive: false,
      };
    }
  }
}
