//
//  MyRoomDelegate.swift
//  KickTube
//
//  Created by 김수경 on 2/4/25.
//

import Foundation

protocol MyRoomDelegate {
    func deleteRoom(idx: IndexPath, result: Bool)
    func leaveRoom(idx: IndexPath, result: Bool)
}
