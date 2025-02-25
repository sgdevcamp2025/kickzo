//
//  KickRoomPlayStateResponseDTO.swift
//  KickTube
//
//  Created by 김수경 on 2/24/25.
//

import Foundation

import ManipulateDataModel

@DecodeDTO
struct KickRoomPlayStateResponseDTO {
    @Key("userId") let userID: Int
    @Key("roomId") let roomID: Int
    @Key("playTime") var time: Int
    @Key("playerState") var state: String
    
    func toModel() -> KickRoomPlayerStateViewModel {
        .init(userID: self.userID, progress: KickRoomPlayerStateViewModel.PlayState(rawValue: self.state) ?? .none, time: Float(self.time))
    }
}
