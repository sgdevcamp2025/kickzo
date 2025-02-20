//
//  MockSession.swift
//  KickTube
//
//  Created by 김수경 on 2/21/25.
//

import Foundation
@testable import KickTube

import Foundation
@testable import KickTube

final class MockSession: URLSessionProtocol {
    var mockData: Data?
    var mockResponse: URLResponse?
    var mockError: Error?
    
    func data(for request: URLRequest) throws -> (Data, URLResponse) {
        if let error = mockError {
            throw error
        }
        
        guard let data = mockData, let response = mockResponse else {
            throw URLError(.badServerResponse)
        }
        
        return (data, response)
    }
}
