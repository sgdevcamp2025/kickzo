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
    private let logoImageView = UIImageView().then {
        $0.image = UIImage.logoSmall
        
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
    }
    
    
    // MARK: - configure Reactor
    
    override func bindAction(reactor: HomeReactor) {
        Observable.just(HomeReactor.Action.viewDidLoad)
            .bind(to: reactor.action)
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
                
                if let videoID = element.videoID,
                   element.videoThumbnail == nil {
                    reactor.action.onNext(.getVideoThumbnail(idx: row, id: videoID))
                }
                
                DispatchQueue.main.async {
                    cell.setContent(element)
                }
                
            }
            .disposed(by: disposeBag)
    }
    
    
    // MARK: - configure UI
    
    override func configureHierarchy() {
        view.addSubview(homeCollectionView)
    }
    
    override func configureLayout() {
        let safeArea = view.safeAreaLayoutGuide
        
        homeCollectionView.snp.makeConstraints { make in
            make.verticalEdges.equalTo(safeArea)
            make.horizontalEdges.equalToSuperview().offset(12)
        }
    }
    
    override func configureUI() {
        navigationItem.leftBarButtonItem = UIBarButtonItem(customView: logoImageView)
        navigationItem.rightBarButtonItem = UIBarButtonItem(customView: searchButton)
    }
}
