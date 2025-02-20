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
    
    enum Action {
        case getSavedMessage
        case getUnreadMessage
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
        // TODO: SwiftData에서 data 받아오기
        self.initialState = State(roomID: roomID, messsageSection: [])
    }
    
    
    func mutate(action: Action) -> Observable<Mutation> {
        switch action {
        case .getSavedMessage:
            // TODO: SwiftData에서 메세지 load
            
//            return loadMessages(from: SampleTest.unreads.map { $0.toModel() }).map { .setMessages(.saved, $0) }
            return .empty()
        case .getUnreadMessage:
            return getUnreadMessage()
        case .getNewMessage:
//            let newMessage = SampleTest.unreads[0].toModel().toModel()
            
//            return .just(.appendNewMessage(newMessage))
            return .empty()
        case .sendMessage(let message):
            let newMessage = ChatMessageDomainModel(messageID: "\(Int.random(in: 1...1000000))", roomID: 43, userID: 5, createdAt: 29384928379, media: nil, message: message, role: 2, nickname: "asdlkfslkj", profileImageURL: nil)
            
            return .just(.appendNewMessage(newMessage.toModel()))
            return .empty()
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
    
    private func loadMessages(from data: [ChatMessageDomainModel]) -> Observable<[ChatMessageViewModel]> {
        let messages = data.map { $0.toModel() }
        
        return .just(messages)
    }
    
    private func getUnreadMessage(_ lastDate: Int? = nil) -> Observable<Mutation> {
        var request = DefaultRequest<[ChatMessageResponseDTO]>(method: .get, path: ["api", "messages", "\(currentState.roomID)"], header: [.json, .authorizationAccessToken])
        
        if let date = lastDate {
            request.pathQueries = [URLQueryItem(name: "cursor", value: String(date)), URLQueryItem(name: "limit", value: "\(1000)")]
        } else {
            request.pathQueries = [URLQueryItem(name: "limit", value: "\(1000)")]
        }
        
        return Observable.create { [weak self] observer in
            guard let self else { return Disposables.create() }
            
            Task {
                do {
                    let response = try await self.session.send(request)
                    
                    observer.onNext(Mutation.setMessages(.unread, response.map { $0.toModel() }))
                    observer.onCompleted()
                } catch {
                    print(error)
                    observer.onCompleted()
                }
            }
            
            return Disposables.create()
        }
    }
    
    private func classifyChatMessage(_ messages: [ChatMessageViewModel], section: ChatSectionType) -> ChatMessageSection {
        let items: [ChatMessageSectionItem] = messages.map {
            switch section {
            case .saved:
                return .localMessage($0)
            case .unread:
                return .unreadMessage($0)
            case .new:
                return .newMessage($0)
            }
        }
        
        return ChatMessageSection(header: section.header, items: items)
    }
}
