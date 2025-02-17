//
//  API.swift
//  KickTube
//
//  Created by 김수경 on 2/17/25.
//

import Foundation

struct API {
    struct Auth {
        static func refreshAccessToken() async throws {
            struct RefreshTokenRequestBody: Encodable {
                let refreshToken: String
            }
            
            guard let refreshToken =  KeyChainManager.shared.read(key: .refreshToken) else {
                return
            }
            
            let request = DefaultRequest<TokenResponseModel>(method: .post, path: ["api", "auth", "token", "refresh"], header: [.json, .authorizationRefreshToken], body: RefreshTokenRequestBody(refreshToken: refreshToken))
            
            let result = try await Session().send(request)
            
            KeyChainManager.shared.save(key: .accessToken, value: result.accessToken)
            KeyChainManager.shared.save(key: .refreshToken, value: result.refreshToken)
        }
    }
    
    struct User {
        static let myProfile = DefaultRequest<UserProfileResponse>(method: .get, path: ["api", "users", "me"], header: [.json, .authorizationAccessToken])
    }
}
