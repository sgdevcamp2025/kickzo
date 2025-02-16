//
//  HTTPURLResponse+Extensions.swift
//  KickTube
//
//  Created by 김수경 on 2/14/25.
//

import Foundation

extension HTTPURLResponse {
    var httpStatusCode: HTTPStatusCode? {
        return HTTPStatusCode(rawValue: self.statusCode)
    }
}
