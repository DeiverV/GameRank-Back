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
  createUser(data: CreateUserDto) {
    this.usersService.createUser(data);
  }

  @GrpcMethod('UsersService', 'ValidateUser')
  validateUser(data: ValidateUserDto) {
    return this.usersService.validateUser(data);
  }

  @GrpcMethod('UsersService', 'GetUserDetails')
  getUserDetails({ username }: { username: string }) {
    return this.usersService.getUserByUsername(username);
  }

  @GrpcMethod('UsersService', 'GetAllPlayers')
  getAllPlayers(query: PaginationReceivedDto) {
    return this.usersService.getAllUsers(query);
  }

  @GrpcMethod('UsersService', 'GetUsersByGame')
  getUsersByGame(query: FilterGameUserDto) {
    return this.usersService.getUsersByGameAndRank(query);
  }

  @GrpcMethod('UsersService', 'UpdateUser')
  updateUser(data: UpdateUserDto) {
    return this.usersService.updateUser(data);
  }

  @GrpcMethod('UsersService', 'DeleteUser')
  deleteUser({ userId }: { userId: string }) {
    this.usersService.deleteUser(userId);
  }

  @GrpcMethod('UsersService', 'BlockOrUnblockUser')
  blockOrUnblockUser({ userId }: { userId: string }) {
    this.usersService.blockOrUnblockUser(userId);
  }
}
