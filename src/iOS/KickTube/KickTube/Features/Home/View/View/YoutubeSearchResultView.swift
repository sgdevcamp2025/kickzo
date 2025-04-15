//
//  YoutubeSearchResultView.swift
//  KickTube
//
//  Created by 김수경 on 2/7/25.
//

import UIKit

import RxSwift

final class YoutubeSearchResultView: UIView {
    private let videoThumbnailView = UIImageView().then {
        $0.layer.cornerRadius = 12
        $0.clipsToBounds = true
        $0.contentMode = .scaleAspectFill
    }
    private let titleLabel = UILabel().then {
        $0.numberOfLines = 3
        $0.textColor = .white
        $0.font = KFont.bold15
    }
    private let usernameLabel = UILabel().then {
        $0.font = KFont.light13
        $0.textColor = UIColor.kGray
    }
    private(set) var addButton = UIButton(type: .system).then {
        $0.setTitle("추가하기", for: .normal)
        $0.titleLabel?.font = UIFont.boldSystemFont(ofSize: 40)
        $0.setTitleColor(.white, for: .normal)
        $0.backgroundColor = .clear
    }
    private var disposeBag = DisposeBag()
    
    override init(frame: CGRect) {
        super.init(frame: frame)
        
        configureHierarchy()
        configureLayout()
        configureUI()
    }

    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
   
    // MARK: - internal method

    func setContent(_ playlist: YoutubeVideoViewModel) {
        if let videoThumbnail = playlist.thumbnailData {
            videoThumbnailView.image = UIImage(data: videoThumbnail)
        } else {
            videoThumbnailView.image = .defaultThumbnail
        }
        
        titleLabel.text = playlist.title
        usernameLabel.text = playlist.channelTitle
    }
    
    
    // MARK: - configure UI
    
    private func configureHierarchy() {
        [videoThumbnailView, titleLabel, usernameLabel, addButton].forEach {
            addSubview($0)
        }
    }
    
    private func configureLayout() {
        videoThumbnailView.snp.makeConstraints { make in
            make.leading.equalToSuperview().inset(12)
            make.verticalEdges.equalToSuperview().inset(8)
            make.height.equalTo(ComponentSize.roomCollectionViewCell.size.height - 24)
            make.width.equalTo((ComponentSize.roomCollectionViewCell.size.height - 24) * 16 / 9)
        }
        titleLabel.snp.remakeConstraints { make in
            make.top.equalTo(videoThumbnailView.snp.top).offset(4)
            make.leading.equalTo(videoThumbnailView.snp.trailing).offset(12)
            make.trailing.equalToSuperview().offset(-12)
        }
        usernameLabel.snp.makeConstraints { make in
            make.top.equalTo(titleLabel.snp.bottom).offset(4)
            make.leading.equalTo(videoThumbnailView.snp.trailing).offset(12)
        }
        addButton.snp.makeConstraints { make in
            make.edges.equalToSuperview()
        }
    }
    
    private func configureUI() {
        backgroundColor = .black.withAlphaComponent(0.9)
    }
}
