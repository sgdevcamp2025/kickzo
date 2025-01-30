//
//  HomeVideoCollectionViewCell.swift
//  KickTube
//
//  Created by 김수경 on 1/22/25.
//

import UIKit

import RxCocoa
import RxSwift

final class HomeVideoCollectionViewCell: UICollectionViewCell {
    private let videoThumbnailView = UIImageView().then {
        $0.layer.cornerRadius = 12
        $0.clipsToBounds = true
        $0.contentMode = .scaleAspectFill
    }
    private let userProfileThumbnailView = UIImageView().then {
        $0.layer.cornerRadius = ComponentSize.homeProfileImage.radius
        $0.clipsToBounds = true
    }
    private let titleLabel = UILabel().then {
        $0.numberOfLines = 2
        $0.font = KFont.middle16
    }
    private let usernameLabel = UILabel().then {
        $0.font = KFont.light14
        $0.textColor = UIColor.kGray
    }
    
    var disposeBag = DisposeBag()
    
    override init(frame: CGRect) {
        super.init(frame: frame)
        
        configureHierarchy()
        configureLayout()
        configureUI()
    }

    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    override func prepareForReuse() {
        super.prepareForReuse()
        disposeBag = DisposeBag()
    }
  
    
    // MARK: - internal method

    func setContent(_ room: HomeRoomViewModel) {
        if let videoThumbnail = room.videoThumbnail {
            videoThumbnailView.image = UIImage(data: videoThumbnail)
        } else {
            videoThumbnailView.backgroundColor = .darkGray
        }
        userProfileThumbnailView.image = UIImage.defaultProfile
        titleLabel.text = room.roomTitle
        usernameLabel.text = room.userName
    }
    

    // MARK: - configure UI
    
    private func configureHierarchy() {
        [videoThumbnailView, userProfileThumbnailView, titleLabel, usernameLabel].forEach {
            addSubview($0)
        }
    }
    
    private func configureLayout() {
        videoThumbnailView.snp.makeConstraints { make in
            make.top.horizontalEdges.equalToSuperview()
            make.height.equalTo(ComponentSize.homeCollectionViewCell.size.width * 9 / 16)
        }
        userProfileThumbnailView.snp.makeConstraints { make in
            make.top.equalTo(videoThumbnailView.snp.bottom).offset(12)
            make.leading.equalToSuperview()
            make.size.equalTo(ComponentSize.homeProfileImage.size)
        }
        titleLabel.snp.makeConstraints { make in
            make.top.equalTo(userProfileThumbnailView.snp.top)
            make.leading.equalTo(userProfileThumbnailView.snp.trailing).offset(10)
            make.trailing.equalToSuperview()
        }
        usernameLabel.snp.makeConstraints { make in
            make.top.equalTo(titleLabel.snp.bottom).offset(6)
            make.leading.equalTo(userProfileThumbnailView.snp.trailing).offset(10)
            make.trailing.bottom.equalToSuperview()
        }
    }
    
    private func configureUI() {
        userProfileThumbnailView.layer.cornerRadius = userProfileThumbnailView.frame.width * 2 / 9
    }
}
