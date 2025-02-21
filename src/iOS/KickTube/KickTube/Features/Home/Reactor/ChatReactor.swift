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
    
    @MainActor
    private let dataManager = ChatDataManager()
    
    enum Action {
        case getSavedMessage
        case getNewMessage
        case sendMessage(String)
    }
    
    enum Mutation {
        case setMessages(ChatSectionType, [ChatMessageDomainModel])
        case appendNewMessage(ChatMessageViewModel)
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
            return Observable.create { [weak self] observer in
                guard let self else { return Disposables.create() }
                
                Task {
                    if let roomID = Int(self.currentState.roomID) {
                        let lastMessageCreatedAt = await self.dataManager.fetchLastMessage(for: roomID)?.createdAt
                        let newMessages = await self.getUnreadMessage(lastMessageCreatedAt)
                        observer.onNext(.setMessages(.saved, newMessages))
                    }
                }
                
                return Disposables.create()
            }
        case .getNewMessage:
//            let newMessage = SampleTest.unreads[0].toModel().toModel()
//            return .just(.appendNewMessage(newMessage))
            return .empty()
        case .sendMessage(let message):
            let newMessage = ChatMessageDomainModel(messageID: "\(Int.random(in: 1...1000000))", roomID: 43, userID: 5, createdAt: 29384928379, media: nil, message: message, role: 2, nickname: "asdlkfslkj", profileImageURL: nil)
            return .just(.appendNewMessage(newMessage.toModel()))
//            return .empty()
        }
    }
    
    func reduce(state: State, mutation: Mutation) -> State {
        var newState = state
        
        switch mutation {
        case .setMessages(let sectionType, let message):
            let section = classifyChatMessage(message.map { $0.toModel() }, section: sectionType)
            
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
    
    private func getUnreadMessage(_ lastDate: Int? = nil) async -> [ChatMessageDomainModel] {
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

        do {
            let response = try await self.session.send(request).map { $0.toModel() }
            
            await self.saveMessage(response)
            
            return await readMessage()
        } catch {
            print("Error:", error)
            return []
        }
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
    
    private func saveMessage(_ message: [ChatMessageDomainModel]) async {
        if let roomID = Int(self.currentState.roomID) {
            await dataManager.addMessage(to: roomID, messages: message.map { $0.toDBModel() })
        }
    }

    @MainActor
    private func readMessage() async -> [ChatMessageDomainModel] {
        if let roomID = Int(currentState.roomID),
           let chats = dataManager.fetchMessages(for: roomID) {
            
            return chats.map { $0.toDomainModel() }
        }
        
        return []
    }
}
