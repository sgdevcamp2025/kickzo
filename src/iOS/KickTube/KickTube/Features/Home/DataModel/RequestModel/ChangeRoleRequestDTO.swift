//
//  ChangeRoleRequestDTO.swift
//  KickTube
//
//  Created by 김수경 on 2/19/25.
//

import ManipulateDataModel

@EncodeDTO
struct ChangeRoleRequest {
    @Key("roomId") var roomID: Int
    @Key("targetUserId") var targetUserID: Int
    var newRole: Int
}
