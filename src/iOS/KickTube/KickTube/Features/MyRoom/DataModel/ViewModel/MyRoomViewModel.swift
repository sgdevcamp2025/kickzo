//
//  MyRoomViewModel.swift
//  KickTube
//
//  Created by 김수경 on 2/17/25.
//

import Foundation

struct MyRoomViewModel {
    let id: Int
    let code: String
    let title: String
    let creator: String
    let userCount: String
    let videoID: String?
    var videoThumbnail: Data? = nil
    var userProfileThumbnail: Data? = nil
    
    var created: Bool {
        if creator == SampleTest.userDefaultsProfilename {
            return true
        }
        
        return false
    }
}
