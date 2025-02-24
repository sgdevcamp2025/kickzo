//
//  KickRoomDomainModel.swift
//  KickTube
//
//  Created by 김수경 on 2/4/25.
//

import Foundation

import ManipulateDataModel

struct KickRoomDomainModel {
    var myRole: UserRole
    var roomDetail: KickRoomDetailDomainModel
    
    func toModel() -> KickRoomViewModel {
        .init(myRole: self.myRole, roomDetail: self.roomDetail.toModel())
    }
}

struct KickRoomDetailDomainModel {
    var userList: [KickRoomUserDomainModel]
    var roomInfo: KickRoomInfoDomainModel
    var playlist: [KickRoomPlaylistDomainModel]
    
    func toModel() -> KickRoomDetailViewModel {
        .init(userList: self.userList.map { $0.toModel() },
              roomInfo: self.roomInfo.toModel(),
              playlist: self.playlist.map { $0.toModel() })
    }
}

struct KickRoomUserDomainModel {
    let userID: Int
    var role: UserRole
    var nickname: String
    var userProfileImageURL: String?
    
    func toModel() -> KickRoomUserViewModel {
        var pURL: URL? = nil
               
        if let userProfileImageURL {
            pURL = URL(string: userProfileImageURL)
        }
        
        return .init(userID: self.userID,
              role: self.role,
              nickname: self.nickname,
              profileURL: pURL)
    }
}

struct KickRoomInfoDomainModel: DTOMappable {
    let roomID: Int
    let code: String
    var title: String
    var description: String?
    var userCount: Int
    let creator: String
    var profileImageURL: String?
    
    func toModel() -> KickRoomInfoViewModel {
        var pURL: URL? = nil
        
        if let profileImageURL {
            pURL = URL(string: profileImageURL)
        }
        
        return .init(roomID: self.roomID,
                     code: self.code,
                     title: self.title,
                     description: self.description,
                     userCount: self.userCount,
                     creator: self.creator,
                     profileImageURL: pURL)
    }
}

struct KickRoomPlaylistDomainModel: DTOMappable {
    let url: String
    var order: Int
    
    func toModel() -> KickRoomPlaylistViewModel {
        .init(url: self.url,
              order: self.order)
    }
}
