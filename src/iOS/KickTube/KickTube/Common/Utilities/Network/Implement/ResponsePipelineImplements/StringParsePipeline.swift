//
//  StringParsePipeline.swift
//  KickTube
//
//  Created by 김수경 on 2/19/25.
//

import Foundation

final class StringParsePipeline: ResponsePipelineTerminator {
    func parse<T: Request>(request: T, data: Data) throws -> T.Response {
        guard let stringResponse = String(data: data, encoding: .utf8) else {
            throw NetworkError.invalidResponseData
        }
        
        guard let response = stringResponse as? T.Response else {
            throw NetworkError.typeMismatch
        }
        
        return response
    }
}
