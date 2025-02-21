//
//  ChatDataManager.swift
//  KickTube
//
//  Created by 김수경 on 2/21/25.
//

import Foundation
import SwiftData

@MainActor
final class ChatDataManager {
    private(set) var container: ModelContainer

    init() {
        do {
            container = try ModelContainer(for: ChatRoomEntity.self, ChatMessageEntity.self)
        } catch {
            fatalError("Failed to initialize ModelContainer: \(error)")
        }
    }
    
    func addMessage(to roomID: Int, messages: [ChatMessageEntity]) {
        let context = container.mainContext
        let chatRoom = getChatRoom(roomID: roomID)
        
        for message in messages {
            chatRoom.messages.append(message)
        }

        do {
            try context.save()
            print("Messages successfully added to roomID: \(roomID)")
        } catch {
            print("Failed to save messages: \(error)")
        }
    }

    func fetchMessages(for roomID: Int) -> [ChatMessageEntity]? {
        let context = container.mainContext
        
        let fetchRequest = FetchDescriptor<ChatRoomEntity>(
            predicate: #Predicate { $0.roomID == roomID }
        )
        
        do {
            if let room = try context.fetch(fetchRequest).first {
                let sortedMessages = room.messages.sorted { $0.createdAt < $1.createdAt }
                return Array(sortedMessages)
            }
        } catch {
            print("Failed to fetch messages: \(error)")
        }
        
        return nil
    }

    
    func fetchLastMessage(for roomID: Int) -> ChatMessageEntity? {
        let context = container.mainContext
        let fetchRequest = FetchDescriptor<ChatRoomEntity>(
            predicate: #Predicate { $0.roomID == roomID }
        )

        do {
            if let room = try context.fetch(fetchRequest).first {
                return room.messages.last
            }
        } catch {
            print("Failed to fetch messages: \(error)")
        }
        
        return nil
    }
    
    private func getChatRoom(roomID: Int) -> ChatRoomEntity {
        let context = container.mainContext
        let fetchRequest = FetchDescriptor<ChatRoomEntity>(
            predicate: #Predicate { $0.roomID == roomID }
        )
        
        do {
            if let existingRoom = try context.fetch(fetchRequest).first {
                print("Room already exists with roomID: \(roomID)")
                return existingRoom
            }
        } catch {
            print("Failed to fetch room: \(error)")
        }
        
        let newRoom = ChatRoomEntity(roomID: roomID)
        context.insert(newRoom)

        do {
            try context.save()
            print("New room created with roomID: \(roomID)")
        } catch {
            print("Failed to save new room: \(error)")
        }
        return newRoom
    }
}
