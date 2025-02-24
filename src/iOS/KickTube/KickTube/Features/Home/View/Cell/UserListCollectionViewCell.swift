//
//  UserListCollectionViewCell.swift
//  KickTube
//
//  Created by 김수경 on 2/9/25.
//

import UIKit

import RxSwift

final class UserListCollectionViewCell: UICollectionViewCell {
    private let stackView = UIStackView().then {
        $0.axis = .horizontal
        $0.spacing = 8
    }
    private let profileThumbnailView = UIImageView().then {
        $0.clipsToBounds = true
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
    
    private let networkManager = NetworkManager()
    
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
        contentView.alpha = 1.0
    }
    
    
    // MARK: - internal method

    func setContent(_ user: KickRoomUserViewModel) {
        Task { [weak self] in
            guard let self else { return }
            
            do {
                if let profileURL = user.profileURL {
                    let imageData = try await networkManager.getCachingDataFromURL(profileURL)
                    
                    self.profileThumbnailView.image = UIImage(data: imageData)
                } else {
                    self.profileThumbnailView.image = UIImage.defaultProfile
                }
            } catch {
                print("Failed to load profile image: \(error.localizedDescription)")
                self.profileThumbnailView.image = UIImage.defaultProfile
            }
            
            DispatchQueue.main.async {
                switch user.role {
                case .creator:
                    self.roleImageView.isHidden = false
                    self.roleImageView.image = .creator
                    self.nameLabel.textColor = .primary
                case .manager:
                    self.roleImageView.isHidden = false
                    self.roleImageView.image = .manager
                    self.nameLabel.textColor = .kGreen
                default:
                    break
                }
                
                self.nameLabel.text = user.nickname
                
                if user.userID == UserDefaultsManager.shared.myProfile.userID {
                    self.meLabel.isHidden = false
                }
                if let active = user.active,
                   !active {
                    self.contentView.alpha = 0.3
                }
            }
        }
    }

    
    // MARK: - configure UI
    
    private func configureHierarchy() {
        [profileThumbnailView, stackView, meLabel].forEach {
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
    }
}
