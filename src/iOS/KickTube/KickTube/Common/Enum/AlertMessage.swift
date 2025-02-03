//
//  AlertMessage.swift
//  KickTube
//
//  Created by 김수경 on 2/1/25.
//

import Foundation

enum AlertMessage {
    case createLimit
}

extension AlertMessage {
    var title: String {
        switch self {
        case .createLimit:
            return "Kick 룸 생성 제한"
        }
    }
    var contents: String {
        switch self {
        case .createLimit:
            return "최대 5개의 Kick 룸만 생성할 수 있습니다. 기존 룸을 삭제하거나 제한 내에서 새로운 룸을 만들어주세요."
        }
    }
    var accept: String {
        switch self {
        case .createLimit:
            return "방 삭제하러 가기"
        }
    }
    var cancel: String {
        switch self {
        case .createLimit:
            return "취소"
        }
    }
}
