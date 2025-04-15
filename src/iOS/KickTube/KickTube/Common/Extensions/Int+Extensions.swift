//
//  Int+Extensions.swift
//  KickTube
//
//  Created by 김수경 on 2/11/25.
//

import Foundation

extension Int {
    var toDate: Date {
        return Date(timeIntervalSince1970: TimeInterval(self) / 1000)
    }
}
