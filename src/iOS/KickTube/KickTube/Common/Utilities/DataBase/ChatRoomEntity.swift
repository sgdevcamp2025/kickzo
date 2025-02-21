//
//  ChatRoomEntity.swift
//  KickTube
//
//  Created by 김수경 on 2/21/25.
//

import Foundation
import SwiftData

@Model
class ChatRoomEntity {
    @Attribute(.unique) var roomID: Int
    @Relationship(deleteRule: .cascade, inverse: \ChatMessageEntity.room)
    var messages: [ChatMessageEntity] = []

    init(roomID: Int) {
        self.roomID = roomID
    }
}

