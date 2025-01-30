//
//  YoutubeRouter.swift
//  KickTube
//
//  Created by 김수경 on 1/23/25.
//

import Foundation

enum YoutubeRouter {
    case youtubeThumbnail(id: String)
}

extension YoutubeRouter {
    func makeURL() throws -> URL {
        switch self {
        case .youtubeThumbnail(let id):
            return try YoutubeEndPoint(method: .get, path: ["vi", id, "default.jpg"]).asURL()
        }
    }
}
