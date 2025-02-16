//
//  ResponsePipelineRedirector.swift
//  KickTube
//
//  Created by 김수경 on 2/14/25.
//

import Foundation

protocol ResponsePipelineRedirector: AnyObject {
    func shouldApply<T: Request>(request: T, data: Data, response: HTTPURLResponse) -> Bool
    func redirect<T: Request>(request: T, data: Data, response: HTTPURLResponse) async throws -> ResponsePipelineRedirectorAction
}

enum ResponsePipelineRedirectorAction {
    case restart
    case stop(Error)
    case `continue`
}
