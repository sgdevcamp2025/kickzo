//
//  UserProfileDomainModel.swift
//  KickTube
//
//  Created by 김수경 on 2/17/25.
//

import Foundation

import ManipulateDataModel

struct UserProfileDomainModel: DTOMappable {
    let userID: Int
    let email: String
    let nickname: String
    let role: Int
    let profileImageURL: String?
    let profileImages: [String]?
    let stateMessage: String?
    
    func toModel() -> UserProfileViewModel {
        .init(userID: self.userID,
              email: self.email,
              nickname: self.nickname,
              profileImageURL: self.profileImageURL,
              stateMessage: self.stateMessage)
    }
}
