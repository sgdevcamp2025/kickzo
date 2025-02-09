//
//  YoutubeRouter.swift
//  KickTube
//
//  Created by 김수경 on 1/23/25.
//

import Foundation

enum YoutubeRouter {
    case youtubeThumbnailLow(id: String)
    case youtubeThumbnailHigh(id: String)
    case searchYoutubeVideo(id: String)
}

extension YoutubeRouter {
    func makeURL() throws -> URL {
        switch self {
        case .youtubeThumbnailLow(let id):
            return try YoutubeEndPoint(method: .get, path: ["vi", id, "mqdefault.jpg"]).asURL()
        case .youtubeThumbnailHigh(let id):
            return try YoutubeEndPoint(method: .get, path: ["vi", id, "maxresdefault.jpg"]).asURL()
        case .searchYoutubeVideo(let id):
            return try YoutubeSearchEndPoint(parameter: [
                URLQueryItem(name: "part", value: "snippet"),
                URLQueryItem(name: "id", value: id),
                URLQueryItem(name: "key", value: YoutubeSearchEndPoint.apiKey),
                URLQueryItem(name: "hl", value: "ko"),
            ]).asURL()
        }
    }
    
    func makeRequest() throws -> URLRequest? {
        switch self {
        case .searchYoutubeVideo(let id):
            return try YoutubeSearchEndPoint(parameter: [
                URLQueryItem(name: "part", value: "snippet"),
                URLQueryItem(name: "id", value: id),
                URLQueryItem(name: "key", value: YoutubeSearchEndPoint.apiKey),
                URLQueryItem(name: "hl", value: "ko"),
            ]).asURLRequest()
        default:
            return nil
        }
    }
}
