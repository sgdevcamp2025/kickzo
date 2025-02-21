//
//  ChatMessageDomainModel.swift
//  KickTube
//
//  Created by 김수경 on 2/11/25.
//

import Foundation
import SwiftData

struct ChatMessageDomainModel {
    let messageID: String
    let roomID: Int
    let userID: Int
    let createdAt: Int
    let media: String?
    let message: String?
    let role: Int?
    let nickname: String?
    let profileImageURL: String?
    
    func toModel() -> ChatMessageViewModel {
        var pURL: URL? = nil
        
        if let profileImageURL {
            pURL = URL(string: profileImageURL)
        }
        
        return .init(messageID: self.messageID,
                     roomID: self.roomID,
                     userID: self.userID,
                     createdAt: self.createdAt.toDate,
                     media: self.media,
                     message: self.message,
                     role: UserRole(rawValue: self.role ?? -1) ?? .nonmember,
                     nickname: self.nickname,
                     profileImageURL: pURL)
    }
}

extension ChatMessageDomainModel {
    func toDBModel() -> ChatMessageEntity {
        .init(messageID: self.messageID,
              userID: self.userID,
              createdAt: self.createdAt,
              chatRoom: ChatRoomEntity(roomID: self.roomID),
              media: self.media,
              message: self.message,
              role: self.role,
              nickname: self.nickname,
              profileImageURL: self.profileImageURL
        )
    }
}
