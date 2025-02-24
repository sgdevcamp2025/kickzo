//
//  ChatRoomEntity.swift
//  KickTube
//
//  Created by 김수경 on 2/21/25.
//

import Foundation

import RealmSwift

class ChatRoomEntity: Object, ObjectKeyIdentifiable {
    @Persisted(primaryKey: true) var roomID: String
    @Persisted var messages: List<ChatMessageEntity>

    convenience init(roomID: String) {
        self.init()
        self.roomID = roomID
    }
}
