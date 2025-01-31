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
    let videoID: String?
    let userProfileURL: URL?
    let roomTitle: String
    let userName: String
    var videoThumbnail: Data? = nil
    var userProfileThumbnail: Data? = nil
}

struct HomeRoomDomainModel: DTOMappable {
    let videoURL: String
    let userProfileURL: String
    let roomTitle: String
    let userName: String
    
    func toViewModel() -> HomeRoomViewModel {
        let videoID = videoURL.youTubeId
        let pURL = URL(string: self.userProfileURL)
        
        return .init(videoID: videoID,
                     userProfileURL: pURL,
                     roomTitle: self.roomTitle,
                     userName: self.userName)
    }
}

@DecodeDTO
@ConvertToDomainModel<HomeRoomDomainModel>
struct HomeRoomDTO {
    @Key("video_url") let videoURL: String
    @Key("user_profile_url")let userProfileURL: String
    @Key("room_title") let roomTitle: String
    @Key("user_name") let userName: String
}
