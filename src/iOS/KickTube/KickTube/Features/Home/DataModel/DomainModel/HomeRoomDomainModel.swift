//
//  HomeRoomDomainModel.swift
//  KickTube
//
//  Created by 김수경 on 2/17/25.
//

import Foundation

import ManipulateDataModel

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
