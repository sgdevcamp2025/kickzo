//
//  HomeReactor.swift
//  KickTube
//
//  Created by 김수경 on 1/30/25.
//

import Foundation

import ReactorKit

final class HomeReactor: Reactor {
    private let session = Session()
    private let networkManager = NetworkManager()
    
    enum Action {
        case getRoom
        case getVideoThumbnail(idx: Int, id: String)
        case getProfileThumbnail(idx: Int, url: URL)
        case homeCellTapped(idx: IndexPath)
    }
    
    enum Mutation {
        case setRooms([HomeRoomDomainModel])
        case setVideoImage(data: Data, idx: Int)
        case setProfileImage(data: Data, idx: Int)
        case setImageError(error: Error, idx: Int)
        case joinRoom(String)
    }
    
    struct State {
        var rooms: [HomeRoomViewModel]
        var joinRoomCode: String?
        var roomListPage: Int
    }
    
    let initialState: State = State(
        rooms: [],
        joinRoomCode: nil,
        roomListPage: 0
    )
    
    func mutate(action: Action) -> Observable<Mutation> {
        switch action {
        case .getRoom:
            return getRooms(currentState.roomListPage)
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
        case .getProfileThumbnail(let idx, let url):
            return Observable.create { [weak self] observer in
                guard let self else {
                    return  Disposables.create()
                }
                
                Task {
                    do {
                        let profileData = try await self.networkManager.getCachingDataFromURL(url)
                            observer.onNext(.setProfileImage(data: profileData, idx: idx))
                            observer.onCompleted()
                    } catch {
                        print("Error fetching thumbnail: \(error)")
                        observer.onNext(.setImageError(error: NetworkError.urlBuild, idx: idx))
                        observer.onCompleted()
                    }
                }
                
                return Disposables.create()
            }
        case .homeCellTapped(let idx):
            let roomCode = currentState.rooms[idx.item].code
            return .just(.joinRoom(roomCode))
        }
    }
    
    func reduce(state: State, mutation: Mutation) -> State {
        var newState = state
        
        switch mutation {
        case .setRooms(let rooms):
            newState.roomListPage += 1
            newState.rooms += rooms.map { $0.toModel() }
        case .setVideoImage(let data, let idx):
            newState.rooms[idx].videoThumbnail = data
        case .setProfileImage(let data, let idx):
            newState.rooms[idx].profileThumbnanil = data
        case .setImageError(_, let idx):
            newState.rooms[idx].videoThumbnail = nil
        case .joinRoom(let code):
            newState.joinRoomCode = code
        }
        
        return newState
    }
    
    private func getRooms(_ page: Int, _ size: Int? = nil) -> Observable<Mutation> {
        var mainRoomRequest = DefaultRequest<[HomeRoomResponseDTO]>(method: .get, path: ["api", "rooms", "all"], header: [.authorizationAccessToken], pathQueries: [URLQueryItem(name: "page", value: String(page))])
        
        if let size {
            mainRoomRequest.pathQueries?.append(URLQueryItem(name: "size", value: String(size)))
        }
        
        return Observable.create { [weak self] observer in
            guard let self else { return Disposables.create() }
            
            Task {
                do {
                    let mainRoomResponse = try await self.session.send(mainRoomRequest)
                    
                    observer.onNext(Mutation.setRooms(mainRoomResponse.map { $0.toModel() }))
                    observer.onCompleted()
                } catch {
                    print(error)
                    observer.onCompleted()
                }
            }
            
            return Disposables.create()
        }
    }
}
