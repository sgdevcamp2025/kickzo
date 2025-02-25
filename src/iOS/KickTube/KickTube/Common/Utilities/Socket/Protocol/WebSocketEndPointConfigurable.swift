//
//  WebSocketEndPointConfigurable.swift
//  KickTube
//
//  Created by 김수경 on 2/23/25.
//

import Foundation

protocol WebSocketEndPointConfigurable {
    var scheme: String { get }
    var baseURL: String { get throws }
    var path: String { get }
    var port: Int { get }
    
    func asURL() throws -> URL
}
