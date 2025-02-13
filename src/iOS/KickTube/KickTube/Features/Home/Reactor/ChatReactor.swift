//
//  ChatReactor.swift
//  KickTube
//
//  Created by 김수경 on 2/11/25.
//

import Foundation

import ReactorKit

final class ChatReactor: Reactor {
    enum Action {
        case getSavedMessage
        case getUnreadMessage
        case getNewMessage
        case sendMessage(String)
    }
    
    enum Mutation {
        case setMessages(ChatSectionType, [ChatMessageViewModel])
        case appendNewMessage(ChatMessageViewModel)
    }
    
    struct State {
        var messages: [ChatMessageSection]
    }
    
    var initialState: State
    
    init() {
        // TODO: SwiftData에서 data 받아오기
        self.initialState = State(messages: [])
    }
    
    
    func mutate(action: Action) -> Observable<Mutation> {
        switch action {
        case .getSavedMessage:
            // TODO: SwiftData에서 메세지 load
            
            return loadMessages(from: SampleTest.unreads.map { $0.toModel() }).map { .setMessages(.saved, $0) }
        case .getUnreadMessage:
            // TODO: api 통신

            return loadMessages(from: SampleTest.unreads.map { $0.toModel() }).map { .setMessages(.unread, $0)  }
        case .getNewMessage:
            let newMessage = SampleTest.unreads[0].toModel().toModel()
            
            return .just(.appendNewMessage(newMessage))
        case .sendMessage(let message):
            let newMessage = ChatMessageDomainModel(messageID: "\(Int.random(in: 1...1000000))", roomID: 1, userID: 4, mediaContent: nil, message: message, createdAt: Date()).toModel()
            
            return .just(.appendNewMessage(newMessage))
        }
    }
    
    func reduce(state: State, mutation: Mutation) -> State {
        var newState = state
        
        switch mutation {
        case .setMessages(let sectionType, let message):
            let section = classifyChatMessage(message, section: sectionType)
            if let index = newState.messages.firstIndex(where: { $0.header == sectionType.header }) {
                newState.messages[index] = section
            } else {
                newState.messages.append(section)
            }
        case .appendNewMessage(let message):
            if let newSectionIndex = newState.messages.firstIndex(where: { $0.header == ChatSectionType.new.header }) {
                newState.messages[newSectionIndex].items.append(.newMessage(message))
            } else {
                let newSection = classifyChatMessage([message], section: .new)
                
                newState.messages.append(newSection)
            }
        }
        
        return newState
    }
    
    private func loadMessages(from data: [ChatMessageDomainModel]) -> Observable<[ChatMessageViewModel]> {
        let messages = data.map { $0.toModel() }
        
        return .just(messages)
    }
    
    func classifyChatMessage(_ messages: [ChatMessageViewModel], section: ChatSectionType) -> ChatMessageSection {
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
