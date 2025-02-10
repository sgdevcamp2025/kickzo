//
//  KickRoomVoiceUserViewModel.swift
//  KickTube
//
//  Created by 김수경 on 2/10/25.
//

import Foundation

struct KickRoomVoiceUserViewModel  {
    let userID: Int
    var role: UserRole
    var nickname: String
    var micStatus: Bool
    var headsetStatus: Bool
    
    var thumbnailImage: Data?
}
