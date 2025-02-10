//
//  VoiceChatUserListCollectionViewCell.swift
//  KickTube
//
//  Created by 김수경 on 2/10/25.
//

import UIKit

import RxSwift

final class VoiceChatUserListCollectionViewCell: UICollectionViewCell {
    private let stackView = UIStackView().then {
        $0.axis = .horizontal
        $0.spacing = 8
    }
    private let profileThumbnailView = UIImageView().then {
        $0.layer.cornerRadius = ComponentSize.homeProfileImage.radius
    }
    private let roleImageView = UIImageView().then {
        $0.isHidden = true
    }
    private let nameLabel = UILabel().then {
        $0.font = KFont.bold16
    }
    private let meLabel = UILabel().then {
        $0.text = "나"
        $0.font = KFont.bold12
        $0.textColor = .white
        $0.backgroundColor = .black
        $0.textAlignment = .center
        $0.layer.cornerRadius = 9
        $0.clipsToBounds = true
        $0.isHidden = true
    }
    private let micButton = UIButton().then {
        $0.setImage(.micOff, for: .normal)
        $0.isHidden = true
    }
    private let headsetButton = UIButton().then {
        $0.setImage(.headsetOff, for: .normal)
        $0.isHidden = true
    }
    
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
    
    private func clearContent() {
        profileThumbnailView.image = nil
        roleImageView.image = nil
        roleImageView.isHidden = true
        nameLabel.text = nil
        nameLabel.textColor = .black
        meLabel.isHidden = true
        micButton.isHidden = true
        headsetButton.isHidden = true
    }
    
    // MARK: - internal method
    
    func setContent(_ user: KickRoomVoiceUserViewModel) {
        if let profileThumbnail = user.thumbnailImage {
            profileThumbnailView.image = UIImage(data: profileThumbnail)
        } else {
            profileThumbnailView.backgroundColor = .darkGray
        }
        
        switch user.role {
        case .creator:
            roleImageView.isHidden = false
            roleImageView.image = .creator
            nameLabel.textColor = .primary
        case .manager:
            roleImageView.isHidden = false
            roleImageView.image = .manager
            nameLabel.textColor = .kGreen
        default:
            break
        }
        
        nameLabel.text = user.nickname
    
        if user.userID == UserDefaultsManager.shared.userProfile.userID {
            meLabel.isHidden = false
        }
        if user.micStatus == false {
            micButton.isHidden = false
        }
        if user.headsetStatus == false {
            headsetButton.isHidden = false
        }
    }

    
    // MARK: - configure UI
    
    private func configureHierarchy() {
        [profileThumbnailView, stackView, meLabel, micButton, headsetButton].forEach {
            contentView.addSubview($0)
        }
        [roleImageView, nameLabel].forEach {
            stackView.addArrangedSubview($0)
        }
    }
    
    private func configureLayout() {
        profileThumbnailView.snp.makeConstraints { make in
            make.leading.verticalEdges.equalToSuperview().inset(4)
            make.size.equalTo(CGSize(width: ComponentSize.userCollectionViewCell.size.height - 8, height: ComponentSize.userCollectionViewCell.size.height - 8))
        }
        stackView.snp.makeConstraints { make in
            make.leading.equalTo(profileThumbnailView.snp.trailing).offset(8)
            make.centerY.equalToSuperview()
        }
        roleImageView.snp.makeConstraints { make in
            make.size.equalTo(CGSize(width: 14, height: 14))
        }
        meLabel.snp.makeConstraints { make in
            make.leading.equalTo(stackView.snp.trailing).offset(8)
            make.centerY.equalToSuperview()
            make.size.equalTo(18)
        }
        headsetButton.snp.makeConstraints { make in
            make.trailing.equalToSuperview().offset(-4)
            make.centerY.equalToSuperview()
            make.size.equalTo(CGSize(width: 14, height: 14))
        }
        micButton.snp.makeConstraints { make in
            make.trailing.equalTo(headsetButton.snp.leading).offset(-4)
            make.centerY.equalToSuperview()
            make.size.equalTo(CGSize(width: 14, height: 18))
        }
    }
}
