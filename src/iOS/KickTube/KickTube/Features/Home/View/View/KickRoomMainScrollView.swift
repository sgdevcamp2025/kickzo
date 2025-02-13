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
    private let scrollView = UIScrollView().then {
        $0.showsHorizontalScrollIndicator = false
        $0.isPagingEnabled = true
    }
    private let stackView = UIStackView().then {
        $0.axis = .horizontal
        $0.alignment = .fill
        $0.distribution = .fillEqually
    }
    private let descriptionView: DescriptionView
    private let playlistView = PlaylistView()
    private let voiceChatView = VoiceChatListView(VoiceChatListReactor())
    private let userlistView = UserListView(UserListReactor(SampleTest.userlist))
    
    var didUpdatePageIndex: ((Int) -> Void)?
    
    init(roomInfo: KickRoomInfoViewModel) {
        self.descriptionView = DescriptionView(roomInfo.description)
        
        super.init(frame: .zero)
        
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

        DispatchQueue.main.async {
            self.scrollView.setContentOffset(offset, animated: true)
        }
    }

    
    // MARK: - configure UI
    
    private func configureHierarchy() {
        addSubview(scrollView)
        scrollView.addSubview(stackView)
        [descriptionView, playlistView, voiceChatView, userlistView].forEach {
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
            make.width.equalTo(scrollView.snp.width).multipliedBy(4)
        }
        [descriptionView, playlistView, voiceChatView, userlistView].forEach {
            $0.snp.makeConstraints { make in
                make.size.equalTo(scrollView.snp.size)
            }
        }
    }
        
    
    private func configureUI() {
        backgroundColor = .white
        
        scrollView.delegate = self
        scrollView.contentSize = CGSize(width: frame.width * 4, height: frame.height)
    }
}

extension KickRoomMainScrollView: UIScrollViewDelegate {
    func scrollViewDidEndDecelerating(_ scrollView: UIScrollView) {
        let pageIndex = Int(scrollView.contentOffset.x / ComponentSize.screenWidth)
        
        didUpdatePageIndex?(pageIndex)
    }
}
