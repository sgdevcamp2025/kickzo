// The Swift Programming Language
// https://docs.swift.org/swift-book

import Foundation
/// A macro that produces both a value and a string containing the
/// source code that generated the value. For example,
///
///     #stringify(x + y)
///
/// produces a tuple `(x + y, "x + y")`.
@freestanding(expression)
public macro stringify<T>(_ value: T) -> (T, String) = #externalMacro(module: "ManipulateDataModelMacros", type: "StringifyMacro")


// MARK: - DecodeDTO with Auto Create CodingKeys

@attached(extension, conformances: Decodable)
@attached(member, names: named(CodingKeys))
public macro DecodeDTO() = #externalMacro(module: "ManipulateDataModelMacros", type: "DTOMacro")


// MARK: - EncodeDTO with Auto Create CodingKeys

@attached(extension, conformances: Encodable)
@attached(member, names: named(CodingKeys))
public macro EncodeDTO() = #externalMacro(module: "ManipulateDataModelMacros", type: "DTOMacro")


// MARK: - Create CodingKeys

@attached(peer)
public macro Key(_: String? = nil) = #externalMacro(module: "ManipulateDataModelMacros", type: "KeyMacro")


// MARK: - Convert DTO to DomainModel

@attached(member, names: named(toModel))
public macro ConvertToDomainModel<U: DTOMappable>() = #externalMacro(module: "ManipulateDataModelMacros", type: "DataModelMappingMacro")


// MARK: - Convert DomainModel to DTO
@attached(member, names: named(toModel))
public macro ConvertToDTOModel<U: DomainMappable>() = #externalMacro(module: "ManipulateDataModelMacros", type: "DataModelMappingMacro")


public protocol DTOMappable {}
public protocol DomainMappable {}
