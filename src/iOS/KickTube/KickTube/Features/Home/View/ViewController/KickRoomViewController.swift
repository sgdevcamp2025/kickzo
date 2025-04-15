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
    private let emptyPlayerView = UIView().then {
        $0.backgroundColor = .black
    }
    private lazy var playerView = YTPlayerView()
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
        
        segmented.selectedSegmentIndex = 0
        
        return segmented
    }()
    
    private lazy var mainScrollView = KickRoomMainScrollView(roomInfo: reactor.currentState.roomInfo?.roomDetail)
    private var previousTime: TimeInterval = 0
    private var timeTrackingTimer: Timer?
    
    
    // MARK: - init
    
    override init(_ reactor: KickRoomReactor) {
        super.init(reactor)
    }
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    deinit {
        NotificationCenter.default.removeObserver(self)
    }
    
    
    // MARK: - view life cycle
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        
        tabBarController?.tabBar.isHidden = true
        navigationController?.setNavigationBarHidden(true, animated: false)
        
        reactor.action.onNext(.viewWillAppear)
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        setNotification()
        setPopView()
        setFirstVideo()
    }
    
    override func viewWillDisappear(_ animated: Bool) {
        super.viewWillDisappear(animated)
        
        tabBarController?.tabBar.isHidden = false
        navigationController?.setNavigationBarHidden(false, animated: false)
    }
    
    
    // MARK: - configure Reactor
    
    override func bindState(reactor: KickRoomReactor) {
        reactor.state
            .compactMap { $0.roomInfo }
            .take(1)
            .observe(on: MainScheduler.instance)
            .subscribe(with: self, onNext: { owner, value in
                owner.setMainScrollView()
                owner.setRoomInformationSection(value.roomDetail.roomInfo)
                owner.presentChattingView()
                
                switch value.myRole {
                case .member:
                    owner.playerView.isUserInteractionEnabled = false
                default:
                    break
                }
            })
            .disposed(by: disposeBag)
        
        reactor.state
            .map { $0.youtubeID }
            .distinctUntilChanged()
            .compactMap { $0 }
            .withLatestFrom(reactor.state.map { $0.playerVars }) { ($0, $1) }
            .observe(on: MainScheduler.instance)
            .subscribe(with: self) { owner, value in
                let (youtubeID, playerVars) = value
                
                owner.emptyPlayerView.isHidden = true
                owner.playerView.load(withVideoId: youtubeID, playerVars: playerVars)
            }
            .disposed(by: disposeBag)
        
        reactor.state
            .compactMap { $0.playState }
            .distinctUntilChanged { $0.time == $1.time }
            .observe(on: MainScheduler.instance)
            .subscribe(with: self) { owner, value in
                switch value.progress {
                case .playing:
                    owner.playerView.seek(toSeconds: value.time, allowSeekAhead: true)
                default:
                    owner.playerView.seek(toSeconds: value.time, allowSeekAhead: false)
                }
            }
            .disposed(by: disposeBag)
        
        reactor.state
            .compactMap { $0.myRole }
            .observe(on: MainScheduler.instance)
            .subscribe(with: self) { owner, role in
                switch role {
                case .manager, .creator:
                    owner.playerView.isUserInteractionEnabled = true
                default:
                    owner.playerView.isUserInteractionEnabled = false
                }
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
            .skip(1)
            .subscribe(with: self, onNext: { owner, index in
                owner.mainScrollView.setPageIndex(index)
                
                if index == 0 {
                    owner.presentChattingView()
                }
            })
            .disposed(by: disposeBag)
    }
    
    private func setMainScrollView() {
        view.addSubview(mainScrollView)
        
        mainScrollView.snp.makeConstraints { make in
            make.horizontalEdges.equalToSuperview()
            make.top.equalTo(creatorImage.snp.bottom)
            make.bottom.equalTo(menuSegmentedControl.snp.top)
        }
        
        mainScrollView.didUpdatePageIndex = { [weak self] pageIndex in
            guard let self else { return }
            
            DispatchQueue.main.async {
                self.menuSegmentedControl.selectedSegmentIndex = pageIndex
                
                if pageIndex == 0 {
                    self.presentChattingView()
                }
            }
        }
    }
    
    private func setNotification() {
        NotificationCenter.default.addObserver(
            self,
            selector: #selector(presentUserOverviewVC),
            name: .presentUserOverview,
            object: nil
        )
        NotificationCenter.default.addObserver(
            self,
            selector: #selector(presentVoiceUserOverviewVC),
            name: .presentVoiceUserOverview,
            object: nil
        )
    }
    
    private func setPopView() {
        let panGesture = UIPanGestureRecognizer(target: self, action: #selector(handlePanGesture(_:)))
        
        view.addGestureRecognizer(panGesture)
    }
    
    private func presentChattingView() {
        guard let roomID = reactor.currentState.roomInfo?.roomDetail.roomInfo.roomID else { return }
        
        let vc = ChatViewController(ChatReactor(String(roomID)))
        if let sheet = vc.sheetPresentationController {
            sheet.detents = [.custom(resolver: { _ in
                ComponentSize.chatBottomSheet.size.height })]
            sheet.prefersGrabberVisible = true
        }
        
        vc.modalPresentationStyle = .custom
        
        self.present(vc, animated: true)
    }
    
    @objc
    private func presentUserOverviewVC(notification: Notification) {
        if let userInfo = notification.userInfo,
           let roomID = userInfo["roomID"] as? Int,
           let userID = userInfo["userID"] as? Int,
           let role = userInfo["role"] as? UserRole {
            let vc = UserOverviewViewController(UserOverviewReactor(roomID: roomID, userID: userID, role: role))
            if let sheet = vc.sheetPresentationController {
                sheet.detents = [.custom(resolver: { _ in ComponentSize.userlistBottomSheet.size.height
                })]
            }
            
            self.present(vc, animated: false)
        }
    }
    
    @objc
    private func presentVoiceUserOverviewVC(notification: Notification) {
        if let userInfo = notification.userInfo,
           let voiceState = userInfo["voiceState"] as? VoiceChatUserStateViewModel {
            let vc = VoiceUserOverviewViewController(VoiceUserOverviewReactor(voiceState))
            if let sheet = vc.sheetPresentationController {
                sheet.detents = [.custom(resolver: { _ in ComponentSize.userlistBottomSheet.size.height + 50 })]
                sheet.prefersGrabberVisible = true
            }
            
            self.present(vc, animated: false)
        }
    }
    
    @objc
    private func handlePanGesture(_ gesture: UIPanGestureRecognizer) {
        let translation = gesture.translation(in: view)
        
        if translation.y > 0 {
            if gesture.velocity(in: view).y > 1000 {
                navigationController?.popViewController(animated: true)
                self.dismiss(animated: true, completion: nil)
            }
        }

        if gesture.state == .ended || gesture.state == .cancelled {
            gesture.setTranslation(.zero, in: view)
        }
    }
    
    
    // MARK: - configure UI
    
    override func configureHierarchy() {
        [emptyPlayerView, titleLabel, creatorImage, creatorNameLabel, participatedCountLabel, menuSegmentedControl, playerView].forEach {
            view.addSubview($0)
        }
    }
    
    override func configureLayout() {
        let safeArea = view.safeAreaLayoutGuide
        
        emptyPlayerView.snp.makeConstraints { make in
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
            make.horizontalEdges.equalToSuperview().inset(12)
            make.bottom.equalTo(safeArea).offset(-12)
            make.height.equalTo(50)
        }
        playerView.snp.makeConstraints { make in
            make.top.horizontalEdges.equalTo(safeArea)
            make.height.equalTo(ComponentSize.youtubePlayer.size.height)
        }
    }
    
    override func configureUI() {
        playerView.delegate = self
        setupSegmentedControl()
    }
}

extension KickRoomViewController: YTPlayerViewDelegate {
    func playerView(_ playerView: YTPlayerView, didChangeTo state: YTPlayerState) {
        if reactor.currentState.localUpdate {
            switch state {
            case .paused:
                startTrackingTime()
            case .playing:
                stopTrackingTime()
                
                playerView.currentTime { time, error in
                    let state = KickRoomPlayerStateViewModel(progress: .playing, time: time.magnitude)
                    
                    self.reactor.action.onNext(.localUpdatePlayer(state))
                }
            default:
                break
            }
        }
        DispatchQueue.main.asyncAfter(deadline: .now() + 1) {
            self.reactor.action.onNext(.setLocalUpdate(true))
        }
    }
    
    private func startTrackingTime() {
        stopTrackingTime()
        timeTrackingTimer = Timer.scheduledTimer(withTimeInterval: 0.5, repeats: true) { [weak self] _ in
            guard let self else { return }
            
            self.playerView.currentTime { time, error in
                if let _ = error { return }
                
                if time.magnitudeSquared != self.previousTime {
                    let state = KickRoomPlayerStateViewModel(progress: .paused, time: time.magnitude)
                    
                    self.reactor.action.onNext(.localUpdatePlayer(state))
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

extension KickRoomViewController {
    func setFirstVideo() {
        WebSocketService.shared.playlistObservable
            .filter { self.reactor.currentState.youtubeID == nil && $0.count == 0 }
            .compactMap { $0.first?.toModel().url.youtubeID }
            .withLatestFrom(reactor.state.map { $0.playerVars }) { ($0, $1) }
            .observe(on: MainScheduler.instance)
            .subscribe(with: self) { owner, value in
                let (youtubeID, playerVars) = value
                
                owner.emptyPlayerView.isHidden = true
                owner.playerView.load(withVideoId: youtubeID, playerVars: playerVars)
            }
            .disposed(by: disposeBag)
    }
}
