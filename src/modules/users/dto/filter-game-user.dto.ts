import { PaginationReceivedDto } from 'src/common/dto/pagination.dto';

export class FilterGameUserDto extends PaginationReceivedDto {
  readonly game: string;
}
