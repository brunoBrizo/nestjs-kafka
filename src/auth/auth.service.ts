import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';

@Injectable()
export class AuthService {
  async getUser(userId: string): Promise<User> {
    return this.users.find((user) => user.id === userId);
  }

  private users: User[] = [
    {
      id: 'user1',
      username: 'user1',
      email: 'user1@example.com',
      password: 'password1',
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
    },
    {
      id: 'user2',
      username: 'user2',
      email: 'user2@example.com',
      password: 'password2',
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
    },
  ];
}
