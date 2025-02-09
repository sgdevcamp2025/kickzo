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
    private let menuSegmentedControl: UISegmentedControl = {
        let items: [UIImage] = [.chat, .playlist, .voice, .friend]
        let segmented = UISegmentedControl(items: items)
        
        segmented.backgroundColor = .lightGray
        segmented.layer.backgroundColor = UIColor.white.cgColor
        
        segmented.selectedSegmentTintColor = UIColor.kDarkgray
        segmented.setTitleTextAttributes([.foregroundColor: UIColor.black], for: .normal)
        segmented.setTitleTextAttributes([.foregroundColor: UIColor.white], for: .selected)
        
        segmented.layer.borderWidth = 1
        segmented.layer.borderColor = UIColor.kGray.cgColor
        
        segmented.selectedSegmentIndex = 1
        
        return segmented
    }()
    private let mainScrollView = KickRoomMainScrollView()
    private var previousTime: TimeInterval = 0
    private var timeTrackingTimer: Timer?
    
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        
        tabBarController?.tabBar.isHidden = true
        navigationController?.setNavigationBarHidden(true, animated: false)
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        navigationController?.interactivePopGestureRecognizer?.delegate = self
        navigationController?.interactivePopGestureRecognizer?.isEnabled = true
    }
    
    override func viewWillDisappear(_ animated: Bool) {
        super.viewWillDisappear(animated)
        
        tabBarController?.tabBar.isHidden = false
        navigationController?.setNavigationBarHidden(false, animated: false)
    }
    
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
                owner.playerView.seek(toSeconds: value.time, allowSeekAhead: false)
            }
            .disposed(by: disposeBag)
    }
    
    // MARK: - private method
    
    private func setRoomInformationSection(_ info: KickRoomInfoViewModel) {
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
    
    private func setupSegmentedControl() {
        menuSegmentedControl.rx.selectedSegmentIndex
            .subscribe(with: self, onNext: { owner, index in
                owner.mainScrollView.setPageIndex(index)
            })
            .disposed(by: disposeBag)
        menuSegmentedControl.rx.selectedSegmentIndex.onNext(1)
    }
    
    
    // MARK: - configure UI
    
    override func configureHierarchy() {
        [playerView, titleLabel, creatorImage, creatorNameLabel, participatedCountLabel, menuSegmentedControl, mainScrollView].forEach {
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
        menuSegmentedControl.snp.makeConstraints { make in
            make.horizontalEdges.equalToSuperview().inset(16)
            make.bottom.equalTo(safeArea)
            make.height.equalTo(50)
        }
        mainScrollView.snp.makeConstraints { make in
            make.horizontalEdges.equalToSuperview()
            make.top.equalTo(creatorImage.snp.bottom).offset(12)
            make.bottom.equalTo(menuSegmentedControl.snp.top).offset(-12)
        }
    }
    
    override func configureUI() {
        playerView.delegate = self
        setupSegmentedControl()
        
        mainScrollView.didUpdatePageIndex = { [weak self] pageIndex in
            guard let self else { return }
            
            DispatchQueue.main.async {
                self.menuSegmentedControl.selectedSegmentIndex = pageIndex
            }
        }
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

extension KickRoomViewController: UIGestureRecognizerDelegate {}
