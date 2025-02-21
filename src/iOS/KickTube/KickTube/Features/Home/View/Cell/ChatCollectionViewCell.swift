//
//  ChatCollectionViewCell.swift
//  KickTube
//
//  Created by 김수경 on 2/11/25.
//

import UIKit

import RxSwift

final class ChatCollectionViewCell: UICollectionViewCell {
    private let thumbnailImageView = UIImageView().then {
        $0.layer.cornerRadius = 8
        $0.clipsToBounds = true
    }
    private let nameStackView = UIStackView().then {
        $0.axis = .horizontal
        $0.distribution = .fillProportionally
        $0.spacing = 4
    }
    private let roleImageView = UIImageView().then {
        $0.isHidden = true
    }
    private let nameLabel = UILabel().then {
        $0.font = KFont.bold14
    }
    private let dateLabel = UILabel().then {
        $0.font = KFont.light12
        $0.textColor = .kGray
    }
    private let messageLabel = UILabel().then {
        $0.font = KFont.middle14
        $0.numberOfLines = 0
        $0.lineBreakMode = .byWordWrapping
    }
    
    private let networkManager = NetworkManager()
    
    var disposeBag = DisposeBag()
    
    override init(frame: CGRect) {
        super.init(frame: .zero)
        
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
   
    func setContent(_ content: ChatMessageViewModel) {
        Task { [weak self] in
            guard let self else { return }
            
            do {
                if let profile = content.profileImageURL {
                    let imageData = try await networkManager.getCachingDataFromURL(profile)
                    
                    thumbnailImageView.image = UIImage(data: imageData)
                } else {
                    thumbnailImageView.image = UIImage.defaultProfile
                }
            } catch {
                print("Failed to load profile image: \(error.localizedDescription)")
                thumbnailImageView.image = UIImage.defaultProfile
            }
            
            DispatchQueue.main.async {
                switch content.role {
                case .creator:
                    self.roleImageView.isHidden = false
                    self.roleImageView.image = .creator
                    self.nameLabel.textColor = .primary
                case .manager:
                    self.roleImageView.isHidden = false
                    self.roleImageView.image = .manager
                    self.nameLabel.textColor = .primary
                default:
                    self.roleImageView.isHidden = true
                }
                
                self.nameLabel.text = content.nickname
                self.dateLabel.text = content.dateString
                self.messageLabel.text = content.message
            }
        }
    }
    
    
    // MARK: - private method
    
    private func clearContent() {
        thumbnailImageView.image = nil
        roleImageView.isHidden = true
        nameLabel.text = nil
        nameLabel.textColor = .black
        dateLabel.text = nil
        messageLabel.text = nil
    }

    
    // MARK: - Configure UI
    
    private func configureHierarchy() {
        [thumbnailImageView, nameStackView, messageLabel].forEach {
            contentView.addSubview($0)
        }
        
        [roleImageView, nameLabel, dateLabel].forEach {
            nameStackView.addArrangedSubview($0)
        }
    }
    
    private func configureLayout() {
        thumbnailImageView.snp.makeConstraints { make in
            make.size.equalTo(ComponentSize.homeProfileImage.size).multipliedBy(4)
            make.top.leading.equalToSuperview().inset(8)
        }
        nameStackView.snp.makeConstraints { make in
            make.top.equalToSuperview().inset(8)
            make.leading.equalTo(thumbnailImageView.snp.trailing).offset(8)
        }
        roleImageView.snp.makeConstraints { make in
            make.size.equalTo(CGSize(width: 14, height: 14))
        }
        messageLabel.snp.makeConstraints { make in
            make.top.equalTo(nameStackView.snp.bottom).offset(8)
            make.leading.equalTo(thumbnailImageView.snp.trailing).offset(8)
            make.trailing.equalToSuperview().offset(-8)
            make.bottom.equalToSuperview()
            make.height.greaterThanOrEqualTo(14)
        }
    }   
}
