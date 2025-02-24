//
//  HomeViewController.swift
//  KickTube
//
//  Created by 김수경 on 1/22/25.
//

import UIKit

import SnapKit
import ReactorKit
import RxCocoa
import RxSwift

final class HomeViewController: BaseViewController<HomeReactor> {
    private let createButton = UIButton().then {
        var config = UIButton.Configuration.plain()
        config.image = UIImage(systemName: "plus.circle")
        config.baseForegroundColor = .black
        
        $0.configuration = config
        $0.setPreferredSymbolConfiguration(UIImage.SymbolConfiguration(weight: .bold), forImageIn: .normal)
    }
    private let searchButton = UIButton().then {
        var config = UIButton.Configuration.plain()
        config.image = UIImage(systemName: "magnifyingglass")
        config.baseForegroundColor = .black
        
        $0.configuration = config
        $0.setPreferredSymbolConfiguration(UIImage.SymbolConfiguration(weight: .bold), forImageIn: .normal)
    }
    private let homeCollectionView = UICollectionView(frame: .zero, collectionViewLayout: .homeCollectionViewLayout()).then {
        $0.register(HomeVideoCollectionViewCell.self, forCellWithReuseIdentifier: HomeVideoCollectionViewCell.reuseIdentifier)
        $0.showsVerticalScrollIndicator = false
    }
    
    override func viewWillAppear(_ animated: Bool) {
        reactor.action.onNext(.getRoom)
    }
    
    // MARK: - configure Reactor
    
    override func bindAction(reactor: HomeReactor) {
        homeCollectionView.rx.itemSelected
            .map { Reactor.Action.homeCellTapped(idx: $0) }
            .bind(to: reactor.action)
            .disposed(by: disposeBag)
        
        homeCollectionView.rx.prefetchItems
            .subscribe(onNext: { [weak self] indexPaths in
                guard let self else { return }
                
                let lastIndexPath = indexPaths.last?.row ?? 0
               
                if lastIndexPath >= self.reactor.currentState.rooms.count - 4 {
                    reactor.action.onNext(.getRoom)
                }
            })
            .disposed(by: disposeBag)
    }
    
    override func bindState(reactor: HomeReactor) {
        reactor.state
            .map { $0.rooms }
            .distinctUntilChanged()
            .bind(to: homeCollectionView.rx.items(
                cellIdentifier: HomeVideoCollectionViewCell.reuseIdentifier,
                cellType: HomeVideoCollectionViewCell.self
            )) { row, element, cell in
                if let videoID = element.playlistURL?.youtubeID,
                   element.videoThumbnail == nil {
                    reactor.action.onNext(.getVideoThumbnail(idx: row, id: videoID))
                }
                if let profileImageURL = element.profileImageURL {
                    reactor.action.onNext(.getProfileThumbnail(idx: row, url: profileImageURL))
                }
                
                DispatchQueue.main.async {
                    cell.setContent(element)
                }
            }
            .disposed(by: disposeBag)
        
        reactor.state
            .map { $0.joinRoomCode }
            .compactMap { $0 }
            .asDriver(onErrorJustReturn: "")
            .drive(with: self) { owner, value in
                let vc = KickRoomViewController(KickRoomReactor(value))

                vc.modalPresentationStyle = .overFullScreen

                owner.present(vc, animated: true)
            }
            .disposed(by: disposeBag)
    }
    
    @objc
    private func createButtonTapped() {
        let vc = CreateRoomViewController(CreateRoomReactor())
        
        vc.modalPresentationStyle = .overFullScreen
        
        self.present(vc, animated: false)
    }
    
    @objc
    private func searchButtonTapped() {
        
    }
    
    
    // MARK: - configure UI
    
    override func configureHierarchy() {
        view.addSubview(homeCollectionView)
    }
    
    override func configureLayout() {
        let safeArea = view.safeAreaLayoutGuide
        
        homeCollectionView.snp.makeConstraints { make in
            make.verticalEdges.equalTo(safeArea)
            make.horizontalEdges.equalToSuperview().inset(12)
        }
    }
    
    override func configureUI() {
        super.configureUI()
        
        navigationItem.leftBarButtonItem = UIBarButtonItem(customView: UIImageView(image: .logoSmall))
        navigationItem.rightBarButtonItems = [UIBarButtonItem(customView: searchButton), UIBarButtonItem(customView: createButton)]
        
        createButton.addTarget(self, action: #selector(createButtonTapped), for: .touchUpInside)
        searchButton.addTarget(self, action: #selector(searchButtonTapped), for: .touchUpInside)
    }
}
