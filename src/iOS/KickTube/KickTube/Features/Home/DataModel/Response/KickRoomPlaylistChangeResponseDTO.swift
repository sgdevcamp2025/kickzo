//
//  KickRoomPlaylistChangeResponseDTO.swift
//  KickTube
//
//  Created by 김수경 on 2/24/25.
//

import Foundation

import ManipulateDataModel

@DecodeDTO
struct KickRoomPlaylistChangeResponseDTO {
    @Key("roomId") let roomID: Int
    let playlist: [KickRoomPlaylistResponseDTO]
}
