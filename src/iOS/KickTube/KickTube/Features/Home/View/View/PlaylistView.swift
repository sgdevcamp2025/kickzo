//
//  PlaylistView.swift
//  KickTube
//
//  Created by 김수경 on 2/6/25.
//

import UIKit

import RxSwift
import RxCocoa

final class PlaylistView: UIView {
    private let backgroundView = UIView().then {
        $0.clipsToBounds = true
    }
    private let searchVideoTextField = LightStrokeTextField().then {
        $0.layer.cornerRadius = 0
        $0.backgroundColor = .white
        $0.textfield.placeholder = "공유하고 싶은 youtube url을 입력해주세요."
    }
    private let playlistCollectionView = UICollectionView(frame: .zero, collectionViewLayout: .myRoomCollectionViewLayout(false)).then {
        $0.register(PlayListCollectionViewCell.self, forCellWithReuseIdentifier: PlayListCollectionViewCell.reuseIdentifier)
        $0.showsVerticalScrollIndicator = false
        $0.showsHorizontalScrollIndicator = false
    }
    private let searchResultView = YoutubeSearchResultView().then {
        $0.isHidden = true
    }
    
    private let viewModel = PlayListViewModel()
    private let orderChanged = PublishRelay<(from: IndexPath, to: IndexPath)>()
    
    private var disposeBag = DisposeBag()
    
    override init(frame: CGRect) {
        super.init(frame: frame)
        
        configureHierarchy()
        configureLayout()
        configureUI()
        
        bind()
    }
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    
    // MARK: - configure bind input, output
    
    private func bind() {
        let load = BehaviorRelay<Void>(value: ())
        let searchLink = PublishRelay<String>()
        let emptyThumbnail = PublishRelay<Int>()
        let addAction = PublishRelay<Void>()
        let deleteACtion = PublishRelay<Int>()
        
        let input = PlayListViewModel.Input(loadView: load, emptyThumbnailImage: emptyThumbnail, editingTextInput: searchLink, addButtonTapped: addAction, orderChanged: self.orderChanged, deleteButtonTapped: deleteACtion)
        let output = viewModel.transform(input)
        
        
        // MARK: - input
        
        searchVideoTextField.textfield
            .rx.text
            .orEmpty
            .debounce(.milliseconds(500), scheduler: MainScheduler.instance)
            .distinctUntilChanged()
            .subscribe(with: self) { owner, value in
                searchLink.accept(value)
            }
            .disposed(by: disposeBag)
        
        searchResultView.addButton.rx.tap
            .bind(with: self, onNext: { owner, _ in
                addAction.accept(())
                owner.searchResultView.isHidden = true
                owner.searchVideoTextField.textfield.text = ""
            })
            .disposed(by: disposeBag)
        
        
        // MARK: - output
        
        output.playlist
            .asDriver(onErrorJustReturn: [])
            .drive(playlistCollectionView.rx.items(cellIdentifier: PlayListCollectionViewCell.reuseIdentifier, cellType: PlayListCollectionViewCell.self)) { (item, element, cell) in
                if element.thumbnailData == nil {
                    input.emptyThumbnailImage.accept(item)
                }
                cell.setContent(element)
                cell.deleteAction = {
                    deleteACtion.accept(item)
                }
            }
            .disposed(by: disposeBag)
        
        output.validVideo
            .observe(on: MainScheduler.instance)
            .subscribe(with: self, onNext: { owner, value in
                if let value {
                    owner.searchResultView.isHidden = false
                    owner.searchResultView.setContent(value)
                } else {
                    owner.searchResultView.isHidden = true
                }
            })
            .disposed(by: disposeBag)
    }
    
    
    // MARK: - configure UI
    
    private func configureHierarchy() {
        addSubview(backgroundView)
        [searchVideoTextField, playlistCollectionView, searchResultView].forEach {
            backgroundView.addSubview($0)
        }
    }
    
    private func configureLayout() {
        backgroundView.snp.makeConstraints { make in
            make.edges.equalToSuperview().inset(12)
        }
        searchVideoTextField.snp.makeConstraints { make in
            make.horizontalEdges.top.equalToSuperview()
        }
        playlistCollectionView.snp.makeConstraints { make in
            make.top.equalTo(searchVideoTextField.snp.bottom).offset(8)
            make.horizontalEdges.equalToSuperview().inset(8)
            make.bottom.equalToSuperview().offset(-8)
        }
        searchResultView.snp.makeConstraints { make in
            make.horizontalEdges.equalToSuperview()
            make.top.equalTo(searchVideoTextField.snp.bottom)
            make.height.equalTo(ComponentSize.roomCollectionViewCell.size.height)
        }
    }
    
    private func configureUI() {
        backgroundView.layer.cornerRadius = 8
        backgroundView.layer.borderWidth = 1
        backgroundView.layer.borderColor = UIColor.kGray.cgColor
        
        setupDragAndDrop()        
    }
}

extension PlaylistView: UICollectionViewDragDelegate, UICollectionViewDropDelegate {
    private func setupDragAndDrop() {
        playlistCollectionView.dragDelegate = self
        playlistCollectionView.dropDelegate = self
        playlistCollectionView.dragInteractionEnabled = true
    }
    
    
    // MARK: - delegate method

    func collectionView(_ collectionView: UICollectionView, canHandle session: any UIDropSession) -> Bool {
        true
    }
    
    func collectionView(_ collectionView: UICollectionView, itemsForBeginning session: any UIDragSession, at indexPath: IndexPath) -> [UIDragItem] {
        let item = viewModel.playlist[indexPath.item]
        let itemProvider = NSItemProvider(object: item.title as NSString)
        let dragItem = UIDragItem(itemProvider: itemProvider)
        dragItem.localObject = item
        
        return [dragItem]
    }
    
    func collectionView(_ collectionView: UICollectionView, dropSessionDidUpdate session: any UIDropSession, withDestinationIndexPath destinationIndexPath: IndexPath?) -> UICollectionViewDropProposal {
        UICollectionViewDropProposal(operation: .move, intent: .insertAtDestinationIndexPath)
    }
    
    func collectionView(_ collectionView: UICollectionView, performDropWith coordinator: any UICollectionViewDropCoordinator) {
        guard let destinationIndexPath = coordinator.destinationIndexPath else { return }
        
        coordinator.items.forEach { dropItem in
            guard let sourceIndexPath = dropItem.sourceIndexPath else { return }
            
            collectionView.performBatchUpdates {
                collectionView.deleteItems(at: [sourceIndexPath])
                collectionView.insertItems(at: [destinationIndexPath])
                
                self.orderChanged.accept((sourceIndexPath, destinationIndexPath))
            } completion: { _ in
                coordinator.drop(dropItem.dragItem, toItemAt: destinationIndexPath)
            }
        }
    }
}
