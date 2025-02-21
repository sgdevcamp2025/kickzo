//
//  AccessTokenRedirector.swift
//  KickTube
//
//  Created by 김수경 on 2/17/25.
//

import Foundation

class AccessTokenRedirector: ResponsePipelineRedirector {
    func shouldApply<T: Request>(request: T, data: Data, response: HTTPURLResponse) -> Bool {
        return HTTPStatusCode(rawValue: response.statusCode) == .unauthorized || HTTPStatusCode(rawValue: response.statusCode) == .badRequest
    }
    
    func redirect<T>(request: T, data: Data, response: HTTPURLResponse) async throws -> ResponsePipelineRedirectorAction where T : Request {
        do {
            try await API.Auth.refreshAccessToken()
            
            return .restart
        } catch {
            return .stop(NetworkError.refreshToken)
        }
    }
}
