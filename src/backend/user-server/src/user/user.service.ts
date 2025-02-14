import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./entity/user.entity";
import { CreateUserDto } from "./dto/create-user.dto";
import * as bcrypt from "bcryptjs";
import { ConfigService } from "@nestjs/config";
import { UpdateUserDto } from "./dto/update-user.dto";
import { RedisService } from "@liaoliaots/nestjs-redis";
import Redis from "ioredis";
import { REDIS_KEY } from "./constants/redis-key.constant";
import { DeviceType } from "./enum/device-type.enum";
import { MESSAGES } from "./constants/constants";
import { ENV_KEY } from "./constants/env-key.constants";
@Injectable()
export class UserService {
  private readonly redis: Redis;

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
  ) {
    this.redis = this.redisService.getOrThrow();
  }

  async create(createUserDto: CreateUserDto) {
    const { email, nickname, password } = createUserDto;

    const user = await this.userRepository.findOne({
      where: { email },
      withDeleted: true,
    });
    if (user) {
      throw new BadRequestException(MESSAGES.EMAIL_IN_USE);
    }

    // 닉네임 중복 체크
    const userNickname = await this.userRepository.findOne({
      where: { nickname },
      withDeleted: true,
    });
    if (userNickname) {
      throw new BadRequestException(MESSAGES.NICKNAME_IN_USE);
    }

    // 비밀번호 해싱
    const hashRounds =
      this.configService.get<number>(ENV_KEY.HASH_ROUNDS) || 10;
    // salt 생성
    const salt = await bcrypt.genSalt(hashRounds);
    // salt를 이용해 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(password, salt);

    await this.userRepository.save({
      email,
      nickname,
      password: hashedPassword,
      salt,
    });

    return this.userRepository.findOne({ where: { email } });
  }

  // NOTE: pagination 필요할 경우 추가
  async findAll(page: number = 0, size: number = 10) {
    const [users, total] = await this.userRepository.findAndCount({
      skip: page * size,
      take: size,
    });
    return {
      users,
      total,
    };
  }

  async getUserById(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(MESSAGES.USER_NOT_FOUND);
    }
    return user;
  }

  async getUserByEmail(email: string, isPasswordIncluded = false) {
    if (isPasswordIncluded) {
      return await this.userRepository.findOne({
        where: { email },
        select: {
          id: true,
          email: true,
          nickname: true,
          password: true,
          role: true,
        },
      });
    }

    return this.userRepository.findOne({ where: { email } });
  }

  async updateProfile(userId: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException(MESSAGES.USER_NOT_FOUND);
    }

    if (updateUserDto.nickname) {
      const existingUser = await this.userRepository.findOne({
        where: { nickname: updateUserDto.nickname },
        withDeleted: true,
      });

      if (existingUser && existingUser.id !== userId) {
        throw new BadRequestException(MESSAGES.NICKNAME_IN_USE);
      }

      user.nickname = updateUserDto.nickname;
      user.nicknameUpdatedAt = new Date();
    }

    if (updateUserDto.stateMessage !== undefined) {
      user.stateMessage =
        updateUserDto.stateMessage.trim() === ""
          ? null
          : updateUserDto.stateMessage;
    }

    const updatedUser = await this.userRepository.save(user);
    return updatedUser;
  }

  async delete(id: number) {
    try {
      const user = await this.userRepository.findOne({ where: { id } });
      if (!user) {
        throw new NotFoundException(MESSAGES.USER_NOT_FOUND);
      }

      // 유저의 모든 토큰 삭제
      await this.redis.del(REDIS_KEY.REFRESH_TOKEN(id, DeviceType.WEB));
      await this.redis.del(REDIS_KEY.REFRESH_TOKEN(id, DeviceType.MOBILE));

      await this.redis.del(REDIS_KEY.ACCESS_TOKEN(id, DeviceType.WEB));
      await this.redis.del(REDIS_KEY.ACCESS_TOKEN(id, DeviceType.MOBILE));

      await this.userRepository.softDelete(id);

      return {
        message: MESSAGES.DELETION_SUCCESS,
        userId: id,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(MESSAGES.DELETION_ERROR);
    }
  }

  // 관리자 권한이 있는 경우에만 사용
  async restore(id: number) {
    await this.userRepository.restore(id);
  }

  // 관리자 권한이 있는 경우에만 사용
  async remove(id: number) {
    await this.userRepository.delete(id);
  }

  async checkNicknameExists(nickname: string) {
    const user = await this.userRepository.findOne({
      where: { nickname },
      withDeleted: true,
    });
    return {
      message: user ? MESSAGES.NICKNAME_IN_USE : MESSAGES.NICKNAME_AVAILABLE,
      isAvailable: !user,
      field: "nickname",
      value: nickname,
    };
  }

  async checkEmailExists(email: string) {
    const user = await this.userRepository.findOne({
      where: { email },
      withDeleted: true,
    });
    return {
      message: user ? MESSAGES.EMAIL_IN_USE : MESSAGES.EMAIL_AVAILABLE,
      isAvailable: !user,
      field: "email",
      value: email,
    };
  }
}
