//
//  KickRoomChangeUserRoleResponseDTO.swift
//  KickTube
//
//  Created by 김수경 on 2/24/25.
//

import Foundation

import ManipulateDataModel

@DecodeDTO
@ConvertToDomainModel<KickRoomChangeUserRoleDomainModel>
struct KickRoomChangeUserRoleResponseDTO {
    @Key("roomId") let roomID: Int
    @Key("targetUserId") let targetUserID: Int
    let newRole: Int
}
