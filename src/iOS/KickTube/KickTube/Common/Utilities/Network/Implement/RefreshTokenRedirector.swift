//
//  RefreshTokenRedirector.swift
//  KickTube
//
//  Created by 김수경 on 2/17/25.
//

import Foundation

class RefreshTokenRedirector: ResponsePipelineRedirector {
    func shouldApply<T: Request>(request: T, data: Data, response: HTTPURLResponse) -> Bool {
        return HTTPStatusCode(rawValue: response.statusCode) == .unauthorized
    }
    
    func redirect<T>(request: T, data: Data, response: HTTPURLResponse) async throws -> ResponsePipelineRedirectorAction where T : Request {
        
        do {
            try await refreshAccessToken()
            
            return .restart
        } catch {
            return .stop(NetworkError.refreshToken)
        }
    }
    
    private func refreshAccessToken() async throws {
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
