import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  async login(email: string, password: string): Promise<string> {
    // Logic for user authentication
    return `User ${email} logged in successfully`;
  }
}
