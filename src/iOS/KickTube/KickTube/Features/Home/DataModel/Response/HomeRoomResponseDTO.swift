//
//  HomeRoomResponseDTO.swift
//  KickTube
//
//  Created by 김수경 on 2/17/25.
//

import Foundation

import ManipulateDataModel

@DecodeDTO
@ConvertToDomainModel<HomeRoomDomainModel>
struct HomeRoomResponseDTO {
    @Key("roomId") let roomID: Int
    let code: String
    let title: String
    let description: String?
    let creator: String
    @Key("profileImageUrl") let profileImageURL: String?
    let userCount: Int
    @Key("playlistUrl") let playlistURL: String?
    @Key("public") let isPublic: Bool
}

extension HomeRoomResponseDTO: Equatable {}
extension HomeRoomResponseDTO: Encodable {}
