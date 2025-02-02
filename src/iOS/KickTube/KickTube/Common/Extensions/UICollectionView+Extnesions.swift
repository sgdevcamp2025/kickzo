//
//  UICollectionView+Extnesions.swift
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
}
