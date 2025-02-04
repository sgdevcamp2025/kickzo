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
        case enterRoom(KickRoomViewModel)
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
            let homeRoomList: [HomeRoomDomainModel] = SampleTest.homeViewList
            
            return .just(Mutation.getRoomList(homeRoomList))
        case .getVideoThumbnail(let idx, let id):
            return Observable.create { [weak self] observer in
                guard let self else {
                    return  Disposables.create()
                }
                
                Task {
                    do {
                        if let thumbnailData = try await self.getYoutubeThumbnail(id) {
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
        case .homeCellTapped:
            // 방 입장 네트워크 통신 후
            let roomInformation = SampleTest.createdRoom.toModel()
            
            return .just(.enterRoom(roomInformation))
        }
    }
    
    func reduce(state: State, mutation: Mutation) -> State {
        var newState = state
        
        switch mutation {
        case .getRoomList(let rooms):
            newState.rooms = rooms.map { $0.toViewModel() }
        case .setVideoImage(let data, let idx):
            newState.rooms[idx].videoThumbnail = data
        case .setImageError(_, let idx):
            newState.rooms[idx].videoThumbnail = nil
        case .enterRoom(let room):
            newState.enterRoom = room
        }
        
        return newState
    }
    
    func getYoutubeThumbnail(_ id: String) async throws -> Data? {
        do {
            let url = try YoutubeRouter.youtubeThumbnailHigh(id: id).makeURL()
            return try await networkManager.getCachingDataFromURL(url)
        } catch {
            throw error
        }
    }
}


