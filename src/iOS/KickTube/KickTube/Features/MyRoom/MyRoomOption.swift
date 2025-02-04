//
//  MyRoomOption.swift
//  KickTube
//
//  Created by 김수경 on 2/4/25.
//

import UIKit

enum MyRoomOption {
    case deleteCreatedRoom
    case leaveParticipatedRoom
}

extension MyRoomOption {
    struct OptionInfo {
        let title: String
        let image: UIImage
    }
    
    var info: OptionInfo {
        switch self {
        case .deleteCreatedRoom:
            return OptionInfo(title: "Kick 방 삭제하기", image: .volcano)
        case .leaveParticipatedRoom:
            return OptionInfo(title: "Kick 방 나가기", image: .leave)
        }
    }
}
