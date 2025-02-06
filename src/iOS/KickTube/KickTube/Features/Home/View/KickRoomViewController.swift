//
//  KickRoomViewController.swift
//  KickTube
//
//  Created by 김수경 on 2/4/25.
//

import UIKit

import ReactorKit
import RxCocoa
import RxSwift
import YouTubeiOSPlayerHelper

final class KickRoomViewController: BaseViewController<KickRoomReactor> {
    private let playerView = YTPlayerView()
    private let titleLabel = UILabel().then {
        $0.font = KFont.middle16
        $0.numberOfLines = 2
    }
    private let creatorImage = UIImageView().then {
        $0.layer.cornerRadius = 8
        $0.contentMode = .scaleAspectFit
    }
    private let creatorNameLabel = UILabel().then {
        $0.font = KFont.middle14
        $0.textColor = .kDarkgray
    }
    private let participatedCountLabel = UIButton().then {
        var config = UIButton.Configuration.filled()
        
        config.image = UIImage.reddot
        config.imagePadding = 6
        config.background.backgroundColor = .kDarkgray.withAlphaComponent(0.4)
        config.background.cornerRadius = 10
        config.contentInsets = NSDirectionalEdgeInsets(top: 4, leading: 6, bottom: 4, trailing: 6)
        
        $0.configuration = config
    }
    
    private var previousTime: TimeInterval = 0
    private var timeTrackingTimer: Timer?
    
    
    // MARK: - configure Reactor
    
    override func bindState(reactor: KickRoomReactor) {
        reactor.state
            .map { $0.roomInfo }
            .bind(with: self) { owner, value in
                owner.setRoomInformationSection(value.roomDetail.roomInfo)
                switch value.myRole {
                case .member:
                    owner.playerView.isUserInteractionEnabled = false
                default:
                    break
                }
            }
            .disposed(by: disposeBag)
        
        reactor.state
            .map { $0.youtubeID }
            .distinctUntilChanged()
            .compactMap { $0 }
            .withLatestFrom(reactor.state.map { $0.playerVars }) { ($0, $1) }
            .subscribe(with: self) { owner, value in
                let (youtubeID, playerVars) = value
                
                owner.playerView.load(withVideoId: youtubeID, playerVars: playerVars)
            }
            .disposed(by: disposeBag)
        
        reactor.state
            .map { $0.playState }
            .compactMap { $0 }
            .observe(on: MainScheduler.instance)
            .subscribe(with: self) { owner, value in
                print(value)
                owner.playerView.seek(toSeconds: value.time, allowSeekAhead: false)
            }
            .disposed(by: disposeBag)
    }
    
    // MARK: - private method
    
    func setRoomInformationSection(_ info: KickRoomInfoViewModel) {
        titleLabel.text = info.title
        creatorImage.image = .logo
        creatorNameLabel.text = info.creator
        
        var titleAttributes = AttributedString(info.participatedUserCount)
        
        titleAttributes.font = KFont.middle12
        titleAttributes.foregroundColor = .white
        
        var config = participatedCountLabel.configuration
        
        config?.attributedTitle = titleAttributes
        
        participatedCountLabel.configuration = config
    }

    
    // MARK: - configure UI
    
    override func configureHierarchy() {
        [playerView, titleLabel, creatorImage, creatorNameLabel, participatedCountLabel].forEach {
            view.addSubview($0)
        }
    }
    
    override func configureLayout() {
        let safeArea = view.safeAreaLayoutGuide
        
        playerView.snp.makeConstraints { make in
            make.top.horizontalEdges.equalTo(safeArea)
            make.height.equalTo(ComponentSize.youtubePlayer.size.height)
        }
        titleLabel.snp.makeConstraints { make in
            make.top.equalTo(playerView.snp.bottom).offset(8)
            make.horizontalEdges.equalToSuperview().inset(12)
        }
        creatorImage.snp.makeConstraints { make in
            make.size.equalTo(ComponentSize.homeProfileImage.size).dividedBy(2)
            make.leading.equalTo(titleLabel.snp.leading)
            make.top.equalTo(titleLabel.snp.bottom).offset(8)
        }
        creatorNameLabel.snp.makeConstraints { make in
            make.leading.equalTo(creatorImage.snp.trailing).offset(8)
            make.centerY.equalTo(creatorImage.snp.centerY)
        }
        participatedCountLabel.snp.makeConstraints { make in
            make.bottom.equalTo(creatorImage.snp.bottom)
            make.trailing.equalToSuperview().offset(-12)
        }
    }
    
    override func configureUI() {
        playerView.delegate = self
    }
    
    override func viewWillAppear(_ animated: Bool) {
        navigationController?.setNavigationBarHidden(true, animated: animated)
    }
}

extension KickRoomViewController: YTPlayerViewDelegate {
    func playerView(_ playerView: YTPlayerView, didChangeTo state: YTPlayerState) {
        switch state {
        case .paused:
            
            startTrackingTime()
        case .playing:
            stopTrackingTime()
            
            playerView.currentTime { time, error in
                let state = KickRoomPlayerState(progress: .playing, time: time.magnitude)
                
                self.reactor.action.onNext(.playPlayer(state))
            }
        default:
            break
        }
    }
    
    private func startTrackingTime() {
        stopTrackingTime()
        timeTrackingTimer = Timer.scheduledTimer(withTimeInterval: 0.5, repeats: true) { [weak self] _ in
            guard let self else { return }
            
            self.playerView.currentTime { time, error in
                if let _ = error { return }
                
                if time.magnitudeSquared != self.previousTime {
                    let state = KickRoomPlayerState(progress: .paused, time: time.magnitude)
                    
                    self.reactor.action.onNext(.stopPlayer(state))
                    self.previousTime = time.magnitudeSquared
                }
            }
        }
    }
    
    private func stopTrackingTime() {
        timeTrackingTimer?.invalidate()
        timeTrackingTimer = nil
    }
}
