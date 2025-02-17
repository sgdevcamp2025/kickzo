//
//  CreateRoomReactor.swift
//  KickTube
//
//  Created by 김수경 on 1/31/25.
//

import Foundation

import ReactorKit

final class CreateRoomReactor: Reactor {
    private let session = Session()
    
    enum Action {
        case writeTitle(_ text: String)
        case writeDescription(_ text: String?)
        case publicButtonTapped
        case privateButtonTapped
        case createButtonTapped
    }
    
    enum Mutation {
        case setTitle(_ text: String)
        case setDescription(_ text: String?)
        case setRoomMode(_ isPublic: Bool)
        case createdRoom(CreateRoomDomainModel)
        case createRoomFailed
    }
    
    struct State {
        var room: CreateRoomRequestDTO
        var roomCode: String? = nil
        var createLimit: Bool? = nil
    }
    
    var initialState: State = State(
        room: CreateRoomRequestDTO(title: "", isPublic: true)
    )
    
    func mutate(action: Action) -> Observable<Mutation> {
        switch action {
        case .writeTitle(let text):
            return .just(Mutation.setTitle(text))
        case .writeDescription(let text):
            return .just(Mutation.setDescription(text))
        case .publicButtonTapped:
            return .just(Mutation.setRoomMode(true))
        case .privateButtonTapped:
            return .just(Mutation.setRoomMode(false))
        case .createButtonTapped:
            if currentState.room.title != "" {
                return createRoom(currentState.room)
            }
            
            return .empty()
        }
    }
    
    func reduce(state: State, mutation: Mutation) -> State {
        var newState = state
        
        switch mutation {
        case .setTitle(let title):
            newState.room.title = title
        case .setDescription(let description):
            newState.room.description = description
        case .setRoomMode(let isPublic):
            newState.room.isPublic = isPublic
        case .createdRoom(let value):
            newState.roomCode = value.code
        case .createRoomFailed:
            newState.createLimit = true
        }
        
        return newState
    }
    
    private func createRoom(_ room: CreateRoomRequestDTO) -> Observable<Mutation> {
        let createRequest = DefaultRequest<CreateRoomResponseDTO>(method: .post, path: ["api", "rooms", "create-room"], header: [.json, .authorizationAccessToken], body: currentState.room)
                 
        return Observable.create { [weak self] observer in
            guard let self else { return Disposables.create() }
            
            Task {
                do {
                    let createRoomResponse = try await self.session.send(createRequest)
                    
                    observer.onNext(Mutation.createdRoom(createRoomResponse.toModel()))
                    observer.onCompleted()
                } catch NetworkError.createRoom {
                    observer.onNext(Mutation.createRoomFailed)
                    observer.onCompleted()
                } 
            }
            return Disposables.create()
        }
    }
}
