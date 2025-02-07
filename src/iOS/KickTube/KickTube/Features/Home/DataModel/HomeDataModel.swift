//
//  HomeDataModel.swift
//  KickTube
//
//  Created by 김수경 on 1/30/25.
//

import Foundation

import ManipulateDataModel


// MARK: - 추후 분리 및 위치 변경 예정

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

struct HomeRoomDomainModel: DTOMappable {
    let roomID: Int
    let code: String
    let title: String
    let description: String?
    let creator: String
    let profileImageURL: String?
    let userCount: Int
    let playlistURL: String?
    
    func toModel() -> HomeRoomViewModel {
        var pURL: URL?
        
        if let url = self.profileImageURL {
            pURL = URL(string: url)
        }
        
        return .init(roomID: String(self.roomID),
                     code: self.code,
                     title: self.title,
                     description: self.description,
                     creatorName: self.creator,
                     profileImageURL: pURL,
                     userCount: self.userCount,
                     playlistURL: self.playlistURL)
    }
}

@DecodeDTO
@ConvertToDomainModel<HomeRoomDomainModel>
struct HomeRoomResponse {
    @Key("id") let roomID: Int
    let code: String
    let title: String
    let description: String?
    let creator: String
    @Key("profileImageUrl") let profileImageURL: String
    let userCount: Int
    @Key("playlistUrl") let playlistURL: String?
}
