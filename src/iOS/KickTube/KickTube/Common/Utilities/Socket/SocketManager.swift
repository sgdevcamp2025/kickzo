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
extension WebSocketService: StompClientLibDelegate {
    func stompClient(client: StompClientLib!, didReceiveMessageWithJSONBody jsonBody: AnyObject?, akaStringBody stringBody: String?, withHeader header: [String : String]?, withDestination destination: String) {

        guard let roomID else { return }
    }
    
    func stompClientDidConnect(client: StompClientLib!) {
        print("STOMP Connected")
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
