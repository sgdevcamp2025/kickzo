//
//  URLSessionProtocol.swift
//  KickTube
//
//  Created by 김수경 on 2/20/25.
//

import Foundation

protocol URLSessionProtocol {
    func data(for request: URLRequest) async throws -> (Data, URLResponse)
}

extension URLSession: URLSessionProtocol {
    func data(for request: URLRequest) async throws -> (Data, URLResponse) {
        try await self.data(for: request, delegate: nil)
    }
}
