//
//  UICollectionView+Extensions.swift
//  KickTube
//
//  Created by 김수경 on 1/22/25.
//

import UIKit

extension UICollectionViewLayout {
    static func homeCollectionViewSection() -> NSCollectionLayoutSection {
        let size = NSCollectionLayoutSize(widthDimension: .fractionalWidth(1.0), heightDimension: .fractionalHeight(1.0))
        let item = NSCollectionLayoutItem(layoutSize: size)
        item.contentInsets = NSDirectionalEdgeInsets(top: 10, leading: 0, bottom: 10, trailing: 0)
        
        let groupSize = NSCollectionLayoutSize(widthDimension: .absolute(ComponentSize.homeCollectionViewCell.size.width), heightDimension: .absolute(ComponentSize.homeCollectionViewCell.size.height))
        let group = NSCollectionLayoutGroup.vertical(layoutSize: groupSize, subitems: [item])
        
        let section = NSCollectionLayoutSection(group: group)
        
        return section
    }
    
    static func homeCollectionViewLayout() -> UICollectionViewLayout {
        UICollectionViewCompositionalLayout(section: homeCollectionViewSection())
    }
    
    static func myRoomCollectionViewSection(_ isHeader: Bool = true) -> NSCollectionLayoutSection {
        let size = NSCollectionLayoutSize(widthDimension: .fractionalWidth(1.0), heightDimension: .fractionalHeight(1.0))
        let item = NSCollectionLayoutItem(layoutSize: size)
        item.contentInsets = NSDirectionalEdgeInsets(top: 4, leading: 0, bottom: 4, trailing: 0)
        
        let groupSize = NSCollectionLayoutSize(widthDimension: .absolute(ComponentSize.roomCollectionViewCell.size.width), heightDimension: .absolute(ComponentSize.roomCollectionViewCell.size.height))
        let group = NSCollectionLayoutGroup.vertical(layoutSize: groupSize, subitems: [item])
        
        let section = NSCollectionLayoutSection(group: group)
        
        if isHeader {
            let headerSize = NSCollectionLayoutSize(widthDimension: .fractionalWidth(1.0), heightDimension: .absolute(60))
            let header = NSCollectionLayoutBoundarySupplementaryItem(layoutSize: headerSize, elementKind: UICollectionView.elementKindSectionHeader, alignment: .top)
            section.boundarySupplementaryItems = [header]
        }
        
        return section
    }
    
    static func myRoomCollectionViewLayout(_ isHeader: Bool = true) -> UICollectionViewLayout {
        UICollectionViewCompositionalLayout(section: myRoomCollectionViewSection(isHeader))
    }
}
