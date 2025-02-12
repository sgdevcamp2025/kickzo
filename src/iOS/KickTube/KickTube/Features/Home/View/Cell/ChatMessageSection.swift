//
//  ChatMessageSection.swift
//  KickTube
//
//  Created by 김수경 on 2/12/25.
//

import Foundation

import RxDataSources

struct ChatMessageSection {
    var header: String
    var items: [Item]
}

extension ChatMessageSection: AnimatableSectionModelType {
    var identity: String {
        return header
    }
}

extension ChatMessageSection: SectionModelType {
    typealias Item = ChatMessageSectionItem
    
    init(original: ChatMessageSection, items: [Item]) {
        self = original
        self.items = items
    }
}

enum ChatMessageSectionItem {
    case localMessage(ChatMessageViewModel)
    case unreadMessage(ChatMessageViewModel)
    case newMessage(ChatMessageViewModel)
}

extension ChatMessageSectionItem: IdentifiableType, Equatable {
    var identity: String {
        switch self {
        case .localMessage(let viewModel),
             .unreadMessage(let viewModel),
             .newMessage(let viewModel):
            return viewModel.messageID
        }
    }
    
    static func == (lhs: ChatMessageSectionItem, rhs: ChatMessageSectionItem) -> Bool {
        return lhs.identity == rhs.identity
    }
}

enum ChatSectionType {
    case saved
    case unread
    case new
}

extension ChatSectionType {
    var header: String {
        switch self {
        case .saved: return "saved"
        case .unread: return "unread"
        case .new: return "new"
        }
    }
}
