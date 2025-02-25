//
//  WebSocketTopic.swift
//  KickTube
//
//  Created by 김수경 on 2/23/25.
//

import Foundation

enum WebSocketTopic {
    case pubSendUserId
    case pubVideoTime
    case pubMessage
    
    case subJoinNewUser(_ roomID: String)
    case subRoleChange(_ roomID: String)
    case subPlaylistChange(_ roomID: String)
    case subVideoTime(_ roomID: String)
    case subMessage(_ roomID: String)
}

extension WebSocketTopic {
    var endPoint: String {
        switch self {
        case .pubSendUserId:
            return "/app/connect"
        case .pubVideoTime:
            return "/app/play-time"
        case .pubMessage:
            return "/app/send-message"
        case .subJoinNewUser(let roomID):
            return "/topic/room/\(roomID)/user-info"
        case .subRoleChange(let roomID):
            return "/topic/room/\(roomID)/role-change"
        case .subPlaylistChange(let roomID):
            return "/topic/room/\(roomID)/playlist-update"
        case .subVideoTime(let roomID):
            return "/topic/room/\(roomID)/play-time"
        case .subMessage(let roomID):
            return "/topic/room/\(roomID)/chat"
        }
    }
}
