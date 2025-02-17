//
//  HTTPStatusCode.swift
//  KickTube
//
//  Created by 김수경 on 2/14/25.
//

import Foundation

enum HTTPStatusCode: Int {
    
    /// User Error
    case badRequest = 400
    case unauthorized = 401
    
    /// Server Error
    case internalServerError = 500
}
