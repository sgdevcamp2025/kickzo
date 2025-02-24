//
//  CreateLimitFiveRedirector.swift
//  KickTube
//
//  Created by 김수경 on 2/17/25.
//

import Foundation

class CreateLimitFiveRedirector: ResponsePipelineRedirector {
    func shouldApply<T: Request>(request: T, data: Data, response: HTTPURLResponse) -> Bool {
        return  HTTPStatusCode(rawValue: response.statusCode) == .createRoomLimit
    }
    
    func redirect<T>(request: T, data: Data, response: HTTPURLResponse) async throws -> ResponsePipelineRedirectorAction where T : Request {
        return .stop(NetworkError.createRoom)
    }
}
