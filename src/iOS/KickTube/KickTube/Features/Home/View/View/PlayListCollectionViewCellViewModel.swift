//
//  PlayListCollectionViewCellViewModel.swift
//  KickTube
//
//  Created by 김수경 on 2/6/25.
//

import Foundation

import RxCocoa
import RxSwift

final class PlayListViewModel {
    private let networkManager = NetworkManager()
    private(set) var playlist = [YoutubeVideoViewModel]()
    
    private var disposeBag = DisposeBag()
    
    struct Input {
        let loadView: BehaviorRelay<Void>
        let emptyThumbnailImage: PublishRelay<Int>
        let editingTextInput: PublishRelay<String>
        let addButtonTapped: PublishRelay<Void>
        let orderChanged: PublishRelay<(from: IndexPath, to: IndexPath)>
        let deleteButtonTapped: PublishRelay<Int>
    }
    
    struct Output {
        let playlist: PublishSubject<[YoutubeVideoViewModel]>
        var validVideo: PublishSubject<YoutubeVideoViewModel?>
    }
    
    func transform(_ input: Input) -> Output {
        let playlistSubject = PublishSubject<[YoutubeVideoViewModel]>()
        let validVideo = PublishSubject<YoutubeVideoViewModel?>()
      
        input.loadView
            .compactMap { _  in
                let value = [YouTubeVideoDomainModel]().map { $0.toModel() }
                return value
            }
            .subscribe(with: self) { owner, value in
                owner.playlist = value
                playlistSubject.onNext(owner.playlist)
            }
            .disposed(by: disposeBag)
        
        input.emptyThumbnailImage
            .flatMap { [weak self] row -> Single<(Int, Data?)> in
                guard let self else { return .error(NetworkError.emptyYoutubeThumbnail) }
                
                return Single.create { single in
                    Task {
                        do {
                            let youtubeID = self.playlist[row].id
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
                
                owner.playlist[row].thumbnailData = thumbnailData
                playlistSubject.onNext(owner.playlist)
            }, onError: { owner, error in
                print(error)
            })
            .disposed(by: disposeBag)
        
        input.editingTextInput
            .compactMap { value -> String? in
                return value.youtubeID
            }
            .flatMapLatest { [weak self] youtubeID -> Single<YoutubeVideoViewModel?> in
                guard let self else { return .just(nil) }
                
                return Single.create { single in
                    Task {
                        do {
                            guard let request = try YoutubeRouter.searchYoutubeVideo(id: youtubeID).makeRequest() else {
                                single(.success(nil))
                                return
                            }

                            let searchResponse = try await self.networkManager.getDecodedData(request: request, to: YouTubeVideoResponse.self)
                            
                            if !searchResponse.items.isEmpty {
                                var searchModel = searchResponse.toModel().toModel()
                                let thumbnailData = try await self.networkManager.getYoutubeThumbnail(.youtubeThumbnailLow(id: youtubeID))
                                
                                searchModel.thumbnailData = thumbnailData
                                single(.success(searchModel))
                            } else {
                                single(.success(nil))
                            }
                        } catch {
                            single(.failure(error))
                        }
                    }
                    return Disposables.create()
                }
            }
            .bind(to: validVideo)
            .disposed(by: disposeBag)
        
        input.addButtonTapped
            .withLatestFrom(validVideo)
            .compactMap { $0 }
            .subscribe(with: self, onNext: { owner, value in
                owner.playlist.append(value)
                playlistSubject.onNext(owner.playlist)
                validVideo.onNext(nil)
            })
            .disposed(by: disposeBag)
        
        input.orderChanged
            .subscribe(with: self) { owner, value in
                let (from, to) = value
                let data = owner.playlist.remove(at: from.row)
                
                owner.playlist.insert(data, at: to.row)
                playlistSubject.onNext(owner.playlist)
            }
            .disposed(by: disposeBag)
        
        input.deleteButtonTapped
            .subscribe(with: self) { owner, value in
                owner.playlist.remove(at: value)
                playlistSubject.onNext(owner.playlist)
            }
            .disposed(by: disposeBag)
        
        return Output(playlist: playlistSubject, validVideo: validVideo)
    }
}
