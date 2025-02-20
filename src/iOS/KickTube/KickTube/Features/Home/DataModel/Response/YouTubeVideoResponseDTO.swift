//
//  YouTubeVideoResponseDTO.swift
//  KickTube
//
//  Created by 김수경 on 2/6/25.
//

import Foundation

import ManipulateDataModel

@DecodeDTO
struct YouTubeVideoResponseDTO {
    let kind: String
    let etag: String
    let items: [VideoItemResponseDTO]
    let pageInfo: PageInfo
    
    func toModel() -> YouTubeVideoDomainModel {
        return .init(etag: self.etag, items: self.items[0].toModel())
    }
}

@DecodeDTO
struct VideoItemResponseDTO {
    let kind: String
    let etag: String
    let id: String
    let snippet: SnippetResponseDTO
    
    func toModel() -> VideoItemDomainModel {
        .init(etag: self.etag,
              id: self.id,
              snippet: self.snippet.toModel())
    }
}

@DecodeDTO
struct SnippetResponseDTO {
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
    
    func toModel() -> SnippetDomainModel {
        .init(publishedAt: self.publishedAt,
              title: self.title,
              description: self.description,
              thumbnails: self.thumbnails,
              channelTitle: self.channelTitle,
              tags: self.tags ?? [],
              categoryId: self.categoryId,
              liveBroadcastContent: self.liveBroadcastContent,
              defaultLanguage: self.defaultLanguage,
              localized: self.localized,
              defaultAudioLanguage: self.defaultAudioLanguage)
    }
}

@DecodeDTO
struct Localized {
    let title: String
    let description: String
}

@DecodeDTO
struct Thumbnails {
    let `default`: Thumbnail
    let medium: Thumbnail
    let high: Thumbnail
    let standard: Thumbnail?
    let maxres: Thumbnail?
}

@DecodeDTO
struct Thumbnail {
    let url: String
    let width: Int
    let height: Int
}

@DecodeDTO
struct PageInfo {
    let totalResults: Int
    let resultsPerPage: Int
}
