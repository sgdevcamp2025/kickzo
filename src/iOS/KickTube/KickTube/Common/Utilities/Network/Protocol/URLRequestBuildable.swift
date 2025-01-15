//
//  URLRequestBuildable.swift
//  KickTube
//
//  Created by 김수경 on 1/15/25.
//

import Foundation

protocol URLRequestBuildable {
    func asURL() throws -> URL
    func asURLRequest() throws -> URLRequest
}
