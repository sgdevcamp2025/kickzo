//
//  KickRoomMainScrollView.swift
//  KickTube
//
//  Created by 김수경 on 2/6/25.
//

import UIKit

import RxSwift
import RxCocoa

class KickRoomMainScrollView: UIView {
    private let scrollView: UIScrollView = {
        let scrollView = UIScrollView()
        scrollView.showsHorizontalScrollIndicator = true
        scrollView.isPagingEnabled = true
        return scrollView
    }()
    private let stackView: UIStackView = {
        let stackView = UIStackView()
        stackView.axis = .horizontal
        stackView.alignment = .fill
        stackView.distribution = .fill
        return stackView
    }()
    private let playlistView = PlaylistView()
    private let voiceChatView = UIView().then { $0.backgroundColor = .blue }
    private let particiapteUserView = UIView().then { $0.backgroundColor = .green }
    
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
    
    func setPageIndex(_ idx: Int) {
        let offset = CGPoint(x: ComponentSize.screenWidth * CGFloat(idx), y: 0)
        scrollView.setContentOffset(offset, animated: true)
    }

    
    // MARK: - configure UI
    
    private func configureHierarchy() {
        addSubview(scrollView)
        scrollView.addSubview(stackView)
        [playlistView, voiceChatView, particiapteUserView].forEach {
            stackView.addArrangedSubview($0)
        }
    }
    
    private func configureLayout() {
        scrollView.snp.makeConstraints { make in
            make.edges.equalToSuperview()
        }
        
        stackView.snp.makeConstraints { make in
            make.edges.equalToSuperview()
            make.height.equalToSuperview()
        }
        
        [playlistView, voiceChatView, particiapteUserView].forEach {
            $0.snp.makeConstraints { make in
                make.size.equalTo(scrollView.snp.size)
            }
        }
    }
    
    private func configureUI() {
        backgroundColor = .white
        
        scrollView.contentSize = CGSize(width: frame.width * 3, height: frame.height)
    }
}
