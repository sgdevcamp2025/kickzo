//
//  ManipulateDataModelPlugin.swift
//  ManipulateDataModel
//
//  Created by 김수경 on 1/16/25.
//

import SwiftCompilerPlugin
import SwiftSyntax
import SwiftSyntaxBuilder
import SwiftSyntaxMacros

@main
struct ManipulateDataModelPlugin: CompilerPlugin {
    let providingMacros: [Macro.Type] = [
        StringifyMacro.self,
        DTOMacro.self,
        KeyMacro.self,
        DataModelMappingMacro.self
    ]
}
