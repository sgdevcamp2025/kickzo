//
//  JSONParsePipeline.swift
//  KickTube
//
//  Created by 김수경 on 2/14/25.
//

import Foundation

final class JSONParsePipeline: ResponsePipelineTerminator {
    let parser: JSONDecoder
    
    init(_ parser: JSONDecoder) {
        self.parser = parser
    }

    func parse<T: Request>(request: T, data: Data) throws -> T.Response {
        return try parser.decode(T.Response.self, from: data)
    }
}
