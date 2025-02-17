//
//  HeaderContent.swift
//  KickTube
//
//  Created by 김수경 on 2/14/25.
//

import Foundation

enum HeaderContent {
    case json
    case login(LoginViewModel)
    case authorizationAccessToken
    case authorizationRefreshToken
}

extension HeaderContent {
    var value: [String : String] {
        switch self {
        case .json:
            return ["Content-Type": "application/json"]
        case .login(let login):
            let credentials = "\(login.userID):\(login.password)"
            
            if let basicToken = credentials.data(using: .utf8)?.base64EncodedString() {
                return ["Authorization": "Basic \(basicToken)"]
            }
            
            return [:]
        case .authorizationAccessToken:
            if let accessToken = KeyChainManager.shared.read(key: .accessToken) {
                return ["Authorization": "Bearer \(accessToken)"]
            }
            
            return [:]
        case .authorizationRefreshToken:
            if let refreshToken = KeyChainManager.shared.read(key: .refreshToken) {
                return ["Authorization": "Bearer \(refreshToken)"]
            }
            
            return [:]
        }
    }
}
