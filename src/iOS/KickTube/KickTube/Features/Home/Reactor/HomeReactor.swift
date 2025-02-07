//
//  HomeReactor.swift
//  KickTube
//
//  Created by 김수경 on 1/30/25.
//

import Foundation

import ReactorKit

final class HomeReactor: Reactor {
    private let networkManager = NetworkManager()
    
    enum Action {
        case viewDidLoad
        case getVideoThumbnail(idx: Int, id: String)
        case homeCellTapped(idx: IndexPath)
    }
    
    enum Mutation {
        case getRoomList([HomeRoomDomainModel])
        case setVideoImage(data: Data, idx: Int)
        case setImageError(error: Error, idx: Int)
        case enterRoom(KickRoomDomainModel)
    }
    
    struct State {
        var rooms: [HomeRoomViewModel]
        var enterRoom: KickRoomViewModel?
    }
    
    let initialState: State = State(
        rooms: [],
        enterRoom: nil
    )
    
    func mutate(action: Action) -> Observable<Mutation> {
        switch action {
        case .viewDidLoad:
//            return Observable.create { [weak self] observer in
//                guard let self else {
//                    return  Disposables.create()
//                }
//                
//                Task {
//                    do {
//                        let decoded = try await self.networkManager.getDecodedData(request: HomeRouter.getAllRooms.makeURLRequest(), to: [HomeRoomResponse].self)
//                        observer.onNext(.getRoomList(decoded.map { $0.toModel() }))
//                        observer.onCompleted()
//                    } catch {
//                        print("Error fetching thumbnail: \(error)")
//                        observer.onCompleted()
//                    }
//                }
//                
//                return Disposables.create()
//            }
            return .just(Mutation.getRoomList(SampleTest.homeViewList))
        case .getVideoThumbnail(let idx, let id):
            return Observable.create { [weak self] observer in
                guard let self else {
                    return  Disposables.create()
                }
                
                Task {
                    do {
                        if let thumbnailData = try await self.networkManager.getYoutubeThumbnail(.youtubeThumbnailHigh(id: id)) {
                            observer.onNext(.setVideoImage(data: thumbnailData, idx: idx))
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
        case .homeCellTapped(let idx):
            let roomID = currentState.rooms[idx.item].roomID
            return .just(.enterRoom(SampleTest.createdRoom))
        }
    }
    
    func reduce(state: State, mutation: Mutation) -> State {
        var newState = state
        
        switch mutation {
        case .getRoomList(let rooms):
            newState.rooms = rooms.map { $0.toModel() }
        case .setVideoImage(let data, let idx):
            newState.rooms[idx].videoThumbnail = data
        case .setImageError(_, let idx):
            newState.rooms[idx].videoThumbnail = nil
        case .enterRoom(let room):
            newState.enterRoom = room.toModel()
        }
        
        return newState
    }
}
