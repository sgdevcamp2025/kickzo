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
    }
    
    enum Mutation {
        case getRoomList([HomeRoomDomainModel])
        case setVideoImage(data: Data, idx: Int)
        case setImageError(error: Error, idx: Int)
    }
    
    struct State {
        var rooms: [HomeRoomViewModel]
    }
    
    let initialState: State = State(
        rooms: []
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
        }
        
        return newState
    }
    
    func getYoutubeThumbnail(_ id: String) async throws -> Data? {
        do {
            let url = try YoutubeRouter.youtubeThumbnail(id: id).makeURL()
            return try await networkManager.getCachingDataFromURL(url)
        } catch {
            throw error
        }
    }
}
