//
//  NetworkManager.swift
//  KickTube
//
//  Created by 김수경 on 1/15/25.
//

import Foundation

final class NetworkManager {
    private let session: URLSession
    private let cacheManager = CacheManager()
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
    
    private func getDataFromURL(_ url: URL) async throws -> Data {
        let (data, _) = try await session.data(from: url)
        
        return data
    }
    
    func getCachingData(_ request: URLRequest, key: String) async throws -> Data {
        if let cachedData = cacheManager.loadFromCache(forKey: key) {
            return cachedData
        } else {
            let networkData = try await getRawData(request)
            
            cacheManager.saveToCache(data: networkData, forKey: key)
            
            return networkData
        }
    }
    
    func getCachingDataFromURL(_ url: URL) async throws -> Data {
        if let cachedData = cacheManager.loadFromCache(forKey: url.absoluteString) {
            return cachedData
        } else {
            let networkData = try await getDataFromURL(url)
            
            cacheManager.saveToCache(data: networkData, forKey: url.absoluteString)
            return networkData
        }
    }
    
    func getDecodedData<D: Decodable>(request: URLRequest, to model: D.Type) async throws -> D {
        let data = try await getRawData(request)
        
        return try decoder.decode(model.self, from: data)
    }
}
