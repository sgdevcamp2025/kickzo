//
//  CreateRoomResponseDTO.swift
//  KickTube
//
//  Created by 김수경 on 2/17/25.
//

import Foundation

import ManipulateDataModel

@DecodeDTO
@ConvertToDomainModel<CreateRoomDomainModel>
struct CreateRoomResponseDTO {
    let code: String
}
