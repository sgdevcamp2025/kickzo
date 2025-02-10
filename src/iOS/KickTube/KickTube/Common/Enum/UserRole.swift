//
//  UserRole.swift
//  KickTube
//
//  Created by 김수경 on 2/4/25.
//

import Foundation

enum UserRole: Int, Codable {
    case none = -1
    case creator = 0
    case manager
    case member
}

extension UserRole: CustomStringConvertible {
    var description: String {
        switch self {
        case .creator:
            return "방장"
        case .manager:
            return "매니저"
        case .member:
            return "일반"
        default:
            return ""
        }
    }
}
