import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Put,
  Query,
} from '@nestjs/common';
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
  createUser(@Body() createUserDto: CreateUserDto) {
    this.usersService.createUser(createUserDto);
  }

  @GrpcMethod('UsersService', 'ValidateUser')
  validateUser(@Body() validateUser: ValidateUserDto) {
    return this.usersService.validateUser(validateUser);
  }

  //---------REST Communication

  @Get(':username')
  getUserDetails(@Param('username') username: string) {
    return this.usersService.getUserByUsername(username);
  }

  @Get('/admin')
  getAllPlayers(@Query() query: PaginationReceivedDto) {
    return this.usersService.getAllUsers(query);
  }

  @Get('/leaderboard')
  getUsersByGame(@Query() query: FilterGameUserDto) {
    return this.usersService.getUsersByGameAndRank(query);
  }

  @Put(':userId')
  updateUser(
    @Param('userId') userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateUser(userId, updateUserDto);
  }

  @Delete(':userId')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteUser(@Param('userId') userId: string) {
    this.usersService.deleteUser(userId);
  }

  @Patch(':userId')
  @HttpCode(HttpStatus.NO_CONTENT)
  blockOrUnblockUser(@Param('userId') userId: string) {
    this.usersService.blockOrUnblockUser(userId);
  }
}
