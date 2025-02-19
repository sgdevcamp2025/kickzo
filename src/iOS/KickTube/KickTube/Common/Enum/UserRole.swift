//
//  UserRole.swift
//  KickTube
//
//  Created by 김수경 on 2/4/25.
//

import Foundation

enum UserRole: Int, Codable {
    case nonmember = -1
    case creator = 0
    case manager = 1
    case member = 2
}

extension UserRole: CustomStringConvertible {
    var description: String {
        switch self {
        case .nonmember:
            return "비회원"
        case .creator:
            return "방장"
        case .manager:
            return "매니저"
        case .member:
            return "일반"
        }
    }
}
