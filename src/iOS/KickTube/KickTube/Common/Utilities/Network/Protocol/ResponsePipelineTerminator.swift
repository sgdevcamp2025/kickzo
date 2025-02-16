//
//  ResponsePipelineTerminator.swift
//  KickTube
//
//  Created by 김수경 on 2/14/25.
//

import Foundation

protocol ResponsePipelineTerminator: AnyObject {
    func parse<T: Request>(request: T, data: Data) throws -> T.Response
}
