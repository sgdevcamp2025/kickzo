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
    }
    
    enum Mutation {
        case setRooms([MyRoomSection])
        case setThunmbnailImage(data: Data, idx: IndexPath)
        case setImageError(error: Error, idx: IndexPath)
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
                
                Task {
                    do {
                        if let thumbnailData = try await self.getYoutubeThumbnail(id) {
                            observer.onNext(.setThunmbnailImage(data: thumbnailData, idx: idx))
                            observer.onCompleted()
                        }
                    } catch {
                        print("Error fetching thumbnail: \(error)")
                        observer.onNext(.setImageError(error: NetworkError.urlBuild, idx: idx))
                        observer.onCompleted()
                    }
                }
                
                return Disposables.create()
            }
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
        }
        
        return newState
    }
    
    
    // MARK: - private method
    
    private func getYoutubeThumbnail(_ id: String) async throws -> Data? {
        do {
            let url = try YoutubeRouter.youtubeThumbnailLow(id: id).makeURL()
            return try await networkManager.getCachingDataFromURL(url)
        } catch {
            throw error
        }
    }
    
    private func classifyRoom(_ rooms: [MyRoomViewModel]) -> [MyRoomSection] {
        var created = [MyRoomsSectionItem]()
        var participated = [MyRoomsSectionItem]()
        
        rooms.forEach {
            if $0.creator == "userDefaultsProfilename" {
                created.append(MyRoomsSectionItem.created($0))
            } else {
                participated.append(MyRoomsSectionItem.participated($0))
            }
        }
        
        let sections = [
            MyRoomSection(
                header: MyRoomSectionInformation.section0.title,
                items: created
            ),
            MyRoomSection(
                header: MyRoomSectionInformation.section1.title,
                items: participated
            )
        ]
        
        return sections
    }
}
