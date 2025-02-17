//
//  KickRoomReactor.swift
//  KickTube
//
//  Created by 김수경 on 2/4/25.
//

import Foundation

import ReactorKit
import RxSwift
import YouTubeiOSPlayerHelper

final class KickRoomReactor: Reactor {
    private let session = Session()
    
    enum Action {
        case viewWillAppear
        case stopPlayer(KickRoomPlayerState)
        case playPlayer(KickRoomPlayerState)
    }
    enum Mutation {
        case setRoomInformation(KickRoomDomainModel)
        case setVideoPlayer(KickRoomPlayerState)
    }
    struct State {
        var roomCode: String
        var roomInfo: KickRoomViewModel?
        var youtubeID: String?
        var playState: KickRoomPlayerState?
        var playerVars: [String: Any]
        var playFirst: Bool
    }
    
    var initialState: State
    
    init(_ code: String) {
        self.initialState = State(roomCode: code,
                                  playerVars: ["playsinline": 1, "autoplay": 1, "controls": 2, "showinfo": 1, "start": 0, "rel": 0],
                                  playFirst: false)
    }
    
    func mutate(action: Action) -> Observable<Mutation> {
        switch action {
        case .viewWillAppear:
            return joinRoom()
        case .stopPlayer(let state):
            return .just(.setVideoPlayer(state))
        case .playPlayer(let state):
            return .just(.setVideoPlayer(state))
        }
    }
    
    func reduce(state: State, mutation: Mutation) -> State {
        var newState = state
        
        switch mutation {
        case .setRoomInformation(let value):
            newState.roomInfo = value.toModel()
            newState.youtubeID = value.roomDetail.playlist.first?.url.youtubeID
            if newState.roomInfo?.myRole == .member {
                newState.playerVars["controls"] = 0
            }
        case .setVideoPlayer(let state):
            if !newState.playFirst {
                newState.playFirst = true
            } else {
                newState.playState = state
            }
        }
    
        return newState
    }
    
    private func joinRoom() -> Observable<Mutation> {
        let joinRoomRequest = DefaultRequest<KickRoomResponseDTO>(method: .post, path: ["api", "rooms", "join"], header: [.json, .authorizationAccessToken], body: JoinRoomRequestDTO(roomCode: currentState.roomCode))
        
        do {
            return Observable.create { [weak self] observer in
                guard let self else { return Disposables.create() }
                
                Task {
                    do {
                        let createRoomResponse = try await self.session.send(joinRoomRequest)
                        
                        observer.onNext(Mutation.setRoomInformation(createRoomResponse.toModel()))
                        observer.onCompleted()
                    } catch NetworkError.createRoom {
                        observer.onCompleted()
                    }
                }
                return Disposables.create()
            }
        }
    }
}

struct KickRoomPlayerState {
    var progress: PlayState = .none
    var time: Float = 0
    
    enum PlayState {
        case paused
        case playing
        case none
    }
}
