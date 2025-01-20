//
//  DTOMacro.swift
//  ManipulateDataModel
//
//  Created by 김수경 on 1/16/25.
//

import SwiftCompilerPlugin
import SwiftSyntax
import SwiftSyntaxBuilder
import SwiftSyntaxMacros

public struct DTOMacro {}

extension DTOMacro: ExtensionMacro {
    public static func expansion(
        of node: SwiftSyntax.AttributeSyntax,
        attachedTo declaration: some SwiftSyntax.DeclGroupSyntax,
        providingExtensionsOf type: some SwiftSyntax.TypeSyntaxProtocol,
        conformingTo protocols: [SwiftSyntax.TypeSyntax],
        in context: some SwiftSyntaxMacros.MacroExpansionContext
    ) throws -> [SwiftSyntax.ExtensionDeclSyntax] {
        guard let macroName = node.attributeName.as(IdentifierTypeSyntax.self) else {
            return []
        }
        
        if macroName.name.text == "DecodeDTO" {
            return try [.init("extension \(raw: type.trimmedDescription): Decodable {}")]
        } else if macroName.name.text == "EncodeDTO" {
            return try [.init("extension \(raw: type.trimmedDescription): Encodable {}")]
        }
        
        return []
    }
}


extension DTOMacro: MemberMacro {
    public static func expansion(
        of node: AttributeSyntax,
        providingMembersOf declaration: some DeclGroupSyntax,
        in context: some MacroExpansionContext
    ) throws -> [DeclSyntax] {
        guard let structDecl = declaration as? StructDeclSyntax else {
            return []
        }
        
        let properties = structDecl.memberBlock.members.compactMap { member -> (name: String, key: String)? in
            guard let variable = member.decl.as(VariableDeclSyntax.self),
                  let pattern = variable.bindings.first?.pattern.as(IdentifierPatternSyntax.self)
            else {
                return nil
            }
            
            let name = pattern.identifier.text
            let key = variable.attributes.compactMap { attr -> String? in
                guard let attr = attr.as(AttributeSyntax.self),
                      attr.attributeName.description == "Key",
                      let arguemnts = attr.arguments?.as(LabeledExprListSyntax.self),
                      let stringLiteral = arguemnts.first?.expression.as(StringLiteralExprSyntax.self)
                else {
                    return nil
                }
                
                return stringLiteral.segments.description
            }.first ?? name
            
            return (name: name, key: key)
        }
        
        let codingKeySyntax = try EnumDeclSyntax("enum CodingKeys: String, CodingKey") {
            for property in properties {
                if property.name == property.key {
                    try EnumCaseDeclSyntax("case \(raw: property.name)")
                } else {
                    try EnumCaseDeclSyntax("case \(raw: property.name) = \(literal: property.key)")
                }
            }
        }
        
        return [DeclSyntax(codingKeySyntax)]
    }
}
