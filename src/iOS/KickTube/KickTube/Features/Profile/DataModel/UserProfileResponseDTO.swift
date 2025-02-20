//
//  UserProfileResponseDTO.swift
//  KickTube
//
//  Created by 김수경 on 2/10/25.
//

import Foundation

import ManipulateDataModel

@DecodeDTO
@ConvertToDomainModel<UserProfileDomainModel>
struct UserProfileResponseDTO {
    @Key("userId") let userID: Int
    let email: String
    let nickname: String
    let role: Int
    @Key("profileImageUrl") let profileImageURL: String?
    let profileImages: [String]?
    let stateMessage: String?
}
