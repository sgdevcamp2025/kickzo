//
//  UserProfileViewModel.swift
//  KickTube
//
//  Created by 김수경 on 2/17/25.
//

import UIKit

struct UserProfileViewModel: Codable {
    let userID: Int
    let email: String
    let nickname: String
    let profileImageURL: String?
    let stateMessage: String?
    
    var profileImageData: Data? = UIImage.profile.toData()
}
