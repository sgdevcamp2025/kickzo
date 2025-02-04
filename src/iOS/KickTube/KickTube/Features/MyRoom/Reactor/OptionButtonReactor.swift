//
//  OptionButtonReactor.swift
//  KickTube
//
//  Created by 김수경 on 2/4/25.
//

import Foundation

import ReactorKit
import RxSwift

final class OptionButtonReactor: Reactor {
    enum Action {
        case deleteButtonTapped
        case leaveButtonTapped
    }
    
    enum Mutation {
        case deleteRoom(_ result: Bool)
        case leaveRoom(_ result: Bool)
    }
    struct State {
        let id: Int
        let indexPath: IndexPath
        var deleteResult: Bool?
        var leaveResult: Bool?
    }
    
    init(id: Int, indexPath: IndexPath) {
         self.initialState = State(
            id: id,
            indexPath: indexPath,
            deleteResult: nil,
            leaveResult: nil
        )
     }
    
    var initialState: State
    
    func mutate(action: Action) -> Observable<Mutation> {
        switch action {
        case .deleteButtonTapped:
            return .just(.deleteRoom(true))
        case .leaveButtonTapped:
            return .just(.leaveRoom(true))
        }
    }
    
    func reduce(state: State, mutation: Mutation) -> State {
        var newState = state
        
        switch mutation {
        case .deleteRoom(let result):
            newState.deleteResult = result
        case .leaveRoom(let result):
            newState.leaveResult = result
        }
        
        return newState
    }
}
