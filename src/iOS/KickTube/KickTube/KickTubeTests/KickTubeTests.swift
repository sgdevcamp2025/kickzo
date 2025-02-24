//
//  KickTubeTests.swift
//  KickTubeTests
//
//  Created by 김수경 on 1/14/25.
//

import Foundation
import Testing
@testable import KickTube

struct KickTubeTests {
    @Test func example() async throws {
        // Write your test here and use APIs like `#expect(...)` to check expected conditions.
    }
    
    @Test func homeRequestTest_Success() async throws {
        let mockSession = MockSession()
        let expectedData =  [HomeRoomResponseDTO(roomID: 1, code: "E26D622A", title: "쇠맛 세계로 가 보자고", description: "쇠맛 세계로 가 보자고", creator: "수수수수퍼노바", profileImageURL: nil, userCount: 2, playlistURL: nil)]
        let mockData = try JSONEncoder().encode(expectedData)
        let mockResponse = HTTPURLResponse(url: URL(string: "https://example.com/api/rooms/all")!, statusCode: 200, httpVersion: nil, headerFields: nil)
        
        mockSession.mockData = mockData
        mockSession.mockResponse = mockResponse
        
        let session = Session(session: mockSession)
        
        let mainRoomRequest = MockRequest<[HomeRoomResponseDTO]>(method: .get, path: ["api", "rooms", "all"], header: [.json, .authorizationAccessToken], pathQueries: [URLQueryItem(name: "page", value: String(0))])
        
        do {
            let response = try await session.send(mainRoomRequest)
            assert(response == expectedData)
        } catch {
            print("Error: \(error)")
        }
    }
    
    @Test func homeRequestTest_Fail() async throws {
        let mockSession = MockSession()
        let wrongData = [HomeRoomResponseDTO(roomID: 1, code: "E26D622A", title: "쇠맛 세계로 너나 가", description: "쇠맛 세계로 잘 가", creator: "수수수수퍼노바", profileImageURL: nil, userCount: 2, playlistURL: nil)]
        let mockData = try JSONEncoder().encode(wrongData)
        let mockResponse = HTTPURLResponse(url: URL(string: "https://example.com/api/rooms/all")!, statusCode: 200, httpVersion: nil, headerFields: nil)
        
        mockSession.mockData = mockData
        mockSession.mockResponse = mockResponse
        
        let session = Session(session: mockSession)
        
        let mainRoomRequest = MockRequest<[HomeRoomResponseDTO]>(method: .get, path: ["api", "rooms", "all"], header: [.json, .authorizationAccessToken], pathQueries: [URLQueryItem(name: "page", value: String(0))])
        
        do {
            let response = try await session.send(mainRoomRequest)
            let expectedData = [HomeRoomResponseDTO(roomID: 1, code: "E26D622A", title: "쇠맛 세계로 가 보자고", description: "쇠맛 세계로 가 보자고", creator: "수수수수퍼노바", profileImageURL: nil, userCount: 2, playlistURL: nil)]
            assert(response == expectedData)
        } catch {
            print("Error: \(error)")
        }
    }
}
