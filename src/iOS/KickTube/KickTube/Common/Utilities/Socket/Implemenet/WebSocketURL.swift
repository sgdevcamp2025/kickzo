//
//  WebSocketURL.swift
//  KickTube
//
//  Created by 김수경 on 2/23/25.
//

import Foundation

enum WebSocketURL: WebSocketEndPointConfigurable {
    case chat
}

extension WebSocketURL {
    var scheme: String {
        return "http"
    }
    
    var baseURL: String {
        get throws {
            guard let baseURL = Bundle.main.infoDictionary?["BaseURL"] as? String
            else {
                throw NetworkError.notFoundBaseURL
            }
            return baseURL
        }
    }
    var path: String {
        switch self {
        case .chat:
            return "/api/chat/ws/mobile"
        }
    }
    var port: Int {
        return 8000
    }
    
    func asURL() throws -> URL {
        var components = URLComponents()
        
        components.scheme = scheme
        components.host = try baseURL
        components.path = path
        components.port = port
        
        guard let url = components.url else {
            throw NetworkError.urlBuild
        }
        
        return url
    }
}
