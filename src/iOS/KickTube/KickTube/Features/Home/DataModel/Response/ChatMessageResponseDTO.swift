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
    @Key("content") let mediaContent: String?
    @Key("text") let message: String?
    @Key("timestamp") let createdAt: Int
    
    func toModel() -> ChatMessageDomainModel {
        .init(messageID: self.messageID,
              roomID: self.roomID,
              userID: self.userID,
              mediaContent: self.mediaContent,
              message: self.message,
              createdAt: self.createdAt.toDate)
    }
}
