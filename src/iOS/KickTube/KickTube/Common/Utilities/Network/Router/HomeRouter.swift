//
//  HomeRouter.swift
//  KickTube
//
//  Created by 김수경 on 2/5/25.
//

import Foundation

enum HomeRouter {
    case getAllRooms
    case getRoomInformationWhenEnteredRoom(String)
}

extension HomeRouter {
    func makeURLRequest() throws -> URLRequest {
        switch self {
        case .getAllRooms:
            return try DefaultEndPoint(method: .get, path: ["rooms"]).asURLRequest()
        case .getRoomInformationWhenEnteredRoom(let id):
            return try DefaultEndPoint(method: .get, path: ["join"]).asURLRequest()
        }
    }
}
