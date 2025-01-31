//
//  CreateRoomReactor.swift
//  KickTube
//
//  Created by 김수경 on 1/31/25.
//

import Foundation

import ReactorKit

final class CreateRoomReactor: Reactor {
    enum Action {
        case writeTitle(_ text: String?)
        case writeDescription(_ text: String?)
        case publicButtonTapped
        case privateButtonTapped
    }
    
    enum Mutation {
        case setTitle(_ text: String?)
        case setDescription(_ text: String?)
        case setRoomMode(_ isPublic: Bool)
    }
    
    struct State {
        var title: String?
        var description: String?
        var publicRoomMode: Bool
    }
    
    var initialState: State = State(title: "", publicRoomMode: true)
    
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
        }
    }
    
    func reduce(state: State, mutation: Mutation) -> State {
        var newState = state
        
        switch mutation {
        case .setTitle(let title):
            newState.title = title
        case .setDescription(let description):
            newState.description = description
        case .setRoomMode(let isPublic):
            newState.publicRoomMode = isPublic
        }
        
        return newState
    }
}
