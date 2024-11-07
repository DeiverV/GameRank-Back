import { Inject, Injectable } from '@nestjs/common';

import { DetailsUser, UserSummary } from './entities';
import { CreateUserDto, UpdateUserDto } from './dto';
import { FilterGameUserDto } from './dto/filter-game-user.dto';
import {
  PaginationReceivedDto,
  PaginatorDto,
} from 'src/common/dto/pagination.dto';
import { ValidateUserDto } from './dto/validate-user.dto';
import { ClientGrpc, RpcException } from '@nestjs/microservices';
import { PrismaService } from '../prisma/prisma.service';
import { ScoresService } from './interfaces/scores.service';
import { SupabaseClient } from '@supabase/supabase-js';
import { supabase } from 'src/supabase';

@Injectable()
export class UsersService {
  private scoresService: ScoresService;
  private readonly supabase: SupabaseClient;

  constructor(
    private readonly prismaService: PrismaService,
    @Inject('SCORES_PACKAGE') private readonly grpcClient: ClientGrpc,
  ) {
    this.supabase = supabase;
  }

  onModuleInit() {
    this.scoresService =
      this.grpcClient.getService<ScoresService>('ScoresService');
  }

  async getAllUsers({
    limit,
    page,
  }: PaginationReceivedDto): Promise<PaginatorDto<DetailsUser>> {
    const filters = {
      isActive: true,
      role: 'PLAYER',
    };

    const fullCount = await this.prismaService.user.count({
      where: filters,
    });

    const allUsers = await this.prismaService.user.findMany({
      skip: page * limit - limit,
      take: limit,
      where: filters,
      select: {
        email: true,
        id: true,
        image: true,
        isBlocked: true,
        name: true,
        role: true,
        username: true,
      },
    });

    return {
      data: allUsers,
      limit,
      page,
      totalCount: fullCount,
      totalPages: Math.ceil(fullCount / limit),
    };
  }

  async validateUser({ password, email }: ValidateUserDto) {
    const user = await this.prismaService.user.findUnique({
      where: {
        password,
        email,
      },
    });

    return user;
  }

  async getUserByUsername(username: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        username,
      },
    });

    if (!user) throw new RpcException('User was not found!');

    const detailsUser = {
      email: user.email,
      id: user.id,
      image: user.image,
      isBlocked: user.isBlocked,
      name: user.name,
      role: user.role,
      username: user.username,
    };

    return detailsUser;
  }

  async createUser(createUserDto: CreateUserDto) {
    await this.prismaService.user.create({
      data: {
        email: createUserDto.email,
        name: createUserDto.name,
        username: createUserDto.username,
        password: createUserDto.password,
        image: null,
        role: 'PLAYER',
      },
    });
  }

  async updateUser(updateUserDto: UpdateUserDto) {
    const { data: uploadingData } = await supabase.storage
      .from('bootcamp')
      .upload(
        `public/${updateUserDto.username}-profilePic`,
        updateUserDto.image,
        {
          cacheControl: '3000',
          upsert: false,
        },
      );

    const { data } = supabase.storage
      .from('bootcamp')
      .getPublicUrl(uploadingData.path);

    await this.prismaService.user.update({
      where: { id: updateUserDto.userId },
      data: {
        image: data.publicUrl,
        username: updateUserDto.username,
      },
    });

    const user = this.prismaService.user.findUnique({
      where: { id: updateUserDto.userId },
    });

    return user;
  }

  async getUsersByGameAndRank(
    filterDto: FilterGameUserDto,
  ): Promise<PaginatorDto<UserSummary>> {
    const scores = await this.scoresService.getUsersRankingByGame(filterDto);
    const { data, limit, page, totalCount, totalPages } = scores;

    const leaderBoard = await Promise.all(
      data.map(async (score) => {
        const user = await this.prismaService.user.findUnique({
          where: { id: score.userId },
        });
        return {
          name: user.name,
          username: user.username,
          image: user.image,
          email: user.email,
          highestScore: score.score,
          game: filterDto.game,
        };
      }),
    );

    return {
      data: leaderBoard,
      limit,
      page,
      totalCount,
      totalPages,
    };
  }

  async blockOrUnblockUser(id: string) {
    return await this.prismaService.user.update({
      where: { id },
      data: { isBlocked: true },
    });
  }

  async deleteUser(id: string) {
    return await this.prismaService.user.delete({ where: { id } });
  }
}
