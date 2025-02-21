//
//  ChatMessageEntity.swift
//  KickTube
//
//  Created by 김수경 on 2/21/25.
//

import Foundation
import SwiftData

@Model
class ChatMessageEntity {
    @Attribute(.unique) var messageID: String
    var userID: Int
    var createdAt: Int
    var media: String?
    var message: String?
    var role: Int?
    var nickname: String?
    var profileImageURL: String?

    @Relationship(deleteRule: .cascade)
    var room: ChatRoomEntity

    init(
        messageID: String,
        userID: Int,
        createdAt: Int,
        chatRoom: ChatRoomEntity, 
        media: String? = nil,
        message: String? = nil,
        role: Int? = nil,
        nickname: String? = nil,
        profileImageURL: String? = nil
    ) {
        self.messageID = messageID
        self.userID = userID
        self.createdAt = createdAt
        self.room = chatRoom
        self.media = media
        self.message = message
        self.role = role
        self.nickname = nickname
        self.profileImageURL = profileImageURL
    }
}

extension ChatMessageEntity {
    func toDomainModel() -> ChatMessageDomainModel {
        .init(messageID: self.messageID,
              roomID: self.room.roomID,
              userID: self.userID,
              createdAt: self.createdAt,
              media: self.media,
              message: self.message,
              role: self.role,
              nickname: self.nickname,
              profileImageURL: self.profileImageURL)
    }
}
