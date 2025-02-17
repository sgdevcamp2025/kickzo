//
//  KickRoomResponseDTO.swift
//  KickTube
//
//  Created by 김수경 on 2/4/25.
//

import Foundation

import ManipulateDataModel

@DecodeDTO
struct KickRoomResponseDTO {
    let myRole: Int
    @Key("roomDetails") var roomDetail: KickRoomDetailResponseDTO
    
    func toModel() -> KickRoomDomainModel {
        .init(myRole: UserRole(rawValue: self.myRole) ?? .member,
              roomDetail: self.roomDetail.toModel())
    }
}

@DecodeDTO
struct KickRoomDetailResponseDTO {
    let userList: [KickRoomUserResponseDTO]
    let roomInfo: [KickRoomInfoResponseDTO]
    let playlist: [KickRoomPlaylistResponseDTO]
    
    func toModel() -> KickRoomDetailDomainModel {
        .init(userList: self.userList.map { $0.toModel() },
              roomInfo: self.roomInfo.map { $0.toModel() }[0],
              playlist: self.playlist.map { $0.toModel() }[0])
    }
}

@DecodeDTO
struct KickRoomUserResponseDTO {
    @Key("userId") let userID: Int
    let role: Int
    let nickname: String
    
    func toModel() -> KickRoomUserDomainModel {
        .init(userID: self.userID,
              role: UserRole(rawValue: self.role) ?? .member,
              nickname: self.nickname)
    }
}

@DecodeDTO
@ConvertToDomainModel<KickRoomInfoDomainModel>
struct KickRoomInfoResponseDTO {
    @Key("id") let roomID: Int
    let code: String
    let title: String
    let description: String?
    let userCount: Int
    let creator: String
    @Key("profileImageUrl") let profileImageURL: String?
}

@DecodeDTO
struct KickRoomPlaylistResponseDTO {
    let order: [KickRoomPlaylistItemResponseDTO]
    
    init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        let orderString = try container.decode(String.self, forKey: .order)
        if let jsonData = orderString.data(using: .utf8) {
            self.order = try JSONDecoder().decode([KickRoomPlaylistItemResponseDTO].self, from: jsonData)
        } else {
            self.order = []
        }
    }
    
    func toModel() -> KickRoomPlaylistDomainModel {
        .init(order: self.order.map { $0.toModel() })
    }
}


@DecodeDTO
@ConvertToDomainModel<KickRoomPlaylistItemDomainModel>
struct KickRoomPlaylistItemResponseDTO {
   let url: String
   let order: Int
}
