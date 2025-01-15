//
//  JSONDecodeService.swift
//  KickTube
//
//  Created by 김수경 on 1/15/25.
//

import Foundation

final class JSONDecodeService {
    private let decoder = JSONDecoder()
    
    func decodeData<D: Decodable>(_ type: D.Type, from data: Data) throws -> D {
        return try decoder.decode(type, from: data)
    }
}
