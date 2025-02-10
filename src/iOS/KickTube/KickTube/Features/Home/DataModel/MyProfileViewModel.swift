//
//  MyProfileViewModel.swift
//  KickTube
//
//  Created by 김수경 on 2/10/25.
//

import Foundation


struct MyProfileViewModel: Codable {
    let userID: Int
    let email: String
    var nickname: String
    var profileImageURL: String?
}
