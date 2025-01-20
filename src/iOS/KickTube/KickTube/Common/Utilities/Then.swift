//
//  Then.swift
//  KickTube
//
//  Created by 김수경 on 1/20/25.
//

import Foundation

protocol Then {}

// Self: 구체적인 타입, self: 현재 인스턴스

extension Then where Self: AnyObject {
    func then(_ handler: (Self) -> Void) -> Self {
        handler(self)
        
        return self
    }
}

extension NSObject: Then {}
