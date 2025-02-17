//
//  CreateRoomRequestDTO.swift
//  KickTube
//
//  Created by 김수경 on 2/17/25.
//

import Foundation

import ManipulateDataModel

@EncodeDTO
struct CreateRoomRequestDTO {
    var title: String
    var description: String? = nil
    var isPublic: Bool
}
