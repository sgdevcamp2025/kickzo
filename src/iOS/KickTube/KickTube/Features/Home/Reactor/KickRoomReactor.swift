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
    enum Action {
        case stopPlayer(KickRoomPlayerState)
        case playPlayer(KickRoomPlayerState)
    }
    enum Mutation {
        case setVideoPlayer(KickRoomPlayerState)
    }
    struct State {
        var roomInfo: KickRoomViewModel
        var youtubeID: String?
        var playState: KickRoomPlayerState?
        var playerVars: [String: Any]
        var playFirst: Bool
    }
    
    var initialState: State
    
    init(_ roomInfo: KickRoomViewModel) {
        var initialState = State(
            roomInfo: roomInfo,
            playState: nil,
            playerVars: ["playsinline": 1, "autoplay": 1, "controls": 2, "showinfo": 1, "start": 0, "rel": 0],
            playFirst: false
        )
        
        if roomInfo.playlist.order.count > 0 {
            initialState.youtubeID = roomInfo.playlist.order.first?.url.youTubeID
        }
        
        if roomInfo.myRole == .member {
            initialState.playerVars["controls"] = 0
        }
        
        self.initialState = initialState
    }
    
    func mutate(action: Action) -> Observable<Mutation> {
        switch action {
        case .stopPlayer(let state):
            return .just(.setVideoPlayer(state))
        case .playPlayer(let state):
            return .just(.setVideoPlayer(state))
        }
    }
    
    func reduce(state: State, mutation: Mutation) -> State {
        var newState = state
        
        switch mutation {
        case .setVideoPlayer(let state):
            if !newState.playFirst {
                newState.playFirst = true
            } else {
                newState.playState = state
            }
        }
    
        return newState
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
