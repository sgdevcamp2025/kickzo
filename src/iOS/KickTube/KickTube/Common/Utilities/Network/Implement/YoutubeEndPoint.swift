//
//  YoutubeEndPoint.swift
//  KickTube
//
//  Created by 김수경 on 1/30/25.
//

import Foundation

struct YoutubeEndPoint: EndPointConfigurable {
    var scheme: String = "https"
    var baseURL: String = "img.youtube.com"
    var method: HTTPMethod
    var path: [String]
    var header: [String: String]?
    var parameter: [URLQueryItem]?
    var body: Encodable?
    var multipartBody: Data?
    var version: String?
    var port: Int?
}
