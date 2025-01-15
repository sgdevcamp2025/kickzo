//
//  NetworkError.swift
//  KickTube
//
//  Created by 김수경 on 1/15/25.
//

import Foundation

enum NetworkError: Error {
    case urlBuild
    case notFoundBaseURL
    case nonHTTPResponse
}

extension NetworkError: CustomStringConvertible {
    var description: String {
        switch self {
        case .urlBuild:
            return "urlBuild: component에서 url을 추출할 수 없습니다."
        case .notFoundBaseURL:
            return "notFoundBaseURL: BaseURL을 찾을 수 없습니다."
        case .nonHTTPResponse:
            return "notFoundResponse: response를 찾을 수 없습니다."
        }
    }
}
