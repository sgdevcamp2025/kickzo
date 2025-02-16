//
//  NetworkError.swift
//  KickTube
//
//  Created by 김수경 on 1/15/25.
//

import Foundation

enum NetworkError: Error {
    case notFoundBaseURL
    case urlBuild
    case urlRequstBuild
    case nonHTTPResponse
    case httpError(Int)
    case missingParser
    
    case emptyYoutubeThumbnail
    case emtpyThumbnail
    
    case emptyToken
    case refreshToken
}

extension NetworkError: CustomStringConvertible {
    var description: String {
        switch self {
        case .notFoundBaseURL:
            return "notFoundBaseURL: BaseURL을 찾을 수 없습니다."
        case .urlBuild:
            return "urlBuild: component에서 url을 추출할 수 없습니다."
        case .urlRequstBuild:
            return "urlRequestBuild: urlRequest를 생성할 수 없습니다."
        case .nonHTTPResponse:
            return "notFoundResponse: response를 찾을 수 없습니다."
        case .httpError(let statusCode):
            return "httpError: \(statusCode)"
        case .missingParser:
            return "missingParser"
        case .emptyYoutubeThumbnail:
            return "emptyYoutubeThumbnail: Youtube thumbnail이 없습니다."
        case .emtpyThumbnail:
            return "emptyThumbnail: thumbnail이 없습니다."
        case .emptyToken:
            return "token 없음"
        case .refreshToken:
            return "refreshToken: Token refresh 실패"
        }
    }
}
