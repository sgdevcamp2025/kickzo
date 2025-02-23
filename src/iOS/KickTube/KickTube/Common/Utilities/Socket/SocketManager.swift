//
//  SocketManager.swift
//  KickTube
//
//  Created by 김수경 on 2/22/25.
//

import Foundation

import RxSwift
import StompClientLib

class WebSocketService: NSObject {
    static let shared = WebSocketService()

    private var stompClient: StompClientLib
    private var url: URL?
    
    private var connectionCompletion: ((Bool) -> Void)?
    private var messageHandler: ((String, Any?) -> Void)?
    
    private var userID: Int?
    private var roomID: String?
    
    private override init() {
        self.stompClient = StompClientLib()
        super.init()
    }

    func configure(urlString: WebSocketEndPointConfigurable, roomID: Int) {
        guard let websocketURL = try? urlString.asURL() else {
            fatalError("Invalid WebSocket URL")
        }
        
        self.url = websocketURL
        self.userID = UserDefaultsManager.shared.myProfile.userID
        self.roomID = String(roomID)
    }

    func connect(completion: @escaping (Bool) -> Void) {
        guard let url = self.url else {
            print("STOMP Service is not configured.")
            completion(false)
            return
        }

        stompClient.openSocketWithURLRequest(
            request: NSURLRequest(url: url),
            delegate: self
        )
        
        self.connectionCompletion = completion
    }
    func disconnect() {
        unsubscribeAll()
        stompClient.disconnect()
        
        print("STOMP disconnected")
    }
    
    func subscribe(to topic: WebSocketTopic, handler: @escaping (String, Any?) -> Void) {
        stompClient.subscribe(destination: topic.endPoint)
        self.messageHandler = handler
    }
    
    func unsubscribe(topic: WebSocketTopic) {
        stompClient.unsubscribe(destination: topic.endPoint)
    }
    private func publishSendUserID() {
        guard let userID else { return }
        
        let payload: [String: Int] = [
            "userId": userID
        ]
        
        if let jsonString = payload.toJSONString() {
            stompClient.sendMessage(message: jsonString, toDestination: WebSocketTopic.pubSendUserId.endPoint, withHeaders: nil, withReceipt: nil)
            print("Entered room with userId: \(userID)")
        }
    }
    
    func publishChatMessage(message: String?)   {
        guard let roomID else { return }
        guard let userID else { return }
        
        let chatPayload: [String: Any?] = [
            "roomId": roomID,
            "userId": userID,
            "nickname": UserDefaultsManager.shared.myProfile.nickname,
            "role": UserDefaultsManager.shared.myRole.rawValue,
            "profileImageUrl": UserDefaultsManager.shared.myProfile.profileImageURL,
            "content": nil,
            "message": message
        ]

        if let jsonString = chatPayload.toJSONString() {
            stompClient.sendMessage(message: jsonString, toDestination: WebSocketTopic.pubMessage.endPoint, withHeaders: nil, withReceipt: nil)
        }
    }
    
    func publishVideoTime(_ state: KickRoomPlayerStateViewModel) {
        guard let roomID else { return }
        
        let videoPayload: [String: Any] = [
            "roomId" : roomID,
            "playTime" : Int(state.time),
            "playerState": state.progress.rawValue
        ]
        
        if let jsonString = videoPayload.toJSONString() {
            stompClient.sendMessage(message: jsonString, toDestination: WebSocketTopic.pubVideoTime.endPoint, withHeaders: nil, withReceipt: nil)
            print("publish Chat Message")
        }
    }
extension WebSocketService: StompClientLibDelegate {
    func stompClient(client: StompClientLib!, didReceiveMessageWithJSONBody jsonBody: AnyObject?, akaStringBody stringBody: String?, withHeader header: [String : String]?, withDestination destination: String) {

        guard let roomID else { return }
    }
    
    func stompClientDidConnect(client: StompClientLib!) {
        print("STOMP Connected")
        publishSendUserID()
        connectionCompletion?(true)
    }

    func stompClientDidDisconnect(client: StompClientLib!) {
        print("STOMP Disconnected")
    }

    func stompClientError(client: StompClientLib!, didReceiveErrorMessage description: String) {
        print("STOMP Error: \(description)")
    }

    func serverDidSendReceipt(client: StompClientLib!, withReceiptId receiptId: String) {
        print("STOMP Receipt: \(receiptId)")
    }
    
    func serverDidSendMessage(client: StompClientLib!, withMessage message: String, withDestination destination: String) {
        print("Message Received: \(message) from \(destination)")
        messageHandler?(destination, message)
    }

    func serverDidSendError(client: StompClientLib!, withErrorMessage description: String, detailedErrorMessage message: String?) {
        print("STOMP Server Error: \(description) - \(message ?? "")")
    }

    func serverDidSendPing() {
        print("STOMP Ping received")
    }
}

    }
