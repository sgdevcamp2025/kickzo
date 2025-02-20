//
//  PlayListViewModel.swift
//  KickTube
//
//  Created by 김수경 on 2/6/25.
//

import Foundation

import RxCocoa
import RxSwift

final class PlayListViewModel {
    private let session = Session()
    private let networkManager = NetworkManager()
    
    private var playlist: [KickRoomPlaylistViewModel]
    private(set) var videoList = [YoutubeVideoViewModel]()
    private let roomID : Int?
    
    private var disposeBag = DisposeBag()
    
    init(roomID: Int?, _ playlist: [KickRoomPlaylistViewModel]) {
        self.roomID = roomID
        self.playlist = playlist
    }
    
    struct Input {
        let emptyThumbnailImage: PublishRelay<Int>
        let editingTextInput: PublishRelay<String>
        let addButtonTapped: PublishRelay<String?>
        let orderChanged: PublishRelay<(from: IndexPath, to: IndexPath)>
        let deleteButtonTapped: PublishRelay<Int>
    }
    
    struct Output {
        let playlist: PublishSubject<[YoutubeVideoViewModel]>
        var validVideo: PublishSubject<[YoutubeVideoViewModel]>
    }
    
    func transform(_ input: Input) -> Output {
        let playlistSubject = BehaviorSubject<[KickRoomPlaylistViewModel]>(value: playlist)
        let videoListSubject = PublishSubject<[YoutubeVideoViewModel]>()
        let validVideoSubject = PublishSubject<[YoutubeVideoViewModel]>()
        
        playlistSubject
            .take(1)
            .flatMap { [weak self] playlist -> Single<[YoutubeVideoViewModel]> in
                guard let self else { return .error(NetworkError.unknown) }
                
                let youtubeID = playlist.compactMap { $0.url.youtubeID }
                
                return  self.getYoutubeSearchResult(with: youtubeID)
            }
            .subscribe(with: self) { owner, value in
                owner.videoList = value
                videoListSubject.onNext(value)
            }
            .disposed(by: disposeBag)
        
        input.emptyThumbnailImage
            .flatMap { [weak self] row -> Single<(Int, Data?)> in
                guard let self else { return .error(NetworkError.emptyYoutubeThumbnail) }
                
                return Single.create { single in
                    Task {
                        do {
                            let youtubeID = self.videoList[row].id
                            let data = try await self.networkManager.getYoutubeThumbnail(.youtubeThumbnailLow(id: youtubeID))
                            
                            single(.success((row, data)))
                        } catch {
                            single(.failure(error))
                        }
                    }
                    return Disposables.create()
                }
            }
            .subscribe(with: self, onNext: { owner, value in
                let (row, thumbnailData) = value
                
                owner.videoList[row].thumbnailData = thumbnailData
                videoListSubject.onNext(owner.videoList)
            }, onError: { owner, error in
                print(error)
            })
            .disposed(by: disposeBag)
        
        input.editingTextInput
            .compactMap { value -> String? in
                return value.youtubeID
            }
            .flatMapLatest { [weak self] youtubeID -> Single<[YoutubeVideoViewModel]> in
                guard let self else { throw NetworkError.unknown }
                
                return self.getYoutubeSearchResult(with: [youtubeID])
            }
            .bind(to: validVideoSubject)
            .disposed(by: disposeBag)
        
        input.addButtonTapped
            .withLatestFrom(validVideoSubject.asObservable())
            .filter { !$0.isEmpty }
            .subscribe(with: self) { owner, value in
                if let video = value.first {
                    owner.videoList.append(video)
                    videoListSubject.onNext(owner.videoList)
                    validVideoSubject.onNext([])
                }
            }
            .disposed(by: disposeBag)
        
        input.orderChanged
            .subscribe(with: self) { owner, value in
                let (from, to) = value
                let playlistData = owner.playlist.remove(at: from.row)
                let videoListData = owner.videoList.remove(at: from.row)
                
                owner.playlist.insert(playlistData, at: to.row)
                owner.videoList.insert(videoListData, at: to.row)
                
                videoListSubject.onNext(owner.videoList)
            }
            .disposed(by: disposeBag)
        
        input.deleteButtonTapped
            .subscribe(with: self) { owner, value in
                owner.playlist.remove(at: value)
                owner.videoList.remove(at: value)
                
                videoListSubject.onNext(owner.videoList)
            }
            .disposed(by: disposeBag)
        
        videoListSubject
            .subscribe(with: self) { owner, value in
                guard let roomID = owner.roomID else { return }
                
                let playlist = value.enumerated().map { PlaylistRequestDTO(url: $0.element.id.youtubeLink, order: $0.offset) }
                let request = RoomPlaylistRequestDTO(roomID: roomID, playlist: playlist)
                
                owner.changePlaylist(request)
            }
            .disposed(by: disposeBag)
        
        return Output(playlist: videoListSubject, validVideo: validVideoSubject)
    }
    
    func getYoutubeSearchResult(with youtubeIDs: [String]) -> Single<[YoutubeVideoViewModel]> {
        return Single.create { [weak self] single in
            guard let self else {
                single(.success([]))
                return Disposables.create()
            }

            Task {
                do {
                    var youtubeList = [YoutubeVideoViewModel]()
                    for youtubeID in youtubeIDs {
                        guard let request = try YoutubeRouter.searchYoutubeVideo(id: youtubeID).makeRequest() else {
                            continue
                        }
                        
                        let searchResponse = try await self.networkManager.getDecodedData(request: request, to: YouTubeVideoResponseDTO.self)
                        
                        if !searchResponse.items.isEmpty {
                            var searchModel = searchResponse.toModel().toModel()
                            
                            let thumbnailData = try await self.networkManager.getYoutubeThumbnail(.youtubeThumbnailLow(id: youtubeID))
                            searchModel.thumbnailData = thumbnailData
                            
                            youtubeList.append(searchModel)
                        }
                    }
                    single(.success(youtubeList))
                } catch {
                    single(.failure(error))
                }
            }

            return Disposables.create()
        }
    }

    private func changePlaylist(_ request: RoomPlaylistRequestDTO) {
        let playlistRequest = DefaultRequest<String>(method: .post, path: ["api", "rooms", "playlist"], header: [.json, .authorizationAccessToken], body: request)
    
        Task {
            do {
                _ = try await self.session.send(playlistRequest)
                print("success")
            } catch {
                print(error)
            }
        }
    }
}

