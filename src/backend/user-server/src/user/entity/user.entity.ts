import { ApiHideProperty } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from "typeorm";

@Entity("user") // 테이블 이름
export class User {
  @PrimaryGeneratedColumn("increment")
  @Expose({ name: "userId" })
  id: number; // 유저 고유 ID

  @Column({ unique: true, length: 254 })
  email: string; // 이메일

  @Column({ unique: true, length: 20 })
  nickname: string; // 별명

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  @Exclude()
  @ApiHideProperty()
  nicknameUpdatedAt: Date; // 최근 별명 업데이트 시간

  @Column({ type: "int", default: 0 })
  role: number; // 역할

  @Column({ nullable: true, length: 2048 })
  profileImageUrl: string; // 대표 프로필 이미지 URL

  @Column({ type: "json", nullable: true })
  profileImages: string[]; // 프로필 이미지 배열

  @Column({ type: "char", length: 64, select: false })
  @Exclude()
  @ApiHideProperty()
  salt: string; // 솔트값

  @Column({ type: "char", length: 64, select: false }) // select: false -> 쿼리할 때 제외
  @Exclude()
  @ApiHideProperty()
  password: string; // 해싱된 비밀번호

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  @Exclude()
  @ApiHideProperty()
  passwordUpdatedAt: Date; // 비밀번호 변경 시각

  @Column({ type: "varchar", length: 100, nullable: true })
  stateMessage: string | null; // 상태 메시지

  @CreateDateColumn({ type: "timestamp" })
  @Exclude()
  @ApiHideProperty()
  createdAt: Date; // 유저 생성 시각

  @UpdateDateColumn({ type: "timestamp" })
  @Exclude()
  @ApiHideProperty()
  accessedAt: Date; // 마지막 접근 시각

  @DeleteDateColumn({ type: "datetime", nullable: true })
  @Exclude()
  @ApiHideProperty()
  deletedAt: Date; // 탈퇴 시간(soft delete)

  getPassword(): string {
    return this.password;
  }
}
