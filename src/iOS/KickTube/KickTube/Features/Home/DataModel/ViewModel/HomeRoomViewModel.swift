//
//  HomeRoomViewModel.swift
//  KickTube
//
//  Created by 김수경 on 2/17/25.
//

import Foundation

struct HomeRoomViewModel: Equatable {
    let roomID: Int
    let code: String
    var title: String
    var description: String?
    let creator: String
    var profileImageURL: URL?
    var userCount: Int
    var playlistURL: String?
    var isPublic: Bool
    
    var videoThumbnail: Data?
    var profileThumbnanil: Data?
    var videoID: String? {
        playlistURL?.youtubeID
    }
    var participatedUserCount: String {
        "\(userCount)"
    }
    var created: Bool {
        creator == UserDefaultsManager.shared.myProfile.nickname ? true : false
    }
}
