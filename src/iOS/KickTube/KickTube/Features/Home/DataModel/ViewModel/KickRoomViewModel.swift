//
//  KickRoomViewModel.swift
//  KickTube
//
//  Created by 김수경 on 2/4/25.
//

import Foundation

struct KickRoomViewModel {
    var myRole: UserRole
    var userList: [KickRoomUserViewModel]
    var roomInfo: KickRoomInfoViewModel
    var playlist: KickRoomPlaylistViewModel
}

struct KickRoomUserViewModel  {
    let userID: Int
    var role: UserRole
    var nickname: String
}

struct KickRoomInfoViewModel {
    let roomID: Int
    let code: String
    var title: String
    var description: String?
    var userCount: Int
    let creator: String
    var profileImageURL: URL?
    
    var participatedUserCount: String {
        "\(self.userCount) / 1000"
    }
}

struct KickRoomPlaylistViewModel {
    var order: [KickRoomPlaylistItemViewModel]
}

struct KickRoomPlaylistItemViewModel {
    let url: String
    var order: Int
}
