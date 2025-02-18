//
//  MyRoomSection.swift
//  KickTube
//
//  Created by 김수경 on 2/3/25.
//

import Foundation

import RxDataSources

struct MyRoomSection {
    var header: String
    var items: [Item]
}

extension MyRoomSection: SectionModelType {
    typealias Item = MyRoomSectionItem
    
    init(original: MyRoomSection, items: [Item]) {
        self = original
        self.items = items
    }
}

enum MyRoomSectionItem {
    case created(HomeRoomViewModel)
    case participated(HomeRoomViewModel)
}

extension MyRoomSectionItem {
    var title: String {
        switch self {
        case .created:
            return "내가 생성한 Kick 방"
        case .participated:
            return "내가 참여 중인 Kick 방"
        }
    }
}
