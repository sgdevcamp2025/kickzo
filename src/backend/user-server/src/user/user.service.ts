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
      throw new BadRequestException("이미 가입한 이메일입니다.");
    }

    // 닉네임 중복 체크
    const userNickname = await this.userRepository.findOne({
      where: { nickname },
      withDeleted: true,
    });
    if (userNickname) {
      throw new BadRequestException("이미 가입한 닉네임입니다.");
    }

    // 비밀번호 해싱
    const hashRounds = this.configService.get<number>("HASH_ROUNDS") || 10;
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
  async findAll() {
    return this.userRepository.find();
  }

  async getUserById(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException("존재하지 않는 사용자입니다!");
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
      throw new NotFoundException("사용자를 찾을 수 없습니다.");
    }

    if (updateUserDto.nickname) {
      const existingUser = await this.userRepository.findOne({
        where: { nickname: updateUserDto.nickname },
        withDeleted: true,
      });

      if (existingUser && existingUser.id !== userId) {
        throw new BadRequestException("이미 사용 중인 닉네임입니다.");
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
        throw new NotFoundException("사용자를 찾을 수 없습니다.");
      }

      // 유저의 모든 토큰 삭제
      await this.redis.del(`refresh_token:${id}:web`);
      await this.redis.del(`refresh_token:${id}:mobile`);

      await this.redis.del(`access_token:${id}:web`);
      await this.redis.del(`access_token:${id}:mobile`);

      await this.userRepository.softDelete(id);

      return {
        message: "회원 탈퇴가 완료되었습니다.",
        userId: id,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        "회원 탈퇴 처리 중 오류가 발생했습니다.",
      );
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
      message: user
        ? "이미 사용 중인 닉네임입니다."
        : "사용 가능한 닉네임입니다.",
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
      message: user
        ? "이미 사용 중인 이메일입니다."
        : "사용 가능한 이메일입니다.",
      isAvailable: !user,
      field: "email",
      value: email,
    };
  }
}
