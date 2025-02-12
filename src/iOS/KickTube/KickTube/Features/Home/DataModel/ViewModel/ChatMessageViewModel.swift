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
    var mediaContent: String?
    var message: String?
    var createdAt: String
    
    var profileThumbnail: Data?
    var userRole: UserRole?
    var nickname: String?
}
