//
//  NetworkManager.swift
//  KickTube
//
//  Created by 김수경 on 1/15/25.
//

import Foundation

final class NetworkManager {
    private let session: URLSession
    private let decoder = JSONDecoder()
    
    init(session: URLSession = URLSession.shared) {
        self.session = session
    }
        
    func getRawData(_ request: URLRequest) async throws -> Data {
        let (data, response) = try await session.data(for: request)
        guard let httpResponse = response as? HTTPURLResponse else {
            throw NetworkError.nonHTTPResponse
        }
        
        return data
    }
    
    func getDecodedData<D: Decodable>(request: URLRequest, to model: D.Type) async throws -> D {
        let data = try await getRawData(request)
        
        return try decoder.decode(model.self, from: data)
    }
}
