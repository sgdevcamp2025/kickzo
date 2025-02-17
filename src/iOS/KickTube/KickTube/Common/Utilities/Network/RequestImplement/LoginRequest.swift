//
//  LoginRequest.swift
//  KickTube
//
//  Created by 김수경 on 2/14/25.
//

import Foundation

struct LoginRequest: Request {
    typealias Response = TokenResponseModel
    
    var scheme: String = "http"
    var baseURL: String {
        get throws {
            guard let baseURL = Bundle.main.infoDictionary?["BaseURL"] as? String
            else {
                throw NetworkError.notFoundBaseURL
            }
            return baseURL
        }
    }
    
    var method: HTTPMethod
    var path: [String]
    var header: [HeaderContent]?
    var pathQueries: [URLQueryItem]?
    var body: (any Encodable)?
    var port: Int = 8000
}
