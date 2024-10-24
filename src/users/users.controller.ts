import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, FilterGameUserDto, UpdateUserDto } from './dto';
import { PaginationReceivedDto } from 'src/common/dto/pagination.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

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

  @Post()
  @HttpCode(201)
  createUser(@Body() createUserDto: CreateUserDto) {
    this.usersService.createUser(createUserDto);
  }

  @Delete(':userId')
  @HttpCode(204)
  deleteUser(@Param('userId') userId: string) {
    this.usersService.deleteUser(userId);
  }

  @Patch(':userId')
  @HttpCode(204)
  blockOrUnblockUser(@Param('userId') userId: string) {
    this.usersService.blockOrUnblockUser(userId);
  }
}
