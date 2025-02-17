//
//  MyRoomDomainModel.swift
//  KickTube
//
//  Created by 김수경 on 2/17/25.
//

import Foundation

import ManipulateDataModel

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
