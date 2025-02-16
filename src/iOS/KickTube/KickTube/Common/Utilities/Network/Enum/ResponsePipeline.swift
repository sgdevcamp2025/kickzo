//
//  ResponsePipeline.swift
//  KickTube
//
//  Created by 김수경 on 2/14/25.
//

import Foundation

enum ResponsePipeline {
    case terminator(ResponsePipelineTerminator)
    case redirector(ResponsePipelineRedirector)
}
