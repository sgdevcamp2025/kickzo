//
//  Session.swift
//  KickTube
//
//  Created by 김수경 on 2/14/25.
//

import Foundation

final class Session {
    private let session: URLSessionProtocol
    
    init(session: URLSessionProtocol = URLSession.shared) {
        self.session = session
    }
    
    @discardableResult
    func send<T: Request>(_ request: T) async throws -> T.Response {
        let urlRequest: URLRequest
        
        do {
            urlRequest = try request.asURLRequest()
        } catch {
            throw NetworkError.urlRequstBuild
        }
        
        let (data, response) = try await session.data(for: urlRequest)
        
        guard let httpResponse = response as? HTTPURLResponse else {
            throw NetworkError.nonHTTPResponse
        }
        
        guard (200..<300).contains(httpResponse.statusCode) else {
            for pipeline in request.pipelines {
                if case .redirector(let redirector) = pipeline,
                   redirector.shouldApply(request: request, data: data, response: httpResponse) {
                    let action = try await redirector.redirect(request: request, data: data, response: httpResponse)
                    
                    switch action {
                    case .continue:
                        break
                    case .restart:
                        return try await send(request)
                    case .stop(let error):
                        throw error
                    }
                }
            }
            
            throw NetworkError.httpError(httpResponse.statusCode)
        }
        
        guard let parser = request.pipelines.compactMap({ pipeline in
            if case .terminator(let p) = pipeline {
                return p
            } else {
                return nil
            }
        }).first else {
            throw NetworkError.missingParser
        }
        
        return try parser.parse(request: request, data: data)
    }
}
