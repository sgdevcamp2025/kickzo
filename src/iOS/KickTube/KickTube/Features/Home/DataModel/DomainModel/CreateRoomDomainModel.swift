//
//  CreateRoomDomainModel.swift
//  KickTube
//
//  Created by 김수경 on 2/17/25.
//

import Foundation

struct CreateRoomDomainModel: DTOMappable {
    let code: String
    
    func toModel() -> CreateRoomViewModel {
        .init(code: self.code)
    }
}
