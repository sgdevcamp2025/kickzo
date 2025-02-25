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
        case localUpdatePlayer(KickRoomPlayerStateViewModel)
        case remoteUpdatePlayer(KickRoomPlayerStateViewModel)
        case myRoleChange(UserRole)
        case setLocalUpdate(Bool)
    }
    enum Mutation {
        case setRoomInformation(KickRoomDomainModel)
        case setVideoPlayer(KickRoomPlayerStateViewModel)
        case setMyRole(UserRole)
        case setWebSocket
        case setLocalTrue(Bool)
    }
    struct State {
        var roomCode: String
        var roomInfo: KickRoomViewModel?
        var youtubeID: String?
        var playState: KickRoomPlayerStateViewModel?
        var playerVars: [String: Any]
        var myRole: UserRole?
        var localUpdate: Bool = true
    }
    
    var initialState: State
    var disposeBag = DisposeBag()
    
    init(_ code: String) {
        self.initialState = State(roomCode: code,
                                  playerVars: ["playsinline": 1, "autoplay": 0, "controls": 2, "showinfo": 1, "start": 0, "rel": 0])
        WebSocketService.shared.videoTimeObservable
            .subscribe(onNext: { [weak self] video in
                guard let self else { return }
                
                let videoInfo = video.toModel()
                if videoInfo.userID == UserDefaultsManager.shared.myProfile.userID { return }
                
                self.action.onNext(.remoteUpdatePlayer(videoInfo))
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
        case .localUpdatePlayer(let state):
            Observable.just(state)
                .takeLast(1)
                .subscribe(onNext: { latestState in
                    WebSocketService.shared.publishVideoTime(latestState)
                })
                .disposed(by: disposeBag)
            return .just(.setWebSocket)
        case .remoteUpdatePlayer(let state):
            return .just(.setVideoPlayer(state))
        case .setLocalUpdate(let state):
            return .just(.setLocalTrue(state))
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
        case .setWebSocket:
            newState.localUpdate = true
            newState.playState = nil
        case .setVideoPlayer(let state):
            newState.localUpdate = false
            newState.playState = state
        case .setLocalTrue:
            newState.localUpdate = true
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
