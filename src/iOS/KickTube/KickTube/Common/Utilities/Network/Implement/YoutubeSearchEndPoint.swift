//
//  YoutubeSearchEndPoint.swift
//  KickTube
//
//  Created by 김수경 on 2/7/25.
//

import Foundation

struct YoutubeSearchEndPoint: EndPointConfigurable {
    static var apiKey: String {
        get throws {
            guard let baseURL = Bundle.main.infoDictionary?["YoutubeAPI"] as? String
            else {
                throw NetworkError.notFoundBaseURL
            }
            return baseURL
        }
    }
    var scheme: String = "https"
    var baseURL: String = "www.googleapis.com"
    var method: HTTPMethod = .get
    var path: [String] = ["youtube", "v3", "videos"]
    var header: [String: String]?
    var parameter: [URLQueryItem]?
    var body: Encodable?
    var multipartBody: Data?
    var version: String?
    var port: Int?
}
