import { Controller } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, FilterGameUserDto, UpdateUserDto } from './dto';
import { PaginationReceivedDto } from 'src/common/dto/pagination.dto';
import { ValidateUserDto } from './dto/validate-user.dto';
import { GrpcMethod } from '@nestjs/microservices';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  //--------Grpc Communication

  @GrpcMethod('UsersService', 'CreateUser')
  async createUser(data: CreateUserDto) {
    await this.usersService.createUser(data);
  }

  @GrpcMethod('UsersService', 'ValidateUser')
  async validateUser(data: ValidateUserDto) {
    return await this.usersService.validateUser(data);
  }

  @GrpcMethod('UsersService', 'GetUserDetails')
  async getUserDetails({ username }: { username: string }) {
    return await this.usersService.getUserByUsername(username);
  }

  @GrpcMethod('UsersService', 'GetAllPlayers')
  async getAllPlayers(query: PaginationReceivedDto) {
    return await this.usersService.getAllUsers(query);
  }

  @GrpcMethod('UsersService', 'GetUsersByGame')
  async getUsersByGame(query: FilterGameUserDto) {
    return await this.usersService.getUsersByGameAndRank(query);
  }

  @GrpcMethod('UsersService', 'UpdateUser')
  async updateUser(data: UpdateUserDto) {
    return await this.usersService.updateUser(data);
  }

  @GrpcMethod('UsersService', 'DeleteUser')
  async deleteUser({ userId }: { userId: string }) {
    await this.usersService.deleteUser(userId);
  }

  @GrpcMethod('UsersService', 'BlockOrUnblockUser')
  async blockOrUnblockUser({ userId }: { userId: string }) {
    await this.usersService.blockOrUnblockUser(userId);
  }
}
