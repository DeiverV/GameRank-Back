import { Injectable } from '@nestjs/common';
import { Score } from './entities';
import { faker } from '@faker-js/faker';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ScoresService {
  private scores: Score[] = [];

  constructor() {
    this.generateMockData();
  }

  private generateMockData(): void {
    for (let i = 0; i < 1000; i++) {
      this.scores.push({
        id: uuidv4(),
        createdAt: faker.date.anytime().toUTCString(),
        game: faker.vehicle.model(),
        score: faker.number.int(),
        userId: uuidv4()
      });
    }
  }
}
