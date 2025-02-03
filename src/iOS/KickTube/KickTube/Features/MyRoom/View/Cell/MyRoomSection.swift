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
    typealias Item = MyRoomsSectionItem
    
    init(original: MyRoomSection, items: [Item]) {
        self = original
        self.items = items
    }
}

enum MyRoomsSectionItem {
    case created(MyRoomViewModel)
    case participated(MyRoomViewModel)
}

enum MyRoomSectionInformation {
    case section0
    case section1
}

extension MyRoomSectionInformation {
    var title: String {
        switch self {
        case .section0:
            return "내가 생성한 Kick 방"
        case .section1:
            return "내가 참여 중인 Kick 방"
        }
    }
}

