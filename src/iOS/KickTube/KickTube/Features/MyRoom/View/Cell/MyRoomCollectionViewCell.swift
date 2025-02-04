//
//  MyRoomCollectionViewCell.swift
//  KickTube
//
//  Created by 김수경 on 2/3/25.
//

import UIKit

import RxCocoa
import RxSwift

final class MyRoomCollectionViewCell: UICollectionViewCell {
    private let videoThumbnailView = UIImageView().then {
        $0.layer.cornerRadius = 12
        $0.clipsToBounds = true
        $0.contentMode = .scaleAspectFill
    }
    private let titleLabel = UILabel().then {
        $0.numberOfLines = 2
        $0.font = KFont.middle16
    }
    private let optionButton = UIButton().then {
        var config = UIButton.Configuration.plain()
        config.image = UIImage.ellipsis
        config.baseForegroundColor = .kGray
        
        $0.configuration = config
        $0.setPreferredSymbolConfiguration(UIImage.SymbolConfiguration(pointSize: 20), forImageIn: .normal)
    }
    private let usernameLabel = UILabel().then {
        $0.font = KFont.light14
        $0.textColor = UIColor.kGray
    }
    private let participaingIconImageView = UIImageView().then {
        $0.tintColor = .kDarkgray
        $0.image = .friend
    }
    private let participatingCountLabel = UILabel().then {
        $0.textColor = .kDarkgray
        $0.font = KFont.light14
    }

    var moveToOptionVC: (() -> Void)?
    
    private var disposeBag = DisposeBag()
    
    override init(frame: CGRect) {
        super.init(frame: frame)
        
        configureHierarchy()
        configureLayout()
    }

    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    override func prepareForReuse() {
        super.prepareForReuse()
        
        clearContent()
        
        disposeBag = DisposeBag()
    }
  
    
    // MARK: - internal method

    func setContent(_ room: MyRoomViewModel) {
        if let videoThumbnail = room.videoThumbnail {
            videoThumbnailView.image = UIImage(data: videoThumbnail)
        } else {
            videoThumbnailView.backgroundColor = .darkGray
        }
        
        titleLabel.text = room.title
        usernameLabel.text = room.creator
        participatingCountLabel.text = room.userCount

        optionButton.rx.tap
            .subscribe(with: self) { owner, _ in
                owner.moveToOptionVC?()
            }
            .disposed(by: disposeBag)
    }
    
    func clearContent() {
        videoThumbnailView.image = nil
        titleLabel.text = nil
        usernameLabel.text = nil
        participatingCountLabel.text = nil
    }
    
    // MARK: - configure UI
    
    private func configureHierarchy() {
        [videoThumbnailView, titleLabel, optionButton, usernameLabel, participaingIconImageView, participatingCountLabel].forEach {
            addSubview($0)
        }
    }
    
    private func configureLayout() {
        videoThumbnailView.snp.makeConstraints { make in
            make.leading.verticalEdges.equalToSuperview()
            make.width.equalTo(ComponentSize.homeCollectionViewCell.size.width / 123 * 52)
        }
        optionButton.snp.makeConstraints { make in
            make.top.equalTo(videoThumbnailView.snp.top)
            make.trailing.equalToSuperview()
            make.width.equalTo(8)
        }
        titleLabel.snp.remakeConstraints { make in
            make.top.equalTo(videoThumbnailView.snp.top).offset(4)
            make.leading.equalTo(videoThumbnailView.snp.trailing).offset(12)
            make.trailing.equalTo(optionButton.snp.leading).offset(-12)
        }
        usernameLabel.snp.makeConstraints { make in
            make.top.equalTo(titleLabel.snp.bottom).offset(4)
            make.leading.equalTo(videoThumbnailView.snp.trailing).offset(12)
        }
        participaingIconImageView.snp.makeConstraints { make in
            make.leading.equalTo(videoThumbnailView.snp.trailing).offset(12)
            make.bottom.equalToSuperview().offset(-4)
        }
        participatingCountLabel.snp.makeConstraints { make in
            make.leading.equalTo(participaingIconImageView.snp.trailing).offset(4)
            make.centerY.equalTo(participaingIconImageView.snp.centerY)
        }
    }
}
