//
//  MyRoomViewController.swift
//  KickTube
//
//  Created by 김수경 on 2/2/25.
//

import UIKit

import ReactorKit
import RxCocoa
import RxDataSources
import RxSwift

final class MyRoomViewController: BaseViewController<MyRoomReactor> {
    private lazy var myRoomCollectionView = UICollectionView(frame: .zero, collectionViewLayout: .myRoomCollectionViewLayout()).then {
        $0.register(MyRoomCollectionViewCell.self, forCellWithReuseIdentifier: MyRoomCollectionViewCell.reuseIdentifier)
        $0.register(UICollectionReusableView.self, forSupplementaryViewOfKind: UICollectionView.elementKindSectionHeader, withReuseIdentifier: "Header")
        $0.showsVerticalScrollIndicator = false
    }
    private lazy var dataSource = RxCollectionViewSectionedReloadDataSource<MyRoomSection>(configureCell: { _, collecitonView, indexPath, item in
        switch item {
        case let .created(room):
            guard let cell = self.myRoomCollectionView.dequeueReusableCell(withReuseIdentifier: MyRoomCollectionViewCell.reuseIdentifier, for: indexPath) as? MyRoomCollectionViewCell else {
                return UICollectionViewCell()
            }
            
            if let videoID = room.videoID,
               room.videoThumbnail == nil {
                self.reactor.action.onNext(.getVideoThumbnail(idx: indexPath, id: videoID))
            }
            
            DispatchQueue.main.async {
                cell.setContent(room)
                cell.moveToOptionVC = {
                    let vc = OptionButtonViewController(option: .deleteCreatedRoom, reactor: OptionButtonReactor(id: room.roomID, indexPath: indexPath))
                    
                    vc.delegate = self
                    vc.modalPresentationStyle = .overFullScreen
                    
                    self.present(vc, animated: false)
                }
            }
            
            return cell
        case let .participated(room):
            guard let cell = self.myRoomCollectionView.dequeueReusableCell(withReuseIdentifier: MyRoomCollectionViewCell.reuseIdentifier, for: indexPath) as? MyRoomCollectionViewCell else {
                return UICollectionViewCell()
            }
            
            if let videoID = room.videoID,
               room.videoThumbnail == nil {
                self.reactor.action.onNext(.getVideoThumbnail(idx: indexPath, id: videoID))
            }
            
            DispatchQueue.main.async {
                cell.setContent(room)
                cell.moveToOptionVC = {
                    let vc = OptionButtonViewController(option: .leaveParticipatedRoom, reactor: OptionButtonReactor(id: room.roomID, indexPath: indexPath))
                    
                    vc.delegate = self
                    vc.modalPresentationStyle = .overFullScreen
                    
                    self.present(vc, animated: false)
                }
            }
            
            return cell
        }
    }, configureSupplementaryView: { dataSource, collectionView, kind, indexPath in
        if kind == UICollectionView.elementKindSectionHeader {
            let header = collectionView.dequeueReusableSupplementaryView(ofKind: kind, withReuseIdentifier: "Header", for: indexPath)
            if let label = header.subviews.compactMap({ $0 as? UILabel }).first {
                label.text = dataSource.sectionModels[indexPath.section].header
            } else {
                let label = UILabel(frame: header.bounds)
                
                label.text = dataSource.sectionModels[indexPath.section].header
                label.font = KFont.bold20
                label.textAlignment = .left
                
                header.addSubview(label)
            }
            
            return header
        }
        return UICollectionReusableView()
    })
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        
        reactor.action.onNext(.viewWillAppear)
    }
    
    
    // MARK: - configure Reactor
    
    override func bindAction(reactor: MyRoomReactor) {
        Observable.just(MyRoomReactor.Action.viewWillAppear)
            .bind(to: reactor.action)
            .disposed(by: disposeBag)
    }
    
    override func bindState(reactor: MyRoomReactor) {
        reactor.state.map { $0.sections }
            .bind(to: myRoomCollectionView.rx.items(dataSource: dataSource))
            .disposed(by: disposeBag)
    }
    
    
    // MARK: - configure UI
    
    override func configureHierarchy() {
        view.addSubview(myRoomCollectionView)
    }
    
    override func configureLayout() {
        let safeArea = view.safeAreaLayoutGuide
        
        myRoomCollectionView.snp.makeConstraints { make in
            make.verticalEdges.equalTo(safeArea)
            make.centerX.equalTo(safeArea.snp.centerX)
            make.width.equalTo(ComponentSize.roomCollectionViewCell.size.width)
        }
    }
    
    override func configureUI() {
        super.configureUI()
        
        navigationItem.leftBarButtonItem = UIBarButtonItem(customView: UIImageView(image: .logoSmall))
    }
    
}

extension MyRoomViewController: MyRoomDelegate {
    func deleteRoom(idx: IndexPath, result: Bool) {
        if result {
            Observable.just(MyRoomReactor.Action.deleteButtonTapped(idx: idx))
                .bind(to: reactor.action)
                .disposed(by: disposeBag)
        }
    }
    
    func leaveRoom(idx: IndexPath, result: Bool) {
        if result {
            Observable.just(MyRoomReactor.Action.leaveButtonTapped(idx: idx))
                .bind(to: reactor.action)
                .disposed(by: disposeBag)
        }
    }
}
