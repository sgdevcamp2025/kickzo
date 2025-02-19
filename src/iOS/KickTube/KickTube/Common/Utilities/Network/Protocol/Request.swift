//
//  Request.swift
//  KickTube
//
//  Created by 김수경 on 2/14/25.
//

import Foundation

protocol Request: URLRequestBuildable {
    associatedtype Response: Decodable
    
    var scheme: String { get }
    var baseURL: String { get throws }
    var port: Int { get }
    
    var method: HTTPMethod { get }
    
    var header: [HeaderContent]? { get throws }
    var path: [String] { get }
    var pathQueries: [URLQueryItem]? { get }
    var body: Encodable? { get }
    
    var pipelines: [ResponsePipeline] { get }
    var dataParser: ResponsePipelineTerminator { get }
}

let defaultJSONParser = JSONDecoder()
extension Request {
    var pipelines: [ResponsePipeline] {
        var pipelines: [ResponsePipeline] = []
        
        pipelines.append(contentsOf: [
            .redirector(RefreshTokenRedirector()),
            .redirector(AccessTokenRedirector()),
            .redirector(CreateLimitFiveRedirector()),
            .terminator(dataParser)
        ])
        
        return pipelines
    }
    var dataParser: ResponsePipelineTerminator {
        if Response.self == String.self {
            return StringParsePipeline()
        } else {
            return JSONParsePipeline(defaultJSONParser)
        }
    }
}

extension Request {
    func asURL() throws -> URL {
        var components = URLComponents()
        
        components.scheme = scheme
        components.host = try baseURL
        components.path = "/" + path.joined(separator: "/")
        components.port = port
        
        if let pathQueries {
            components.queryItems = pathQueries
        }
        
        guard let url = components.url else {
            throw NetworkError.urlBuild
        }
        
        return url
    }
    
    func asURLRequest() throws -> URLRequest {
        let url = try asURL()
        var urlRequest = URLRequest(url: url)
        
        urlRequest.httpMethod = method.rawValue
        
        if let header = try header {
            var headers = [String: String]()
            
            header.forEach { content in
                let contentHeaders = content.value
                contentHeaders.forEach { key, value in
                    headers[key] = value
                }
            }
            
            urlRequest.allHTTPHeaderFields = headers
        }
        
        if let body {
            urlRequest.httpBody = try JSONEncoder().encode(body)
        }
        
        return urlRequest
    }
}
