//
//  UIImage+Extensions.swift
//  KickTube
//
//  Created by 김수경 on 1/20/25.
//

import UIKit

extension UIImage {
    convenience init?(color: UIColor, size: CGSize = CGSize(width: 1, height: 1)) {
        let rect = CGRect(origin: .zero, size: size)
        
        UIGraphicsBeginImageContextWithOptions(rect.size, false, 0.0)
        color.setFill()
        UIRectFill(rect)
        let image = UIGraphicsGetImageFromCurrentImageContext()
        UIGraphicsEndImageContext()
        
        guard let cgImage = image?.cgImage else { return nil }
        self.init(cgImage: cgImage)
    }
    
    func resize(to size: CGSize) -> UIImage? {
        UIGraphicsBeginImageContextWithOptions(size, false, self.scale)
        self.draw(in: CGRect(origin: .zero, size: size))
        let resizedImage = UIGraphicsGetImageFromCurrentImageContext()
        UIGraphicsEndImageContext()
        return resizedImage
    }
    
    func toData() -> Data? {
        return self.pngData()
    }
    
    func applyCornerRadiusToImage(radius: CGFloat) -> UIImage? {
        let size = self.size
        let renderer = UIGraphicsImageRenderer(size: size)
        
        return renderer.image { context in
            let rect = CGRect(origin: .zero, size: size)
            
            context.cgContext.addPath(UIBezierPath(roundedRect: rect, cornerRadius: radius).cgPath)
            context.cgContext.clip()
            
            self.draw(in: rect)
        }
    }
}
