//
//  MyRoomReactor.swift
//  KickTube
//
//  Created by 김수경 on 2/3/25.
//

import Foundation

import ReactorKit
import RxSwift

final class MyRoomReactor: Reactor {
    private let networkManager = NetworkManager()
    
    enum Action {
        case viewDidLoad
        case getVideoThumbnail(idx: IndexPath, id: String)
        case deleteButtonTapped(idx: IndexPath)
        case leaveButtonTapped(idx: IndexPath)
    }
    
    enum Mutation {
        case setRooms([MyRoomSection])
        case setThunmbnailImage(data: Data, idx: IndexPath)
        case setImageError(error: Error, idx: IndexPath)
        case deleteRoom(_ idx: IndexPath)
        case leaveRoom(_ idx: IndexPath)
    }
    
    struct State {
        var sections: [MyRoomSection]
    }
    
    var initialState: State = State(
        sections: []
    )
    
    func mutate(action: Action) -> Observable<Mutation> {
        switch action {
        case .viewDidLoad:
            let myRoomList = SampleTest.roomlist.map { $0.toViewModel() }
            let sections = classifyRoom(myRoomList)
            
            return .just(.setRooms(sections))
        case .getVideoThumbnail(let idx, let id):
            return Observable.create { [weak self] observer in
                guard let self else {
                    return  Disposables.create()
                }
                
                let task = Task {
                    do {
                        if let thumbnailData = try await self.networkManager.getYoutubeThumbnail(.youtubeThumbnailLow(id: id)) {
                            observer.onNext(.setThunmbnailImage(data: thumbnailData, idx: idx))
                            observer.onCompleted()
                        }
                    } catch {
                        print("Error fetching thumbnail: \(error)")
                        observer.onNext(.setImageError(error: NetworkError.urlBuild, idx: idx))
                        
                        observer.onCompleted()
                    }
                }
                
                return Disposables.create {
                    task.cancel()
                }
            }
        case .deleteButtonTapped(let idx):
            return .just(.deleteRoom(idx))
        case .leaveButtonTapped(let idx):
            return .just(.leaveRoom(idx))
        }
    }
    
    func reduce(state: State, mutation: Mutation) -> State {
        var newState = state
        
        switch mutation {
        case .setRooms(let sections):
            newState.sections = sections
        case .setThunmbnailImage(let data, let idx):
            var updateSection = newState.sections[idx.section]
            let targetItem = updateSection.items[idx.row]
            
            if case let .created(room) = targetItem {
                var updateItem = room
                
                updateItem.videoThumbnail = data
                updateSection.items[idx.row] = .created(updateItem)
            }
            
            if case let .participated(room) = targetItem {
                var updateItem = room
                
                updateItem.videoThumbnail = data
                updateSection.items[idx.row] = .participated(updateItem)
            }
            
            newState.sections[idx.section] = updateSection
        case .setImageError(_, idx: let idx):
            var updateSection = newState.sections[idx.section]
            let targetItem = updateSection.items[idx.row]
            
            if case let .created(room) = targetItem {
                var updateItem = room
                
                updateItem.videoThumbnail = nil
                updateSection.items[idx.row] = .created(updateItem)
            }
            
            if case let .participated(room) = targetItem {
                var updateItem = room
                
                updateItem.videoThumbnail = nil
                updateSection.items[idx.row] = .participated(updateItem)
            }
            
            newState.sections[idx.section] = updateSection
        case .deleteRoom(let idx):
            var updateSection = newState.sections[idx.section]
          
            updateSection.items.remove(at: idx.row)
            
            newState.sections[idx.section] = updateSection
        case .leaveRoom(let idx):
            var updateSection = newState.sections[idx.section]
            
            updateSection.items.remove(at: idx.row)
            
            newState.sections[idx.section] = updateSection
        }
  
        return newState
    }
    
    
    // MARK: - private method
    
    private func classifyRoom(_ rooms: [MyRoomViewModel]) -> [MyRoomSection] {
        var created = [MyRoomSectionItem]()
        var participated = [MyRoomSectionItem]()
        
        rooms.forEach {
            if $0.creator == SampleTest.userDefaultsProfilename {
                created.append(MyRoomSectionItem.created($0))
            } else {
                participated.append(MyRoomSectionItem.participated($0))
            }
        }
        
        var sections = [MyRoomSection]()
        
        if !created.isEmpty {
            sections.append(
                MyRoomSection(
                    header: created.first?.title ?? "",
                    items: created
                )
            )
        }
        
        if !participated.isEmpty {
            sections.append(
                MyRoomSection(
                    header: participated.first?.title ?? "",
                    items: participated
                )
            )
        }
        
        return sections
    }
}
