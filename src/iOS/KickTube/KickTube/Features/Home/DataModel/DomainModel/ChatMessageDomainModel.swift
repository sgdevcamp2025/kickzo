//
//  ChatMessageDomainModel.swift
//  KickTube
//
//  Created by 김수경 on 2/11/25.
//

import Foundation

struct ChatMessageDomainModel {
    let messageID: String
    let roomID: Int
    let userID: Int
    let mediaContent: String?
    let message: String?
    let createdAt: Date
    
    func toModel() -> ChatMessageViewModel {
        .init(messageID: self.messageID,
              roomID: self.roomID,
              userID: self.userID,
              mediaContent: self.mediaContent,
              message: self.message,
              createdAt: self.createdAt.toMessageDate())
    }
}
