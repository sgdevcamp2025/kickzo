//
//  PlaylistRequestDTO.swift
//  KickTube
//
//  Created by 김수경 on 2/19/25.
//

import Foundation

import ManipulateDataModel

@EncodeDTO
struct RoomPlaylistRequestDTO {
    @Key("roomId") var roomID: Int
    var playlist: [PlaylistRequestDTO]
}

@EncodeDTO
struct PlaylistRequestDTO: DomainMappable {
    var url: String
    var order: Int
}

