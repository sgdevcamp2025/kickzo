//
//  YouTubeVideoDomainModel.swift
//  KickTube
//
//  Created by 김수경 on 2/6/25.
//

import Foundation

import ManipulateDataModel

struct YouTubeVideoDomainModel {
    let etag: String
    let items: VideoItemDomainModel
    
    func toModel() -> YoutubeVideoViewModel {
        .init(id: self.items.id,
              title: self.items.snippet.title,
              channelTitle: self.items.snippet.channelTitle,
              thumbnails: self.items.snippet.thumbnails)
    }
}

struct VideoItemDomainModel: DTOMappable {
    let etag: String
    let id: String
    let snippet: SnippetDomainModel
}

struct SnippetDomainModel: DTOMappable {
    let publishedAt: String
    let title: String
    let description: String
    let thumbnails: Thumbnails
    let channelTitle: String
    let tags: [String]?
    let categoryId: String
    let liveBroadcastContent: String
    let defaultLanguage: String?
    let localized: Localized
    let defaultAudioLanguage: String?
}
