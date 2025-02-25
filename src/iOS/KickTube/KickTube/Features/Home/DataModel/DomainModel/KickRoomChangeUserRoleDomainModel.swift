//
//  KickRoomChangeUserRoleDomainModel.swift
//  KickTube
//
//  Created by 김수경 on 2/24/25.
//

import Foundation

import ManipulateDataModel

struct KickRoomChangeUserRoleDomainModel: DTOMappable {
    let roomID: Int
    let targetUserID: Int
    let newRole: Int
    
    func toModel() -> KickRoomChangeUserRoleViewModel {
        .init(targetUserID: self.targetUserID, newRole: UserRole(rawValue: self.newRole) ?? .nonmember)
    }
}
