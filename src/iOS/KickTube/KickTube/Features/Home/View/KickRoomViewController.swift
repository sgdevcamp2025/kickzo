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
    
    private var previousTime: TimeInterval = 0
    private var timeTrackingTimer: Timer?
    
    
    // MARK: - configure Reactor
    
    override func bindState(reactor: KickRoomReactor) {
        reactor.state
            .map { $0.roomInfo.myRole }
            .bind(with: self) { owner, value in
                switch value {
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
    
    
    // MARK: - configure UI
    
    override func configureHierarchy() {
        view.addSubview(playerView)
    }
    
    override func configureLayout() {
        let safeArea = view.safeAreaLayoutGuide
        
        playerView.snp.makeConstraints { make in
            make.top.horizontalEdges.equalTo(safeArea)
            make.height.equalTo(ComponentSize.youtubePlayer.size.height)
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
