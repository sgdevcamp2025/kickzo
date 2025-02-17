//
//  KeyChainManager.swift
//  KickTube
//
//  Created by 김수경 on 2/14/25.
//

import Foundation
import Security

final class KeyChainManager {
    static let shared = KeyChainManager()
    
    private init() {}
    
    @discardableResult
    func save(key: KeyChainValue, value: String) -> Bool {
        guard let data = value.data(using: .utf8) else {
            return false
        }
        
        let query: [CFString: Any] = [kSecClass: kSecClassGenericPassword, kSecAttrAccount: key.rawValue, kSecValueData: data]
        
        SecItemDelete(query as CFDictionary)
        
        let status = SecItemAdd(query as CFDictionary, nil)
        
        return status == errSecSuccess
    }
    
    func read(key: KeyChainValue) -> String? {
        let query: [CFString: Any] = [kSecClass: kSecClassGenericPassword, kSecAttrAccount: key.rawValue, kSecReturnData: true, kSecMatchLimit: kSecMatchLimitOne]
        var dataTypeRef: AnyObject?
        let status = SecItemCopyMatching(query as CFDictionary, &dataTypeRef)
        
        guard status == errSecSuccess,
              let data = dataTypeRef as? Data else {
            return nil
        }
        
        return String(data: data, encoding: .utf8)
    }
    
    func delete(key: KeyChainValue) -> Bool {
        let query: [CFString: Any] = [kSecClass: kSecClassGenericPassword, kSecAttrAccount: key.rawValue]
        let status = SecItemDelete(query as CFDictionary)
        
        return status == errSecSuccess
    }
}
