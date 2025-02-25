//
//  ChatMessageResponseDTO.swift
//  KickTube
//
//  Created by 김수경 on 2/11/25.
//

import Foundation

import ManipulateDataModel

@DecodeDTO
struct ChatMessageResponseDTO {
    @Key("id") let messageID: String
    @Key("roomId") let roomID: Int
    @Key("userId") let userID: Int
    @Key("timestamp") let createdAt: Int
    @Key("content") let media: String?
    let message: String?
    let role: Int?
    let nickname: String?
    @Key("profileImageUrl") let profileImageURL: String?
    
    func toModel() -> ChatMessageDomainModel {
        .init(messageID: self.messageID,
              roomID: self.roomID,
              userID: self.userID,
              createdAt: self.createdAt,
              media: self.media,
              message: self.message,
              role: self.role,
              nickname: self.nickname,
              profileImageURL: self.profileImageURL)
    }
}

@DecodeDTO
struct SocketChatMessageResponseDTO {
    @Key("roomId") let roomID: Int
    @Key("userId") let userID: Int
    @Key("timestamp") let createdAt: Int
    @Key("content") let media: String?
    let message: String?
    let role: Int?
    let nickname: String?
    @Key("profileImageUrl") let profileImageURL: String?
    
    func toModel() -> ChatMessageDomainModel {
        .init(messageID: UUID().uuidString,
              roomID: self.roomID,
              userID: self.userID,
              createdAt: self.createdAt,
              media: self.media,
              message: self.message,
              role: self.role,
              nickname: self.nickname,
              profileImageURL: self.profileImageURL)
    }
}
