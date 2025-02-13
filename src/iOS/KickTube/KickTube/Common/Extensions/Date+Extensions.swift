//
//  Date+Extensions.swift
//  KickTube
//
//  Created by 김수경 on 2/4/25.
//

import Foundation

extension Date {
    enum StringDateFormat: String {
        case dateKR = "yy년 MM월 dd일"
        case timeKR = "HH시 mm분"
        case messageTime = "a hh:mm"
        case messageDate = "yy.MM.dd"
    }

    func toString(_ format: StringDateFormat) -> String {
        let dateFormatter = DateFormatter()
        
        dateFormatter.dateFormat = format.rawValue
        
        return dateFormatter.string(from: self)
    }
    
    func toMessageDate() -> String {
        let calendar = Calendar.current
        let today = calendar.startOfDay(for: Date())
        let comparisonDate = calendar.startOfDay(for: self)
        
        let formatterForToday = DateFormatter()
        var formattedDate: String
        
        formatterForToday.dateFormat = comparisonDate == today ? StringDateFormat.messageTime.rawValue : StringDateFormat.messageDate.rawValue
        formattedDate = formatterForToday.string(from: self)
        
        return formattedDate
    }
}
