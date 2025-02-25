//
//  PlayListCollectionViewCell.swift
//  KickTube
//
//  Created by 김수경 on 2/7/25.
//

import UIKit

import RxSwift

final class PlayListCollectionViewCell: UICollectionViewCell {
    private let videoThumbnailView = UIImageView().then {
        $0.layer.cornerRadius = 12
        $0.clipsToBounds = true
        $0.contentMode = .scaleAspectFill
    }
    private let titleLabel = UILabel().then {
        $0.numberOfLines = 3
        $0.font = KFont.middle15
    }
    private let usernameLabel = UILabel().then {
        $0.font = KFont.light13
        $0.textColor = UIColor.kGray
    }
    private let deleteButton = UIButton().then {
        $0.setImage(.trash, for: .normal)
        $0.tintColor = .kGray
    }
    
    var deleteAction: (()->Void)?
    
    private var disposeBag = DisposeBag()
    
    override init(frame: CGRect) {
        super.init(frame: frame)
        
        configureHierarchy()
        configureLayout()
        bind()
    }
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    override func prepareForReuse() {
        super.prepareForReuse()
        
        clearContent()
        
        disposeBag = DisposeBag()
    }
    
    
    // MARK: - configure bind

    private func bind() {
        deleteButton.rx.tap
            .bind(with: self) { owner, _ in
                owner.deleteAction?()
            }
            .disposed(by: disposeBag)
    }
    
    // MARK: - internal method
    
    func setContent(_ playlist: YoutubeVideoViewModel) {
        if let videoThumbnail = playlist.thumbnailData {
            videoThumbnailView.image = UIImage(data: videoThumbnail)
        } else {
            videoThumbnailView.backgroundColor = .darkGray
        }
        
        titleLabel.text = playlist.title
        usernameLabel.text = playlist.channelTitle
    }
    
    func clearContent() {
        videoThumbnailView.image = nil
        titleLabel.text = nil
        usernameLabel.text = nil
    }
    
    
    // MARK: - configure UI
    
    private func configureHierarchy() {
        [videoThumbnailView, titleLabel, usernameLabel, deleteButton].forEach {
            contentView.addSubview($0)
        }
    }
    
    private func configureLayout() {
        videoThumbnailView.snp.makeConstraints { make in
            make.leading.verticalEdges.equalToSuperview()
            make.height.equalTo(contentView.frame.height - 16)
            make.width.equalTo((contentView.frame.height - 16) * 16 / 9)
        }
        titleLabel.snp.remakeConstraints { make in
            make.top.equalTo(videoThumbnailView.snp.top).offset(4)
            make.leading.equalTo(videoThumbnailView.snp.trailing).offset(12)
            make.trailing.equalTo(contentView).offset(-12)
        }
        usernameLabel.snp.makeConstraints { make in
            make.top.equalTo(titleLabel.snp.bottom).offset(4)
            make.leading.equalTo(videoThumbnailView.snp.trailing).offset(12)
        }
        deleteButton.snp.makeConstraints { make in
            make.bottom.equalToSuperview()
            make.trailing.equalToSuperview().inset(15)
            make.size.equalTo(CGSize(width: 45, height: 45))
        }
    }
}
