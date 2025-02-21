//
//  TokenDomainModel.swift
//  KickTube
//
//  Created by 김수경 on 2/17/25.
//

import Foundation

import ManipulateDataModel

struct TokenDomainModel: DTOMappable {
    var accessToken: String
    var refreshToken: String
}
