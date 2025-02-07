//
//  YoutubeVideoViewModel.swift
//  KickTube
//
//  Created by 김수경 on 2/7/25.
//

import Foundation

struct YoutubeVideoViewModel {
    let id: String
    let title: String
    let channelTitle: String
    let thumbnails: Thumbnails
    
    var thumbnailData: Data?
}
