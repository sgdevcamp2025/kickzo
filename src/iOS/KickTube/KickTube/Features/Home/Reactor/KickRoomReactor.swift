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
        case stopPlayer(KickRoomPlayerStateViewModel)
        case playPlayer(KickRoomPlayerStateViewModel)
        case myRoleChange(UserRole)
    }
    enum Mutation {
        case setRoomInformation(KickRoomDomainModel)
        case setVideoPlayer(KickRoomPlayerStateViewModel)
        case setMyRole(UserRole)
    }
    struct State {
        var roomCode: String
        var roomInfo: KickRoomViewModel?
        var youtubeID: String?
        var playState: KickRoomPlayerStateViewModel?
        var playerVars: [String: Any]
        var playFirst: Bool
        var myRole: UserRole?
    }
    
    var initialState: State
    var disposeBag = DisposeBag()
    
    init(_ code: String) {
        self.initialState = State(roomCode: code,
                                  playerVars: ["playsinline": 1, "autoplay": 0, "controls": 2, "showinfo": 1, "start": 0, "rel": 0],
                                  playFirst: false)
        WebSocketService.shared.videoTimeObservable
            .subscribe(onNext: { [weak self] video in
                guard let self else { return }
                
                let videoInfo = video.toModel()
                switch videoInfo.progress {
                case .playing:
                    self.action.onNext(.playPlayer(videoInfo))
                case .paused:
                    self.action.onNext(.stopPlayer(videoInfo))
                case .ended:
                    print("ended")
                case .none:
                    break
                }
            })
            .disposed(by: disposeBag)
        
        WebSocketService.shared.roleChangeObservable
            .filter { $0.targetUserID == UserDefaultsManager.shared.myProfile.userID }
            .map { $0.toModel().toModel().newRole }
            .subscribe(onNext: { [weak self] myRole in
                self?.action.onNext(.myRoleChange(myRole))
            })
            .disposed(by: disposeBag)
    }
    
    func mutate(action: Action) -> Observable<Mutation> {
        switch action {
        case .viewWillAppear:
            return joinRoom()
        case .stopPlayer(let state), .playPlayer(let state):
            WebSocketService.shared.publishVideoTime(state)
            return .just(.setVideoPlayer(state))
        case .myRoleChange(let role):
            return .just(.setMyRole(role))
        }
    }
    
    func reduce(state: State, mutation: Mutation) -> State {
        var newState = state
        
        switch mutation {
        case .setRoomInformation(let value):
            newState.roomInfo = value.toModel()
            newState.youtubeID = value.roomDetail.playlist.first?.url.youtubeID
            UserDefaultsManager.shared.myRole = value.myRole
            
            if newState.roomInfo?.myRole == .member {
                newState.playerVars["controls"] = 0
            }
        case .setVideoPlayer(let state):
            if !newState.playFirst {
                newState.playFirst = true
            } else {
                newState.playState = state
            }
        case .setMyRole(let role):
            newState.myRole = role
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
                        let roomResponse = try await self.session.send(joinRoomRequest).toModel()
                        
                        WebSocketService.shared.configure(urlString: WebSocketURL.chat, roomID: roomResponse.roomDetail.roomInfo.roomID)
                        WebSocketService.shared.connect { isConnected in
                            if isConnected {
                                print("connected, kickroomreactor")
                            }
                        }
                        
                        observer.onNext(Mutation.setRoomInformation(roomResponse))
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
