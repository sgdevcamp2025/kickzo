//
//  ChatMessageViewModel.swift
//  KickTube
//
//  Created by 김수경 on 2/11/25.
//

import Foundation

struct ChatMessageViewModel: Equatable {
    let messageID: String
    let roomID: Int
    let userID: Int
    let createdAt: Date
    let media: String?
    let message: String?
    let role: UserRole
    let nickname: String?
    let profileImageURL: URL?
    
    var profileThumbnail: Data?
    var dateString: String {
        createdAt.toMessageDate()
    }
}
