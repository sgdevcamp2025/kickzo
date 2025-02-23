//
//  ChatReactor.swift
//  KickTube
//
//  Created by 김수경 on 2/11/25.
//

import Foundation

import ReactorKit

final class ChatReactor: Reactor {
    private let session = Session()
    private let repository = ChatDataRepository()
    
    enum Action {
        case getSavedMessage
        case getNewMessage
        case sendMessage(String)
    }
    
    enum Mutation {
        case setMessages(ChatSectionType, [ChatMessageDomainModel])
        case appendNewMessage(ChatMessageDomainModel)
    }
    
    struct State {
        var roomID: String
        var messsageSection: [ChatMessageSection]
    }
    
    var initialState: State
    
    init(_ roomID: String) {
        self.initialState = State(roomID: roomID, messsageSection: [])
    }
    
    func mutate(action: Action) -> Observable<Mutation> {
        switch action {
        case .getSavedMessage:
            return Single.create { [weak self] single in
                guard let self else {
                    single(.failure(NSError(domain: "ChatReactor", code: -1, userInfo: [NSLocalizedDescriptionKey: "Self is nil."])))
                    return Disposables.create()
                }
                
                Task {
                    let lastMessage = self.repository.fetchMessages(for: self.currentState.roomID) ?? []
                    let lastMessageCreatedAt = lastMessage.last?.createdAt
                    let newMessages = try await self.getUnreadMessage(lastMessageCreatedAt)
                    let message = lastMessage + newMessages
                    
                    single(.success(.setMessages(.saved, message)))
                }
                
                return Disposables.create()
            }
            .asObservable()
            
        case .getNewMessage:
            return .empty()

        case .sendMessage(let message):
            WebSocketService.shared.publishChatMessage(message: message)
            return .empty()
        }
    }

    func reduce(state: State, mutation: Mutation) -> State {
        var newState = state

        switch mutation {
        case .setMessages(let sectionType, let messages):
            let section = classifyChatMessage(messages.map { $0.toModel() }, section: sectionType)
            
            if let index = newState.messsageSection.firstIndex(where: { $0.header == sectionType.header }) {
                newState.messsageSection[index] = section
            } else {
                newState.messsageSection.append(section)
            }

        case .appendNewMessage(let message):
            if let newSectionIndex = newState.messsageSection.firstIndex(where: { $0.header == ChatSectionType.new.header }) {
                newState.messsageSection[newSectionIndex].items.append(.newMessage(message))
            } else {
                let newSection = classifyChatMessage([message], section: .new)
                newState.messsageSection.append(newSection)
            }
        }

        return newState
    }

    
    private func getUnreadMessage(_ lastDate: Int? = nil) async throws -> [ChatMessageDomainModel] {
        var request: DefaultRequest<[ChatMessageResponseDTO]>

        if let lastDate {
            request = DefaultRequest<[ChatMessageResponseDTO]>(
                method: .get,
                path: ["api", "messages", "unread", "\(self.currentState.roomID)"],
                header: [.json, .authorizationAccessToken],
                pathQueries: [
                    URLQueryItem(name: "cursor", value: "\(lastDate)"),
                    URLQueryItem(name: "limit", value: "1000")
                ]
            )
        } else {
            request = DefaultRequest<[ChatMessageResponseDTO]>(
                method: .get,
                path: ["api", "messages", "\(self.currentState.roomID)"],
                header: [.json, .authorizationAccessToken],
                pathQueries: [URLQueryItem(name: "limit", value: "1000")]
            )
        }

        let response = try await self.session.send(request).map { $0.toModel() }
        repository.addMessage(to: currentState.roomID, messages: response.map { $0.toDBModel() })
        return response
    }





    private func classifyChatMessage(_ messages: [ChatMessageViewModel], section: ChatSectionType) -> ChatMessageSection {
        guard !messages.isEmpty else {
            return ChatMessageSection(header: section.header, items: [])
        }
        
        let items: [ChatMessageSectionItem] = messages.map {
            switch section {
            case .saved:
                return .savedMessage($0)
            case .unread:
                return .unreadMessage($0)
            case .new:
                return .newMessage($0)
            }
        }
        
        return ChatMessageSection(header: section.header, items: items)
    }
    
    private func saveMessage(_ message: [ChatMessageDomainModel]) {
        repository.addMessage(to: currentState.roomID, messages: message.map { $0.toDBModel() })
        }
    

    private func readMessage() -> [ChatMessageDomainModel] {
        return repository.fetchMessages(for: currentState.roomID) ?? []
    }
}
