//
//  CacheManager.swift
//  KickTube
//
//  Created by 김수경 on 1/23/25.
//

import Foundation

final class CacheManager {
    private let cache = NSCache<NSString, NSData>()
    
    func saveToCache(data: Data, forKey key: String) {
        cache.setObject(data as NSData, forKey: key as NSString)
    }
    
    func loadFromCache(forKey key: String) -> Data? {
        return cache.object(forKey: key as NSString) as Data?
    }
    
    func removeFromCache(forKey key: String) {
        cache.removeObject(forKey: key as NSString)
    }
}
