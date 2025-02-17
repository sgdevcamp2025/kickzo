//
//  HomeRoomViewModel.swift
//  KickTube
//
//  Created by 김수경 on 2/17/25.
//

import Foundation

struct HomeRoomViewModel: Equatable {
    let roomID: String
    let code: String
    var title: String
    var description: String?
    let creatorName: String
    var profileImageURL: URL?
    var userCount: Int
    var playlistURL: String?
    
    var videoID: String? {
        playlistURL?.youtubeID
    }
    var videoThumbnail: Data?
    var participatedUserCount: String {
        "\(userCount)"
    }
}
