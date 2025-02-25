//
//  Dictionary+Extensions.swift
//  KickTube
//
//  Created by 김수경 on 2/24/25.
//

import Foundation

extension Dictionary {
    func toJSONString() -> String? {
        if let jsonData = try? JSONSerialization.data(withJSONObject: self, options: []),
           let jsonString = String(data: jsonData, encoding: .utf8) {
            return jsonString
        }
        
        return nil
    }
}
