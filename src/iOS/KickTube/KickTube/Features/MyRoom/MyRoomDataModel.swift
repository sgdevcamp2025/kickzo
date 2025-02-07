//
//  MyRoomDataModel.swift
//  KickTube
//
//  Created by 김수경 on 2/4/25.
//

import Foundation

import ManipulateDataModel

@DecodeDTO
@ConvertToDomainModel<MyRoomDomainModel>
struct MyRoomDTO {
    let id: Int
    let code: String
    let title: String
    let description: String
    let creator: String
    @Key("profileImageUrl") let profileImageURL: String
    let userCount: Int
    @Key("playlistUrl") let playlistURL: String
}

struct MyRoomDomainModel: DTOMappable {
    let id: Int
    let code: String
    let title: String
    let description: String
    let creator: String
    let profileImageURL: String
    let userCount: Int
    let playlistURL: String
    
    func toViewModel() -> MyRoomViewModel {
        .init(id: self.id,
              code: self.code,
              title: self.title,
              creator: self.creator,
              userCount: String(self.userCount),
              videoID: playlistURL.youtubeID
        )
    }
}

struct MyRoomViewModel {
    let id: Int
    let code: String
    let title: String
    let creator: String
    let userCount: String
    let videoID: String?
    var videoThumbnail: Data? = nil
    var userProfileThumbnail: Data? = nil
    
    var created: Bool {
        if creator == SampleTest.userDefaultsProfilename {
            return true
        }
        
        return false
    }
}
