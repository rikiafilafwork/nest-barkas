import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from './item.entity';
import { Repository } from 'typeorm';
import { CreateItemDto } from './dtos/create-item.dto';
import { User } from '../users/user.entity';
import { QueryItemDto } from './dtos/query-item.dto';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item) private itemRepository: Repository<Item>,
  ) {}

  async getAllItems(query: QueryItemDto) {
    const items = await this.itemRepository
      .createQueryBuilder()
      .select('*')
      .where('approved = :approved', { approved: true });
    if (query.name) {
      items.andWhere('name like :name', { name: `%${query.name}%` });
    }
    if (query.location) {
      items.andWhere('location like :location', {
        location: `%${query.location}%`,
      });
    }
    if (query.category) {
      items.andWhere('category like :category', {
        category: `%${query.category}%`,
      });
    }
    if (query.year) {
      items.andWhere('year = :year', { year: query.year });
    }

    return items.getRawMany();
  }
  create(body: CreateItemDto, user: User) {
    const item = this.itemRepository.create(body);
    item.user = user;
    return this.itemRepository.save(item);
  }

  async approveItem(id: number, approved: boolean) {
    const item = await this.itemRepository.findOneBy({ id });
    if (!item) {
      throw new NotFoundException('Item not found');
    }
    item.approved = approved;
    return this.itemRepository.save(item);
  }
}
