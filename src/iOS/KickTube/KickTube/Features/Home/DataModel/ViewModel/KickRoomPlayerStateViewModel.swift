//
//  KickRoomPlayerStateViewModel.swift
//  KickTube
//
//  Created by 김수경 on 2/24/25.
//

import Foundation

struct KickRoomPlayerStateViewModel {
    var progress: PlayState = .none
    var time: Float = 0
    
    enum PlayState: String {
        case paused
        case playing
        case ended
        case none
    }
}
