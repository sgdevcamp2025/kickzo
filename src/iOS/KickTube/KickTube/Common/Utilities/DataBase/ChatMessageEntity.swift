//
//  ChatMessageEntity.swift
//  KickTube
//
//  Created by 김수경 on 2/21/25.
//

import Foundation

import RealmSwift

class ChatMessageEntity: Object, ObjectKeyIdentifiable {
    @Persisted(primaryKey: true) var messageID: String
    @Persisted var userID: Int
    @Persisted var createdAt: Int
    @Persisted var media: String?
    @Persisted var message: String?
    @Persisted var role: Int?
    @Persisted var nickname: String?
    @Persisted var profileImageURL: String?
    
    convenience init(
        messageID: String,
        userID: Int,
        createdAt: Int,
        media: String? = nil,
        message: String? = nil,
        role: Int? = nil,
        nickname: String? = nil,
        profileImageURL: String? = nil
    ) {
        self.init()
        self.messageID = messageID
        self.userID = userID
        self.createdAt = createdAt
        self.media = media
        self.message = message
        self.role = role
        self.nickname = nickname
        self.profileImageURL = profileImageURL
    }
}

extension ChatMessageEntity {
    func toDomainModel() -> ChatMessageDomainModel {
        .init(messageID: self.messageID, roomID: -1, userID: self.userID, createdAt: self.createdAt, media: self.media, message: self.message, role: self.role, nickname: self.nickname, profileImageURL: self.profileImageURL)
    }
}
