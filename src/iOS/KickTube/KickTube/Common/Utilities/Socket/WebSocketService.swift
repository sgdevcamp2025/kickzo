//
//  WebSocketService.swift
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
    
    private let messageSubject = PublishSubject<SocketChatMessageResponseDTO>()
    private let videoTimeSubject = PublishSubject<KickRoomPlayStateResponseDTO>()
    private let newUserSubject = PublishSubject<KickRoomNewUserResponseDTO>()
    private let roleChangeSubject = PublishSubject<KickRoomChangeUserRoleResponseDTO>()
    private let playlistSubject = PublishSubject<KickRoomPlaylistChangeResponseDTO>()
    
    var messageObservable: Observable<SocketChatMessageResponseDTO> {
        return messageSubject.asObservable()
    }
    var videoTimeObservable: Observable<KickRoomPlayStateResponseDTO> {
        return videoTimeSubject.asObservable()
    }
    var newUserObservable: Observable<KickRoomUserResponseDTO> {
        return newUserSubject
            .map { $0.userInfo }
            .asObservable()
    }
    var roleChangeObservable: Observable<KickRoomChangeUserRoleResponseDTO> {
        return roleChangeSubject.asObserver()
    }
    var playlistObservable: Observable<[KickRoomPlaylistResponseDTO]> {
        return playlistSubject
            .map { $0.playlist }
            .asObservable()
    }
    
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
    
    private func unsubscribeAll() {
        guard let roomID else { return }
        [
            WebSocketTopic.subJoinNewUser(roomID),
            WebSocketTopic.subRoleChange(roomID),
            WebSocketTopic.subPlaylistChange(roomID),
            WebSocketTopic.subVideoTime(roomID),
            WebSocketTopic.subMessage(roomID)
        ].forEach {
            stompClient.unsubscribe(destination: $0.endPoint)
        }
    }
}

extension WebSocketService {
    // MARK: - Publish

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
        guard let roomID, let userID else { return }
        
        let videoPayload: [String: Any] = [
            "userId": userID,
            "roomId" : roomID,
            "playTime" : Int(state.time),
            "playerState": state.progress.rawValue
        ]
        
        if let jsonString = videoPayload.toJSONString() {
            stompClient.sendMessage(message: jsonString, toDestination: WebSocketTopic.pubVideoTime.endPoint, withHeaders: nil, withReceipt: nil)
            print("publish Chat Message")
        }
    }
    
    
    // MARK: - Subscribe
    
    private func subscribeChatMessage() {
        guard let roomID else { return }
        
        stompClient.subscribe(destination: WebSocketTopic.subMessage(roomID).endPoint)
        print("Subscribed to \(WebSocketTopic.subMessage(roomID).endPoint)")
    }
    
    private func subscribeVidoeTime() {
        guard let roomID else { return }
        
        stompClient.subscribe(destination: WebSocketTopic.subVideoTime(roomID).endPoint)
        print("Subscribed to \(WebSocketTopic.subVideoTime(roomID).endPoint)")
    }
    
    private func subscribeRoleChange() {
        guard let roomID else { return }
        
        stompClient.subscribe(destination: WebSocketTopic.subRoleChange(roomID).endPoint)
    }
    
    private func subscribeNewUser() {
        guard let roomID else { return }
        
        stompClient.subscribe(destination: WebSocketTopic.subJoinNewUser(roomID).endPoint)
    }
    
    private func subscribePlaylist() {
        guard let roomID else { return }
        
        stompClient.subscribe(destination: WebSocketTopic.subPlaylistChange(roomID).endPoint)
    }
}

extension WebSocketService: StompClientLibDelegate {
    func stompClient(client: StompClientLib!, didReceiveMessageWithJSONBody jsonBody: AnyObject?, akaStringBody stringBody: String?, withHeader header: [String : String]?, withDestination destination: String) {

        guard let roomID else { return }
        
        switch destination {
        case "/topic/room/\(roomID)/chat":
            if let chatMessage = toData(jsonBody, to: SocketChatMessageResponseDTO.self) {
                messageSubject.onNext(chatMessage)
            }
        case "/topic/room/\(roomID)/play-time":
            if let videoTime = toData(jsonBody, to: KickRoomPlayStateResponseDTO.self) {
                videoTimeSubject.onNext(videoTime)
            }
        case "/topic/room/\(roomID)/user-info":
            if let newUser = toData(jsonBody, to: KickRoomNewUserResponseDTO.self) {
                newUserSubject.onNext(newUser)
            }
        case "/topic/room/\(roomID)/role-change":
            if let roleChange = toData(jsonBody, to: KickRoomChangeUserRoleResponseDTO.self) {
                roleChangeSubject.onNext(roleChange)
            }
        case "/topic/room/\(roomID)/playlist-update":
            if let playlist = toData(jsonBody, to: KickRoomPlaylistChangeResponseDTO.self) {
                playlistSubject.onNext(playlist)
            }
        default:
            break
        }
    }
    
    func stompClientDidConnect(client: StompClientLib!) {
        print("STOMP Connected")
        
        publishSendUserID()

        subscribeChatMessage()
        subscribeVidoeTime()
        subscribeNewUser()
        subscribeRoleChange()
        subscribePlaylist()
        
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


extension WebSocketService {
    private func toData<T: Decodable>(_ json: AnyObject?, to: T.Type) -> T? {
        if let jsonBody = json as? [String: Any] {
            do {
                let jsonData = try JSONSerialization.data(withJSONObject: jsonBody)
                let decodedData = try JSONDecoder().decode(T.self, from: jsonData)
                
                return decodedData
            } catch {
                return nil
            }
        }
        return nil
    }
}
