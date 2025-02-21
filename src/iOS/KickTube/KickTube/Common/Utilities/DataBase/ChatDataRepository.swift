//
//  ChatDataManager.swift
//  KickTube
//
//  Created by 김수경 on 2/21/25.
//

import Foundation

import RealmSwift

final class ChatDataRepository {
    
    init() {
        printRealmFileURL()
    }
    
    func addMessage(to roomID: String, messages: [ChatMessageEntity]) {
        DispatchQueue(label: "realm.background").async {
                autoreleasepool {
                    let realm = try! Realm()
                    do {
                        try realm.write {
                            let chatRoom = self.getChatRoom(roomID: roomID, realm: realm)
                            realm.add(messages, update: .all)
                            chatRoom.messages.append(objectsIn: messages)
                        }
                        print("Messages successfully added to roomID: \(roomID)")
                    } catch {
                        print("Failed to add messages: \(error)")
                    }
                }
            }
    }

    func fetchMessages(for roomID: String) -> [ChatMessageDomainModel]? {
        let realm = try! Realm()
        if let chatRoom = realm.object(ofType: ChatRoomEntity.self, forPrimaryKey: roomID) {
            return Array(chatRoom.messages.sorted(by: { $0.createdAt < $1.createdAt })).map { $0.toDomainModel() }
        }
        return nil
    }

    func fetchLastMessage(for roomID: String) -> ChatMessageEntity? {
        let realm = try! Realm()
        if let chatRoom = realm.object(ofType: ChatRoomEntity.self, forPrimaryKey: roomID) {
            return chatRoom.messages.last
        }
        return nil
    }

    private func getChatRoom(roomID: String, realm: Realm) -> ChatRoomEntity {
        if let existingRoom = realm.object(ofType: ChatRoomEntity.self, forPrimaryKey: roomID) {
            print("Room already exists with roomID: \(roomID)")
            return existingRoom
        }

        let newRoom = ChatRoomEntity(roomID: roomID)
        realm.add(newRoom)
        print("New room created with roomID: \(roomID)")
        return newRoom
    }
    
    private func printRealmFileURL() {
        if let fileURL = Realm.Configuration.defaultConfiguration.fileURL {
            print("Realm file URL: \(fileURL)")
        } else {
            print("Failed to retrieve Realm file URL.")
        }
    }
}
