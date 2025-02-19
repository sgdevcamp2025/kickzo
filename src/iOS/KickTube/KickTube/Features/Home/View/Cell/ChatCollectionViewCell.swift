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
    
    private var disposeBag = DisposeBag()
    
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
        if let profile = content.profileThumbnail {
            thumbnailImageView.image = UIImage(data: profile)
        } else {
            thumbnailImageView.image = UIImage(color: UIColor(red: CGFloat.random(in: 0...1), green: CGFloat.random(in: 0...1), blue: CGFloat.random(in: 0...1), alpha: 1))
        }
        
        switch content.role {
        case .creator:
            roleImageView.isHidden = false
            roleImageView.image = .creator
            nameLabel.textColor = .primary
        case .manager:
            roleImageView.isHidden = false
            roleImageView.image = .manager
            nameLabel.textColor = .primary
        default:
            break
        }
        
        nameLabel.text = content.nickname
        dateLabel.text = content.dateString
        messageLabel.text = content.message
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
