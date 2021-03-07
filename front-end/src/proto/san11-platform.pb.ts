/* tslint:disable */
/* eslint-disable */
//
// THIS IS A GENERATED FILE
// DO NOT MODIFY IT! YOUR CHANGES WILL BE LOST
import {
  GrpcMessage,
  RecursivePartial,
  ToProtobufJSONOptions,
  uint8ArrayToBase64
} from '@ngx-grpc/common';
import { BinaryReader, BinaryWriter, ByteSource } from 'google-protobuf';

/**
 * Message implementation for routeguide.CreatePackageRequest
 */
export class CreatePackageRequest implements GrpcMessage {
  static id = 'routeguide.CreatePackageRequest';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new CreatePackageRequest();
    CreatePackageRequest.deserializeBinaryFromReader(
      instance,
      new BinaryReader(bytes)
    );
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: CreatePackageRequest) {
    _instance.package = _instance.package || undefined;
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: CreatePackageRequest,
    _reader: BinaryReader
  ) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          _instance.package = new Package();
          _reader.readMessage(
            _instance.package,
            Package.deserializeBinaryFromReader
          );
          break;
        default:
          _reader.skipField();
      }
    }

    CreatePackageRequest.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(
    _instance: CreatePackageRequest,
    _writer: BinaryWriter
  ) {
    if (_instance.package) {
      _writer.writeMessage(
        1,
        _instance.package as any,
        Package.serializeBinaryToWriter
      );
    }
  }

  private _package?: Package;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of CreatePackageRequest to deeply clone from
   */
  constructor(_value?: RecursivePartial<CreatePackageRequest.AsObject>) {
    _value = _value || {};
    this.package = _value.package ? new Package(_value.package) : undefined;
    CreatePackageRequest.refineValues(this);
  }
  get package(): Package | undefined {
    return this._package;
  }
  set package(value: Package | undefined) {
    this._package = value;
  }

  /**
   * Serialize message to binary data
   * @param instance message instance
   */
  serializeBinary() {
    const writer = new BinaryWriter();
    CreatePackageRequest.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): CreatePackageRequest.AsObject {
    return {
      package: this.package ? this.package.toObject() : undefined
    };
  }

  /**
   * Convenience method to support JSON.stringify(message), replicates the structure of toObject()
   */
  toJSON() {
    return this.toObject();
  }

  /**
   * Cast message to JSON using protobuf JSON notation: https://developers.google.com/protocol-buffers/docs/proto3#json
   * Attention: output differs from toObject() e.g. enums are represented as names and not as numbers, Timestamp is an ISO Date string format etc.
   * If the message itself or some of descendant messages is google.protobuf.Any, you MUST provide a message pool as options. If not, the messagePool is not required
   */
  toProtobufJSON(
    // @ts-ignore
    options?: ToProtobufJSONOptions
  ): CreatePackageRequest.AsProtobufJSON {
    return {
      package: this.package ? this.package.toProtobufJSON(options) : null
    };
  }
}
export module CreatePackageRequest {
  /**
   * Standard JavaScript object representation for CreatePackageRequest
   */
  export interface AsObject {
    package?: Package.AsObject;
  }

  /**
   * Protobuf JSON representation for CreatePackageRequest
   */
  export interface AsProtobufJSON {
    package?: Package.AsProtobufJSON | null;
  }
}

/**
 * Message implementation for routeguide.UpdatePackageRequest
 */
export class UpdatePackageRequest implements GrpcMessage {
  static id = 'routeguide.UpdatePackageRequest';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new UpdatePackageRequest();
    UpdatePackageRequest.deserializeBinaryFromReader(
      instance,
      new BinaryReader(bytes)
    );
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: UpdatePackageRequest) {
    _instance.package = _instance.package || undefined;
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: UpdatePackageRequest,
    _reader: BinaryReader
  ) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          _instance.package = new Package();
          _reader.readMessage(
            _instance.package,
            Package.deserializeBinaryFromReader
          );
          break;
        default:
          _reader.skipField();
      }
    }

    UpdatePackageRequest.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(
    _instance: UpdatePackageRequest,
    _writer: BinaryWriter
  ) {
    if (_instance.package) {
      _writer.writeMessage(
        1,
        _instance.package as any,
        Package.serializeBinaryToWriter
      );
    }
  }

  private _package?: Package;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of UpdatePackageRequest to deeply clone from
   */
  constructor(_value?: RecursivePartial<UpdatePackageRequest.AsObject>) {
    _value = _value || {};
    this.package = _value.package ? new Package(_value.package) : undefined;
    UpdatePackageRequest.refineValues(this);
  }
  get package(): Package | undefined {
    return this._package;
  }
  set package(value: Package | undefined) {
    this._package = value;
  }

  /**
   * Serialize message to binary data
   * @param instance message instance
   */
  serializeBinary() {
    const writer = new BinaryWriter();
    UpdatePackageRequest.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): UpdatePackageRequest.AsObject {
    return {
      package: this.package ? this.package.toObject() : undefined
    };
  }

  /**
   * Convenience method to support JSON.stringify(message), replicates the structure of toObject()
   */
  toJSON() {
    return this.toObject();
  }

  /**
   * Cast message to JSON using protobuf JSON notation: https://developers.google.com/protocol-buffers/docs/proto3#json
   * Attention: output differs from toObject() e.g. enums are represented as names and not as numbers, Timestamp is an ISO Date string format etc.
   * If the message itself or some of descendant messages is google.protobuf.Any, you MUST provide a message pool as options. If not, the messagePool is not required
   */
  toProtobufJSON(
    // @ts-ignore
    options?: ToProtobufJSONOptions
  ): UpdatePackageRequest.AsProtobufJSON {
    return {
      package: this.package ? this.package.toProtobufJSON(options) : null
    };
  }
}
export module UpdatePackageRequest {
  /**
   * Standard JavaScript object representation for UpdatePackageRequest
   */
  export interface AsObject {
    package?: Package.AsObject;
  }

  /**
   * Protobuf JSON representation for UpdatePackageRequest
   */
  export interface AsProtobufJSON {
    package?: Package.AsProtobufJSON | null;
  }
}

/**
 * Message implementation for routeguide.DeletePackageRequest
 */
export class DeletePackageRequest implements GrpcMessage {
  static id = 'routeguide.DeletePackageRequest';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new DeletePackageRequest();
    DeletePackageRequest.deserializeBinaryFromReader(
      instance,
      new BinaryReader(bytes)
    );
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: DeletePackageRequest) {
    _instance.package = _instance.package || undefined;
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: DeletePackageRequest,
    _reader: BinaryReader
  ) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          _instance.package = new Package();
          _reader.readMessage(
            _instance.package,
            Package.deserializeBinaryFromReader
          );
          break;
        default:
          _reader.skipField();
      }
    }

    DeletePackageRequest.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(
    _instance: DeletePackageRequest,
    _writer: BinaryWriter
  ) {
    if (_instance.package) {
      _writer.writeMessage(
        1,
        _instance.package as any,
        Package.serializeBinaryToWriter
      );
    }
  }

  private _package?: Package;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of DeletePackageRequest to deeply clone from
   */
  constructor(_value?: RecursivePartial<DeletePackageRequest.AsObject>) {
    _value = _value || {};
    this.package = _value.package ? new Package(_value.package) : undefined;
    DeletePackageRequest.refineValues(this);
  }
  get package(): Package | undefined {
    return this._package;
  }
  set package(value: Package | undefined) {
    this._package = value;
  }

  /**
   * Serialize message to binary data
   * @param instance message instance
   */
  serializeBinary() {
    const writer = new BinaryWriter();
    DeletePackageRequest.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): DeletePackageRequest.AsObject {
    return {
      package: this.package ? this.package.toObject() : undefined
    };
  }

  /**
   * Convenience method to support JSON.stringify(message), replicates the structure of toObject()
   */
  toJSON() {
    return this.toObject();
  }

  /**
   * Cast message to JSON using protobuf JSON notation: https://developers.google.com/protocol-buffers/docs/proto3#json
   * Attention: output differs from toObject() e.g. enums are represented as names and not as numbers, Timestamp is an ISO Date string format etc.
   * If the message itself or some of descendant messages is google.protobuf.Any, you MUST provide a message pool as options. If not, the messagePool is not required
   */
  toProtobufJSON(
    // @ts-ignore
    options?: ToProtobufJSONOptions
  ): DeletePackageRequest.AsProtobufJSON {
    return {
      package: this.package ? this.package.toProtobufJSON(options) : null
    };
  }
}
export module DeletePackageRequest {
  /**
   * Standard JavaScript object representation for DeletePackageRequest
   */
  export interface AsObject {
    package?: Package.AsObject;
  }

  /**
   * Protobuf JSON representation for DeletePackageRequest
   */
  export interface AsProtobufJSON {
    package?: Package.AsProtobufJSON | null;
  }
}

/**
 * Message implementation for routeguide.GetPackageRequest
 */
export class GetPackageRequest implements GrpcMessage {
  static id = 'routeguide.GetPackageRequest';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new GetPackageRequest();
    GetPackageRequest.deserializeBinaryFromReader(
      instance,
      new BinaryReader(bytes)
    );
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: GetPackageRequest) {
    _instance.packageId = _instance.packageId || '0';
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: GetPackageRequest,
    _reader: BinaryReader
  ) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          _instance.packageId = _reader.readInt64String();
          break;
        default:
          _reader.skipField();
      }
    }

    GetPackageRequest.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(
    _instance: GetPackageRequest,
    _writer: BinaryWriter
  ) {
    if (_instance.packageId) {
      _writer.writeInt64String(1, _instance.packageId);
    }
  }

  private _packageId?: string;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of GetPackageRequest to deeply clone from
   */
  constructor(_value?: RecursivePartial<GetPackageRequest.AsObject>) {
    _value = _value || {};
    this.packageId = _value.packageId;
    GetPackageRequest.refineValues(this);
  }
  get packageId(): string | undefined {
    return this._packageId;
  }
  set packageId(value: string | undefined) {
    this._packageId = value;
  }

  /**
   * Serialize message to binary data
   * @param instance message instance
   */
  serializeBinary() {
    const writer = new BinaryWriter();
    GetPackageRequest.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): GetPackageRequest.AsObject {
    return {
      packageId: this.packageId
    };
  }

  /**
   * Convenience method to support JSON.stringify(message), replicates the structure of toObject()
   */
  toJSON() {
    return this.toObject();
  }

  /**
   * Cast message to JSON using protobuf JSON notation: https://developers.google.com/protocol-buffers/docs/proto3#json
   * Attention: output differs from toObject() e.g. enums are represented as names and not as numbers, Timestamp is an ISO Date string format etc.
   * If the message itself or some of descendant messages is google.protobuf.Any, you MUST provide a message pool as options. If not, the messagePool is not required
   */
  toProtobufJSON(
    // @ts-ignore
    options?: ToProtobufJSONOptions
  ): GetPackageRequest.AsProtobufJSON {
    return {
      packageId: this.packageId
    };
  }
}
export module GetPackageRequest {
  /**
   * Standard JavaScript object representation for GetPackageRequest
   */
  export interface AsObject {
    packageId?: string;
  }

  /**
   * Protobuf JSON representation for GetPackageRequest
   */
  export interface AsProtobufJSON {
    packageId?: string;
  }
}

/**
 * Message implementation for routeguide.ListPackagesRequest
 */
export class ListPackagesRequest implements GrpcMessage {
  static id = 'routeguide.ListPackagesRequest';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new ListPackagesRequest();
    ListPackagesRequest.deserializeBinaryFromReader(
      instance,
      new BinaryReader(bytes)
    );
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: ListPackagesRequest) {
    _instance.primaryCategory = _instance.primaryCategory || '';
    _instance.secondaryCategory = _instance.secondaryCategory || '';
    _instance.pageSize = _instance.pageSize || '0';
    _instance.pageToken = _instance.pageToken || '';
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: ListPackagesRequest,
    _reader: BinaryReader
  ) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          _instance.primaryCategory = _reader.readString();
          break;
        case 2:
          _instance.secondaryCategory = _reader.readString();
          break;
        case 3:
          _instance.pageSize = _reader.readInt64String();
          break;
        case 4:
          _instance.pageToken = _reader.readString();
          break;
        default:
          _reader.skipField();
      }
    }

    ListPackagesRequest.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(
    _instance: ListPackagesRequest,
    _writer: BinaryWriter
  ) {
    if (_instance.primaryCategory) {
      _writer.writeString(1, _instance.primaryCategory);
    }
    if (_instance.secondaryCategory) {
      _writer.writeString(2, _instance.secondaryCategory);
    }
    if (_instance.pageSize) {
      _writer.writeInt64String(3, _instance.pageSize);
    }
    if (_instance.pageToken) {
      _writer.writeString(4, _instance.pageToken);
    }
  }

  private _primaryCategory?: string;
  private _secondaryCategory?: string;
  private _pageSize?: string;
  private _pageToken?: string;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of ListPackagesRequest to deeply clone from
   */
  constructor(_value?: RecursivePartial<ListPackagesRequest.AsObject>) {
    _value = _value || {};
    this.primaryCategory = _value.primaryCategory;
    this.secondaryCategory = _value.secondaryCategory;
    this.pageSize = _value.pageSize;
    this.pageToken = _value.pageToken;
    ListPackagesRequest.refineValues(this);
  }
  get primaryCategory(): string | undefined {
    return this._primaryCategory;
  }
  set primaryCategory(value: string | undefined) {
    this._primaryCategory = value;
  }
  get secondaryCategory(): string | undefined {
    return this._secondaryCategory;
  }
  set secondaryCategory(value: string | undefined) {
    this._secondaryCategory = value;
  }
  get pageSize(): string | undefined {
    return this._pageSize;
  }
  set pageSize(value: string | undefined) {
    this._pageSize = value;
  }
  get pageToken(): string | undefined {
    return this._pageToken;
  }
  set pageToken(value: string | undefined) {
    this._pageToken = value;
  }

  /**
   * Serialize message to binary data
   * @param instance message instance
   */
  serializeBinary() {
    const writer = new BinaryWriter();
    ListPackagesRequest.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): ListPackagesRequest.AsObject {
    return {
      primaryCategory: this.primaryCategory,
      secondaryCategory: this.secondaryCategory,
      pageSize: this.pageSize,
      pageToken: this.pageToken
    };
  }

  /**
   * Convenience method to support JSON.stringify(message), replicates the structure of toObject()
   */
  toJSON() {
    return this.toObject();
  }

  /**
   * Cast message to JSON using protobuf JSON notation: https://developers.google.com/protocol-buffers/docs/proto3#json
   * Attention: output differs from toObject() e.g. enums are represented as names and not as numbers, Timestamp is an ISO Date string format etc.
   * If the message itself or some of descendant messages is google.protobuf.Any, you MUST provide a message pool as options. If not, the messagePool is not required
   */
  toProtobufJSON(
    // @ts-ignore
    options?: ToProtobufJSONOptions
  ): ListPackagesRequest.AsProtobufJSON {
    return {
      primaryCategory: this.primaryCategory,
      secondaryCategory: this.secondaryCategory,
      pageSize: this.pageSize,
      pageToken: this.pageToken
    };
  }
}
export module ListPackagesRequest {
  /**
   * Standard JavaScript object representation for ListPackagesRequest
   */
  export interface AsObject {
    primaryCategory?: string;
    secondaryCategory?: string;
    pageSize?: string;
    pageToken?: string;
  }

  /**
   * Protobuf JSON representation for ListPackagesRequest
   */
  export interface AsProtobufJSON {
    primaryCategory?: string;
    secondaryCategory?: string;
    pageSize?: string;
    pageToken?: string;
  }
}

/**
 * Message implementation for routeguide.ListPackagesResponse
 */
export class ListPackagesResponse implements GrpcMessage {
  static id = 'routeguide.ListPackagesResponse';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new ListPackagesResponse();
    ListPackagesResponse.deserializeBinaryFromReader(
      instance,
      new BinaryReader(bytes)
    );
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: ListPackagesResponse) {
    _instance.packages = _instance.packages || [];
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: ListPackagesResponse,
    _reader: BinaryReader
  ) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          const messageInitializer1 = new Package();
          _reader.readMessage(
            messageInitializer1,
            Package.deserializeBinaryFromReader
          );
          (_instance.packages = _instance.packages || []).push(
            messageInitializer1
          );
          break;
        default:
          _reader.skipField();
      }
    }

    ListPackagesResponse.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(
    _instance: ListPackagesResponse,
    _writer: BinaryWriter
  ) {
    if (_instance.packages && _instance.packages.length) {
      _writer.writeRepeatedMessage(
        1,
        _instance.packages as any,
        Package.serializeBinaryToWriter
      );
    }
  }

  private _packages?: Package[];

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of ListPackagesResponse to deeply clone from
   */
  constructor(_value?: RecursivePartial<ListPackagesResponse.AsObject>) {
    _value = _value || {};
    this.packages = (_value.packages || []).map(m => new Package(m));
    ListPackagesResponse.refineValues(this);
  }
  get packages(): Package[] | undefined {
    return this._packages;
  }
  set packages(value: Package[] | undefined) {
    this._packages = value;
  }

  /**
   * Serialize message to binary data
   * @param instance message instance
   */
  serializeBinary() {
    const writer = new BinaryWriter();
    ListPackagesResponse.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): ListPackagesResponse.AsObject {
    return {
      packages: (this.packages || []).map(m => m.toObject())
    };
  }

  /**
   * Convenience method to support JSON.stringify(message), replicates the structure of toObject()
   */
  toJSON() {
    return this.toObject();
  }

  /**
   * Cast message to JSON using protobuf JSON notation: https://developers.google.com/protocol-buffers/docs/proto3#json
   * Attention: output differs from toObject() e.g. enums are represented as names and not as numbers, Timestamp is an ISO Date string format etc.
   * If the message itself or some of descendant messages is google.protobuf.Any, you MUST provide a message pool as options. If not, the messagePool is not required
   */
  toProtobufJSON(
    // @ts-ignore
    options?: ToProtobufJSONOptions
  ): ListPackagesResponse.AsProtobufJSON {
    return {
      packages: (this.packages || []).map(m => m.toProtobufJSON(options))
    };
  }
}
export module ListPackagesResponse {
  /**
   * Standard JavaScript object representation for ListPackagesResponse
   */
  export interface AsObject {
    packages?: Package.AsObject[];
  }

  /**
   * Protobuf JSON representation for ListPackagesResponse
   */
  export interface AsProtobufJSON {
    packages?: Package.AsProtobufJSON[] | null;
  }
}

/**
 * Message implementation for routeguide.UploadBinaryRequest
 */
export class UploadBinaryRequest implements GrpcMessage {
  static id = 'routeguide.UploadBinaryRequest';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new UploadBinaryRequest();
    UploadBinaryRequest.deserializeBinaryFromReader(
      instance,
      new BinaryReader(bytes)
    );
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: UploadBinaryRequest) {
    _instance.parent = _instance.parent || '';
    _instance.binary = _instance.binary || undefined;
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: UploadBinaryRequest,
    _reader: BinaryReader
  ) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          _instance.parent = _reader.readString();
          break;
        case 2:
          _instance.binary = new Binary();
          _reader.readMessage(
            _instance.binary,
            Binary.deserializeBinaryFromReader
          );
          break;
        default:
          _reader.skipField();
      }
    }

    UploadBinaryRequest.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(
    _instance: UploadBinaryRequest,
    _writer: BinaryWriter
  ) {
    if (_instance.parent) {
      _writer.writeString(1, _instance.parent);
    }
    if (_instance.binary) {
      _writer.writeMessage(
        2,
        _instance.binary as any,
        Binary.serializeBinaryToWriter
      );
    }
  }

  private _parent?: string;
  private _binary?: Binary;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of UploadBinaryRequest to deeply clone from
   */
  constructor(_value?: RecursivePartial<UploadBinaryRequest.AsObject>) {
    _value = _value || {};
    this.parent = _value.parent;
    this.binary = _value.binary ? new Binary(_value.binary) : undefined;
    UploadBinaryRequest.refineValues(this);
  }
  get parent(): string | undefined {
    return this._parent;
  }
  set parent(value: string | undefined) {
    this._parent = value;
  }
  get binary(): Binary | undefined {
    return this._binary;
  }
  set binary(value: Binary | undefined) {
    this._binary = value;
  }

  /**
   * Serialize message to binary data
   * @param instance message instance
   */
  serializeBinary() {
    const writer = new BinaryWriter();
    UploadBinaryRequest.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): UploadBinaryRequest.AsObject {
    return {
      parent: this.parent,
      binary: this.binary ? this.binary.toObject() : undefined
    };
  }

  /**
   * Convenience method to support JSON.stringify(message), replicates the structure of toObject()
   */
  toJSON() {
    return this.toObject();
  }

  /**
   * Cast message to JSON using protobuf JSON notation: https://developers.google.com/protocol-buffers/docs/proto3#json
   * Attention: output differs from toObject() e.g. enums are represented as names and not as numbers, Timestamp is an ISO Date string format etc.
   * If the message itself or some of descendant messages is google.protobuf.Any, you MUST provide a message pool as options. If not, the messagePool is not required
   */
  toProtobufJSON(
    // @ts-ignore
    options?: ToProtobufJSONOptions
  ): UploadBinaryRequest.AsProtobufJSON {
    return {
      parent: this.parent,
      binary: this.binary ? this.binary.toProtobufJSON(options) : null
    };
  }
}
export module UploadBinaryRequest {
  /**
   * Standard JavaScript object representation for UploadBinaryRequest
   */
  export interface AsObject {
    parent?: string;
    binary?: Binary.AsObject;
  }

  /**
   * Protobuf JSON representation for UploadBinaryRequest
   */
  export interface AsProtobufJSON {
    parent?: string;
    binary?: Binary.AsProtobufJSON | null;
  }
}

/**
 * Message implementation for routeguide.GetBinaryRequest
 */
export class GetBinaryRequest implements GrpcMessage {
  static id = 'routeguide.GetBinaryRequest';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new GetBinaryRequest();
    GetBinaryRequest.deserializeBinaryFromReader(
      instance,
      new BinaryReader(bytes)
    );
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: GetBinaryRequest) {
    _instance.binaryId = _instance.binaryId || '0';
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: GetBinaryRequest,
    _reader: BinaryReader
  ) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          _instance.binaryId = _reader.readInt64String();
          break;
        default:
          _reader.skipField();
      }
    }

    GetBinaryRequest.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(
    _instance: GetBinaryRequest,
    _writer: BinaryWriter
  ) {
    if (_instance.binaryId) {
      _writer.writeInt64String(1, _instance.binaryId);
    }
  }

  private _binaryId?: string;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of GetBinaryRequest to deeply clone from
   */
  constructor(_value?: RecursivePartial<GetBinaryRequest.AsObject>) {
    _value = _value || {};
    this.binaryId = _value.binaryId;
    GetBinaryRequest.refineValues(this);
  }
  get binaryId(): string | undefined {
    return this._binaryId;
  }
  set binaryId(value: string | undefined) {
    this._binaryId = value;
  }

  /**
   * Serialize message to binary data
   * @param instance message instance
   */
  serializeBinary() {
    const writer = new BinaryWriter();
    GetBinaryRequest.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): GetBinaryRequest.AsObject {
    return {
      binaryId: this.binaryId
    };
  }

  /**
   * Convenience method to support JSON.stringify(message), replicates the structure of toObject()
   */
  toJSON() {
    return this.toObject();
  }

  /**
   * Cast message to JSON using protobuf JSON notation: https://developers.google.com/protocol-buffers/docs/proto3#json
   * Attention: output differs from toObject() e.g. enums are represented as names and not as numbers, Timestamp is an ISO Date string format etc.
   * If the message itself or some of descendant messages is google.protobuf.Any, you MUST provide a message pool as options. If not, the messagePool is not required
   */
  toProtobufJSON(
    // @ts-ignore
    options?: ToProtobufJSONOptions
  ): GetBinaryRequest.AsProtobufJSON {
    return {
      binaryId: this.binaryId
    };
  }
}
export module GetBinaryRequest {
  /**
   * Standard JavaScript object representation for GetBinaryRequest
   */
  export interface AsObject {
    binaryId?: string;
  }

  /**
   * Protobuf JSON representation for GetBinaryRequest
   */
  export interface AsProtobufJSON {
    binaryId?: string;
  }
}

/**
 * Message implementation for routeguide.DeleteBinaryRequest
 */
export class DeleteBinaryRequest implements GrpcMessage {
  static id = 'routeguide.DeleteBinaryRequest';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new DeleteBinaryRequest();
    DeleteBinaryRequest.deserializeBinaryFromReader(
      instance,
      new BinaryReader(bytes)
    );
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: DeleteBinaryRequest) {
    _instance.binaryId = _instance.binaryId || '0';
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: DeleteBinaryRequest,
    _reader: BinaryReader
  ) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          _instance.binaryId = _reader.readInt64String();
          break;
        default:
          _reader.skipField();
      }
    }

    DeleteBinaryRequest.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(
    _instance: DeleteBinaryRequest,
    _writer: BinaryWriter
  ) {
    if (_instance.binaryId) {
      _writer.writeInt64String(1, _instance.binaryId);
    }
  }

  private _binaryId?: string;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of DeleteBinaryRequest to deeply clone from
   */
  constructor(_value?: RecursivePartial<DeleteBinaryRequest.AsObject>) {
    _value = _value || {};
    this.binaryId = _value.binaryId;
    DeleteBinaryRequest.refineValues(this);
  }
  get binaryId(): string | undefined {
    return this._binaryId;
  }
  set binaryId(value: string | undefined) {
    this._binaryId = value;
  }

  /**
   * Serialize message to binary data
   * @param instance message instance
   */
  serializeBinary() {
    const writer = new BinaryWriter();
    DeleteBinaryRequest.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): DeleteBinaryRequest.AsObject {
    return {
      binaryId: this.binaryId
    };
  }

  /**
   * Convenience method to support JSON.stringify(message), replicates the structure of toObject()
   */
  toJSON() {
    return this.toObject();
  }

  /**
   * Cast message to JSON using protobuf JSON notation: https://developers.google.com/protocol-buffers/docs/proto3#json
   * Attention: output differs from toObject() e.g. enums are represented as names and not as numbers, Timestamp is an ISO Date string format etc.
   * If the message itself or some of descendant messages is google.protobuf.Any, you MUST provide a message pool as options. If not, the messagePool is not required
   */
  toProtobufJSON(
    // @ts-ignore
    options?: ToProtobufJSONOptions
  ): DeleteBinaryRequest.AsProtobufJSON {
    return {
      binaryId: this.binaryId
    };
  }
}
export module DeleteBinaryRequest {
  /**
   * Standard JavaScript object representation for DeleteBinaryRequest
   */
  export interface AsObject {
    binaryId?: string;
  }

  /**
   * Protobuf JSON representation for DeleteBinaryRequest
   */
  export interface AsProtobufJSON {
    binaryId?: string;
  }
}

/**
 * Message implementation for routeguide.GetimageRequest
 */
export class GetimageRequest implements GrpcMessage {
  static id = 'routeguide.GetimageRequest';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new GetimageRequest();
    GetimageRequest.deserializeBinaryFromReader(
      instance,
      new BinaryReader(bytes)
    );
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: GetimageRequest) {
    _instance.imageId = _instance.imageId || '0';
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: GetimageRequest,
    _reader: BinaryReader
  ) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          _instance.imageId = _reader.readInt64String();
          break;
        default:
          _reader.skipField();
      }
    }

    GetimageRequest.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(
    _instance: GetimageRequest,
    _writer: BinaryWriter
  ) {
    if (_instance.imageId) {
      _writer.writeInt64String(1, _instance.imageId);
    }
  }

  private _imageId?: string;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of GetimageRequest to deeply clone from
   */
  constructor(_value?: RecursivePartial<GetimageRequest.AsObject>) {
    _value = _value || {};
    this.imageId = _value.imageId;
    GetimageRequest.refineValues(this);
  }
  get imageId(): string | undefined {
    return this._imageId;
  }
  set imageId(value: string | undefined) {
    this._imageId = value;
  }

  /**
   * Serialize message to binary data
   * @param instance message instance
   */
  serializeBinary() {
    const writer = new BinaryWriter();
    GetimageRequest.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): GetimageRequest.AsObject {
    return {
      imageId: this.imageId
    };
  }

  /**
   * Convenience method to support JSON.stringify(message), replicates the structure of toObject()
   */
  toJSON() {
    return this.toObject();
  }

  /**
   * Cast message to JSON using protobuf JSON notation: https://developers.google.com/protocol-buffers/docs/proto3#json
   * Attention: output differs from toObject() e.g. enums are represented as names and not as numbers, Timestamp is an ISO Date string format etc.
   * If the message itself or some of descendant messages is google.protobuf.Any, you MUST provide a message pool as options. If not, the messagePool is not required
   */
  toProtobufJSON(
    // @ts-ignore
    options?: ToProtobufJSONOptions
  ): GetimageRequest.AsProtobufJSON {
    return {
      imageId: this.imageId
    };
  }
}
export module GetimageRequest {
  /**
   * Standard JavaScript object representation for GetimageRequest
   */
  export interface AsObject {
    imageId?: string;
  }

  /**
   * Protobuf JSON representation for GetimageRequest
   */
  export interface AsProtobufJSON {
    imageId?: string;
  }
}

/**
 * Message implementation for routeguide.UploadImageRequest
 */
export class UploadImageRequest implements GrpcMessage {
  static id = 'routeguide.UploadImageRequest';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new UploadImageRequest();
    UploadImageRequest.deserializeBinaryFromReader(
      instance,
      new BinaryReader(bytes)
    );
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: UploadImageRequest) {
    _instance.parent = _instance.parent || '';
    _instance.image = _instance.image || new Uint8Array();
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: UploadImageRequest,
    _reader: BinaryReader
  ) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          _instance.parent = _reader.readString();
          break;
        case 2:
          _instance.image = _reader.readBytes();
          break;
        default:
          _reader.skipField();
      }
    }

    UploadImageRequest.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(
    _instance: UploadImageRequest,
    _writer: BinaryWriter
  ) {
    if (_instance.parent) {
      _writer.writeString(1, _instance.parent);
    }
    if (_instance.image && _instance.image.length) {
      _writer.writeBytes(2, _instance.image);
    }
  }

  private _parent?: string;
  private _image?: Uint8Array;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of UploadImageRequest to deeply clone from
   */
  constructor(_value?: RecursivePartial<UploadImageRequest.AsObject>) {
    _value = _value || {};
    this.parent = _value.parent;
    this.image = _value.image;
    UploadImageRequest.refineValues(this);
  }
  get parent(): string | undefined {
    return this._parent;
  }
  set parent(value: string | undefined) {
    this._parent = value;
  }
  get image(): Uint8Array | undefined {
    return this._image;
  }
  set image(value: Uint8Array | undefined) {
    this._image = value;
  }

  /**
   * Serialize message to binary data
   * @param instance message instance
   */
  serializeBinary() {
    const writer = new BinaryWriter();
    UploadImageRequest.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): UploadImageRequest.AsObject {
    return {
      parent: this.parent,
      image: this.image ? this.image.subarray(0) : new Uint8Array()
    };
  }

  /**
   * Convenience method to support JSON.stringify(message), replicates the structure of toObject()
   */
  toJSON() {
    return this.toObject();
  }

  /**
   * Cast message to JSON using protobuf JSON notation: https://developers.google.com/protocol-buffers/docs/proto3#json
   * Attention: output differs from toObject() e.g. enums are represented as names and not as numbers, Timestamp is an ISO Date string format etc.
   * If the message itself or some of descendant messages is google.protobuf.Any, you MUST provide a message pool as options. If not, the messagePool is not required
   */
  toProtobufJSON(
    // @ts-ignore
    options?: ToProtobufJSONOptions
  ): UploadImageRequest.AsProtobufJSON {
    return {
      parent: this.parent,
      image: this.image ? uint8ArrayToBase64(this.image) : ''
    };
  }
}
export module UploadImageRequest {
  /**
   * Standard JavaScript object representation for UploadImageRequest
   */
  export interface AsObject {
    parent?: string;
    image?: Uint8Array;
  }

  /**
   * Protobuf JSON representation for UploadImageRequest
   */
  export interface AsProtobufJSON {
    parent?: string;
    image?: string;
  }
}

/**
 * Message implementation for routeguide.ListImagesRequest
 */
export class ListImagesRequest implements GrpcMessage {
  static id = 'routeguide.ListImagesRequest';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new ListImagesRequest();
    ListImagesRequest.deserializeBinaryFromReader(
      instance,
      new BinaryReader(bytes)
    );
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: ListImagesRequest) {
    _instance.imageIds = _instance.imageIds || [];
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: ListImagesRequest,
    _reader: BinaryReader
  ) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          (_instance.imageIds = _instance.imageIds || []).push(
            ...(_reader.readPackedInt64String() || [])
          );
          break;
        default:
          _reader.skipField();
      }
    }

    ListImagesRequest.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(
    _instance: ListImagesRequest,
    _writer: BinaryWriter
  ) {
    if (_instance.imageIds && _instance.imageIds.length) {
      _writer.writePackedInt64String(1, _instance.imageIds);
    }
  }

  private _imageIds?: string[];

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of ListImagesRequest to deeply clone from
   */
  constructor(_value?: RecursivePartial<ListImagesRequest.AsObject>) {
    _value = _value || {};
    this.imageIds = (_value.imageIds || []).slice();
    ListImagesRequest.refineValues(this);
  }
  get imageIds(): string[] | undefined {
    return this._imageIds;
  }
  set imageIds(value: string[] | undefined) {
    this._imageIds = value;
  }

  /**
   * Serialize message to binary data
   * @param instance message instance
   */
  serializeBinary() {
    const writer = new BinaryWriter();
    ListImagesRequest.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): ListImagesRequest.AsObject {
    return {
      imageIds: (this.imageIds || []).slice()
    };
  }

  /**
   * Convenience method to support JSON.stringify(message), replicates the structure of toObject()
   */
  toJSON() {
    return this.toObject();
  }

  /**
   * Cast message to JSON using protobuf JSON notation: https://developers.google.com/protocol-buffers/docs/proto3#json
   * Attention: output differs from toObject() e.g. enums are represented as names and not as numbers, Timestamp is an ISO Date string format etc.
   * If the message itself or some of descendant messages is google.protobuf.Any, you MUST provide a message pool as options. If not, the messagePool is not required
   */
  toProtobufJSON(
    // @ts-ignore
    options?: ToProtobufJSONOptions
  ): ListImagesRequest.AsProtobufJSON {
    return {
      imageIds: (this.imageIds || []).slice()
    };
  }
}
export module ListImagesRequest {
  /**
   * Standard JavaScript object representation for ListImagesRequest
   */
  export interface AsObject {
    imageIds?: string[];
  }

  /**
   * Protobuf JSON representation for ListImagesRequest
   */
  export interface AsProtobufJSON {
    imageIds?: string[];
  }
}

/**
 * Message implementation for routeguide.ListImagesResponse
 */
export class ListImagesResponse implements GrpcMessage {
  static id = 'routeguide.ListImagesResponse';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new ListImagesResponse();
    ListImagesResponse.deserializeBinaryFromReader(
      instance,
      new BinaryReader(bytes)
    );
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: ListImagesResponse) {
    _instance.images = _instance.images || [];
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: ListImagesResponse,
    _reader: BinaryReader
  ) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          const messageInitializer1 = new Image();
          _reader.readMessage(
            messageInitializer1,
            Image.deserializeBinaryFromReader
          );
          (_instance.images = _instance.images || []).push(messageInitializer1);
          break;
        default:
          _reader.skipField();
      }
    }

    ListImagesResponse.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(
    _instance: ListImagesResponse,
    _writer: BinaryWriter
  ) {
    if (_instance.images && _instance.images.length) {
      _writer.writeRepeatedMessage(
        1,
        _instance.images as any,
        Image.serializeBinaryToWriter
      );
    }
  }

  private _images?: Image[];

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of ListImagesResponse to deeply clone from
   */
  constructor(_value?: RecursivePartial<ListImagesResponse.AsObject>) {
    _value = _value || {};
    this.images = (_value.images || []).map(m => new Image(m));
    ListImagesResponse.refineValues(this);
  }
  get images(): Image[] | undefined {
    return this._images;
  }
  set images(value: Image[] | undefined) {
    this._images = value;
  }

  /**
   * Serialize message to binary data
   * @param instance message instance
   */
  serializeBinary() {
    const writer = new BinaryWriter();
    ListImagesResponse.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): ListImagesResponse.AsObject {
    return {
      images: (this.images || []).map(m => m.toObject())
    };
  }

  /**
   * Convenience method to support JSON.stringify(message), replicates the structure of toObject()
   */
  toJSON() {
    return this.toObject();
  }

  /**
   * Cast message to JSON using protobuf JSON notation: https://developers.google.com/protocol-buffers/docs/proto3#json
   * Attention: output differs from toObject() e.g. enums are represented as names and not as numbers, Timestamp is an ISO Date string format etc.
   * If the message itself or some of descendant messages is google.protobuf.Any, you MUST provide a message pool as options. If not, the messagePool is not required
   */
  toProtobufJSON(
    // @ts-ignore
    options?: ToProtobufJSONOptions
  ): ListImagesResponse.AsProtobufJSON {
    return {
      images: (this.images || []).map(m => m.toProtobufJSON(options))
    };
  }
}
export module ListImagesResponse {
  /**
   * Standard JavaScript object representation for ListImagesResponse
   */
  export interface AsObject {
    images?: Image.AsObject[];
  }

  /**
   * Protobuf JSON representation for ListImagesResponse
   */
  export interface AsProtobufJSON {
    images?: Image.AsProtobufJSON[] | null;
  }
}

/**
 * Message implementation for routeguide.GetUserRequest
 */
export class GetUserRequest implements GrpcMessage {
  static id = 'routeguide.GetUserRequest';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new GetUserRequest();
    GetUserRequest.deserializeBinaryFromReader(
      instance,
      new BinaryReader(bytes)
    );
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: GetUserRequest) {
    _instance.userId = _instance.userId || '0';
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: GetUserRequest,
    _reader: BinaryReader
  ) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          _instance.userId = _reader.readInt64String();
          break;
        default:
          _reader.skipField();
      }
    }

    GetUserRequest.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(
    _instance: GetUserRequest,
    _writer: BinaryWriter
  ) {
    if (_instance.userId) {
      _writer.writeInt64String(1, _instance.userId);
    }
  }

  private _userId?: string;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of GetUserRequest to deeply clone from
   */
  constructor(_value?: RecursivePartial<GetUserRequest.AsObject>) {
    _value = _value || {};
    this.userId = _value.userId;
    GetUserRequest.refineValues(this);
  }
  get userId(): string | undefined {
    return this._userId;
  }
  set userId(value: string | undefined) {
    this._userId = value;
  }

  /**
   * Serialize message to binary data
   * @param instance message instance
   */
  serializeBinary() {
    const writer = new BinaryWriter();
    GetUserRequest.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): GetUserRequest.AsObject {
    return {
      userId: this.userId
    };
  }

  /**
   * Convenience method to support JSON.stringify(message), replicates the structure of toObject()
   */
  toJSON() {
    return this.toObject();
  }

  /**
   * Cast message to JSON using protobuf JSON notation: https://developers.google.com/protocol-buffers/docs/proto3#json
   * Attention: output differs from toObject() e.g. enums are represented as names and not as numbers, Timestamp is an ISO Date string format etc.
   * If the message itself or some of descendant messages is google.protobuf.Any, you MUST provide a message pool as options. If not, the messagePool is not required
   */
  toProtobufJSON(
    // @ts-ignore
    options?: ToProtobufJSONOptions
  ): GetUserRequest.AsProtobufJSON {
    return {
      userId: this.userId
    };
  }
}
export module GetUserRequest {
  /**
   * Standard JavaScript object representation for GetUserRequest
   */
  export interface AsObject {
    userId?: string;
  }

  /**
   * Protobuf JSON representation for GetUserRequest
   */
  export interface AsProtobufJSON {
    userId?: string;
  }
}

/**
 * Message implementation for routeguide.GetUserResponse
 */
export class GetUserResponse implements GrpcMessage {
  static id = 'routeguide.GetUserResponse';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new GetUserResponse();
    GetUserResponse.deserializeBinaryFromReader(
      instance,
      new BinaryReader(bytes)
    );
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: GetUserResponse) {
    _instance.user = _instance.user || undefined;
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: GetUserResponse,
    _reader: BinaryReader
  ) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          _instance.user = new User();
          _reader.readMessage(_instance.user, User.deserializeBinaryFromReader);
          break;
        default:
          _reader.skipField();
      }
    }

    GetUserResponse.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(
    _instance: GetUserResponse,
    _writer: BinaryWriter
  ) {
    if (_instance.user) {
      _writer.writeMessage(
        1,
        _instance.user as any,
        User.serializeBinaryToWriter
      );
    }
  }

  private _user?: User;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of GetUserResponse to deeply clone from
   */
  constructor(_value?: RecursivePartial<GetUserResponse.AsObject>) {
    _value = _value || {};
    this.user = _value.user ? new User(_value.user) : undefined;
    GetUserResponse.refineValues(this);
  }
  get user(): User | undefined {
    return this._user;
  }
  set user(value: User | undefined) {
    this._user = value;
  }

  /**
   * Serialize message to binary data
   * @param instance message instance
   */
  serializeBinary() {
    const writer = new BinaryWriter();
    GetUserResponse.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): GetUserResponse.AsObject {
    return {
      user: this.user ? this.user.toObject() : undefined
    };
  }

  /**
   * Convenience method to support JSON.stringify(message), replicates the structure of toObject()
   */
  toJSON() {
    return this.toObject();
  }

  /**
   * Cast message to JSON using protobuf JSON notation: https://developers.google.com/protocol-buffers/docs/proto3#json
   * Attention: output differs from toObject() e.g. enums are represented as names and not as numbers, Timestamp is an ISO Date string format etc.
   * If the message itself or some of descendant messages is google.protobuf.Any, you MUST provide a message pool as options. If not, the messagePool is not required
   */
  toProtobufJSON(
    // @ts-ignore
    options?: ToProtobufJSONOptions
  ): GetUserResponse.AsProtobufJSON {
    return {
      user: this.user ? this.user.toProtobufJSON(options) : null
    };
  }
}
export module GetUserResponse {
  /**
   * Standard JavaScript object representation for GetUserResponse
   */
  export interface AsObject {
    user?: User.AsObject;
  }

  /**
   * Protobuf JSON representation for GetUserResponse
   */
  export interface AsProtobufJSON {
    user?: User.AsProtobufJSON | null;
  }
}

/**
 * Message implementation for routeguide.SignInRequest
 */
export class SignInRequest implements GrpcMessage {
  static id = 'routeguide.SignInRequest';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new SignInRequest();
    SignInRequest.deserializeBinaryFromReader(
      instance,
      new BinaryReader(bytes)
    );
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: SignInRequest) {
    _instance.username = _instance.username || '';
    _instance.password = _instance.password || '';
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: SignInRequest,
    _reader: BinaryReader
  ) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          _instance.username = _reader.readString();
          break;
        case 2:
          _instance.password = _reader.readString();
          break;
        default:
          _reader.skipField();
      }
    }

    SignInRequest.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(
    _instance: SignInRequest,
    _writer: BinaryWriter
  ) {
    if (_instance.username) {
      _writer.writeString(1, _instance.username);
    }
    if (_instance.password) {
      _writer.writeString(2, _instance.password);
    }
  }

  private _username?: string;
  private _password?: string;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of SignInRequest to deeply clone from
   */
  constructor(_value?: RecursivePartial<SignInRequest.AsObject>) {
    _value = _value || {};
    this.username = _value.username;
    this.password = _value.password;
    SignInRequest.refineValues(this);
  }
  get username(): string | undefined {
    return this._username;
  }
  set username(value: string | undefined) {
    this._username = value;
  }
  get password(): string | undefined {
    return this._password;
  }
  set password(value: string | undefined) {
    this._password = value;
  }

  /**
   * Serialize message to binary data
   * @param instance message instance
   */
  serializeBinary() {
    const writer = new BinaryWriter();
    SignInRequest.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): SignInRequest.AsObject {
    return {
      username: this.username,
      password: this.password
    };
  }

  /**
   * Convenience method to support JSON.stringify(message), replicates the structure of toObject()
   */
  toJSON() {
    return this.toObject();
  }

  /**
   * Cast message to JSON using protobuf JSON notation: https://developers.google.com/protocol-buffers/docs/proto3#json
   * Attention: output differs from toObject() e.g. enums are represented as names and not as numbers, Timestamp is an ISO Date string format etc.
   * If the message itself or some of descendant messages is google.protobuf.Any, you MUST provide a message pool as options. If not, the messagePool is not required
   */
  toProtobufJSON(
    // @ts-ignore
    options?: ToProtobufJSONOptions
  ): SignInRequest.AsProtobufJSON {
    return {
      username: this.username,
      password: this.password
    };
  }
}
export module SignInRequest {
  /**
   * Standard JavaScript object representation for SignInRequest
   */
  export interface AsObject {
    username?: string;
    password?: string;
  }

  /**
   * Protobuf JSON representation for SignInRequest
   */
  export interface AsProtobufJSON {
    username?: string;
    password?: string;
  }
}

/**
 * Message implementation for routeguide.SignInResponse
 */
export class SignInResponse implements GrpcMessage {
  static id = 'routeguide.SignInResponse';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new SignInResponse();
    SignInResponse.deserializeBinaryFromReader(
      instance,
      new BinaryReader(bytes)
    );
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: SignInResponse) {
    _instance.user = _instance.user || undefined;
    _instance.sid = _instance.sid || '';
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: SignInResponse,
    _reader: BinaryReader
  ) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 2:
          _instance.user = new User();
          _reader.readMessage(_instance.user, User.deserializeBinaryFromReader);
          break;
        case 3:
          _instance.sid = _reader.readString();
          break;
        default:
          _reader.skipField();
      }
    }

    SignInResponse.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(
    _instance: SignInResponse,
    _writer: BinaryWriter
  ) {
    if (_instance.user) {
      _writer.writeMessage(
        2,
        _instance.user as any,
        User.serializeBinaryToWriter
      );
    }
    if (_instance.sid) {
      _writer.writeString(3, _instance.sid);
    }
  }

  private _user?: User;
  private _sid?: string;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of SignInResponse to deeply clone from
   */
  constructor(_value?: RecursivePartial<SignInResponse.AsObject>) {
    _value = _value || {};
    this.user = _value.user ? new User(_value.user) : undefined;
    this.sid = _value.sid;
    SignInResponse.refineValues(this);
  }
  get user(): User | undefined {
    return this._user;
  }
  set user(value: User | undefined) {
    this._user = value;
  }
  get sid(): string | undefined {
    return this._sid;
  }
  set sid(value: string | undefined) {
    this._sid = value;
  }

  /**
   * Serialize message to binary data
   * @param instance message instance
   */
  serializeBinary() {
    const writer = new BinaryWriter();
    SignInResponse.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): SignInResponse.AsObject {
    return {
      user: this.user ? this.user.toObject() : undefined,
      sid: this.sid
    };
  }

  /**
   * Convenience method to support JSON.stringify(message), replicates the structure of toObject()
   */
  toJSON() {
    return this.toObject();
  }

  /**
   * Cast message to JSON using protobuf JSON notation: https://developers.google.com/protocol-buffers/docs/proto3#json
   * Attention: output differs from toObject() e.g. enums are represented as names and not as numbers, Timestamp is an ISO Date string format etc.
   * If the message itself or some of descendant messages is google.protobuf.Any, you MUST provide a message pool as options. If not, the messagePool is not required
   */
  toProtobufJSON(
    // @ts-ignore
    options?: ToProtobufJSONOptions
  ): SignInResponse.AsProtobufJSON {
    return {
      user: this.user ? this.user.toProtobufJSON(options) : null,
      sid: this.sid
    };
  }
}
export module SignInResponse {
  /**
   * Standard JavaScript object representation for SignInResponse
   */
  export interface AsObject {
    user?: User.AsObject;
    sid?: string;
  }

  /**
   * Protobuf JSON representation for SignInResponse
   */
  export interface AsProtobufJSON {
    user?: User.AsProtobufJSON | null;
    sid?: string;
  }
}

/**
 * Message implementation for routeguide.SignOutRequest
 */
export class SignOutRequest implements GrpcMessage {
  static id = 'routeguide.SignOutRequest';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new SignOutRequest();
    SignOutRequest.deserializeBinaryFromReader(
      instance,
      new BinaryReader(bytes)
    );
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: SignOutRequest) {
    _instance.userId = _instance.userId || '0';
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: SignOutRequest,
    _reader: BinaryReader
  ) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          _instance.userId = _reader.readInt64String();
          break;
        default:
          _reader.skipField();
      }
    }

    SignOutRequest.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(
    _instance: SignOutRequest,
    _writer: BinaryWriter
  ) {
    if (_instance.userId) {
      _writer.writeInt64String(1, _instance.userId);
    }
  }

  private _userId?: string;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of SignOutRequest to deeply clone from
   */
  constructor(_value?: RecursivePartial<SignOutRequest.AsObject>) {
    _value = _value || {};
    this.userId = _value.userId;
    SignOutRequest.refineValues(this);
  }
  get userId(): string | undefined {
    return this._userId;
  }
  set userId(value: string | undefined) {
    this._userId = value;
  }

  /**
   * Serialize message to binary data
   * @param instance message instance
   */
  serializeBinary() {
    const writer = new BinaryWriter();
    SignOutRequest.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): SignOutRequest.AsObject {
    return {
      userId: this.userId
    };
  }

  /**
   * Convenience method to support JSON.stringify(message), replicates the structure of toObject()
   */
  toJSON() {
    return this.toObject();
  }

  /**
   * Cast message to JSON using protobuf JSON notation: https://developers.google.com/protocol-buffers/docs/proto3#json
   * Attention: output differs from toObject() e.g. enums are represented as names and not as numbers, Timestamp is an ISO Date string format etc.
   * If the message itself or some of descendant messages is google.protobuf.Any, you MUST provide a message pool as options. If not, the messagePool is not required
   */
  toProtobufJSON(
    // @ts-ignore
    options?: ToProtobufJSONOptions
  ): SignOutRequest.AsProtobufJSON {
    return {
      userId: this.userId
    };
  }
}
export module SignOutRequest {
  /**
   * Standard JavaScript object representation for SignOutRequest
   */
  export interface AsObject {
    userId?: string;
  }

  /**
   * Protobuf JSON representation for SignOutRequest
   */
  export interface AsProtobufJSON {
    userId?: string;
  }
}

/**
 * Message implementation for routeguide.SignUpRequest
 */
export class SignUpRequest implements GrpcMessage {
  static id = 'routeguide.SignUpRequest';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new SignUpRequest();
    SignUpRequest.deserializeBinaryFromReader(
      instance,
      new BinaryReader(bytes)
    );
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: SignUpRequest) {
    _instance.user = _instance.user || undefined;
    _instance.password = _instance.password || '';
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: SignUpRequest,
    _reader: BinaryReader
  ) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          _instance.user = new User();
          _reader.readMessage(_instance.user, User.deserializeBinaryFromReader);
          break;
        case 3:
          _instance.password = _reader.readString();
          break;
        default:
          _reader.skipField();
      }
    }

    SignUpRequest.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(
    _instance: SignUpRequest,
    _writer: BinaryWriter
  ) {
    if (_instance.user) {
      _writer.writeMessage(
        1,
        _instance.user as any,
        User.serializeBinaryToWriter
      );
    }
    if (_instance.password) {
      _writer.writeString(3, _instance.password);
    }
  }

  private _user?: User;
  private _password?: string;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of SignUpRequest to deeply clone from
   */
  constructor(_value?: RecursivePartial<SignUpRequest.AsObject>) {
    _value = _value || {};
    this.user = _value.user ? new User(_value.user) : undefined;
    this.password = _value.password;
    SignUpRequest.refineValues(this);
  }
  get user(): User | undefined {
    return this._user;
  }
  set user(value: User | undefined) {
    this._user = value;
  }
  get password(): string | undefined {
    return this._password;
  }
  set password(value: string | undefined) {
    this._password = value;
  }

  /**
   * Serialize message to binary data
   * @param instance message instance
   */
  serializeBinary() {
    const writer = new BinaryWriter();
    SignUpRequest.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): SignUpRequest.AsObject {
    return {
      user: this.user ? this.user.toObject() : undefined,
      password: this.password
    };
  }

  /**
   * Convenience method to support JSON.stringify(message), replicates the structure of toObject()
   */
  toJSON() {
    return this.toObject();
  }

  /**
   * Cast message to JSON using protobuf JSON notation: https://developers.google.com/protocol-buffers/docs/proto3#json
   * Attention: output differs from toObject() e.g. enums are represented as names and not as numbers, Timestamp is an ISO Date string format etc.
   * If the message itself or some of descendant messages is google.protobuf.Any, you MUST provide a message pool as options. If not, the messagePool is not required
   */
  toProtobufJSON(
    // @ts-ignore
    options?: ToProtobufJSONOptions
  ): SignUpRequest.AsProtobufJSON {
    return {
      user: this.user ? this.user.toProtobufJSON(options) : null,
      password: this.password
    };
  }
}
export module SignUpRequest {
  /**
   * Standard JavaScript object representation for SignUpRequest
   */
  export interface AsObject {
    user?: User.AsObject;
    password?: string;
  }

  /**
   * Protobuf JSON representation for SignUpRequest
   */
  export interface AsProtobufJSON {
    user?: User.AsProtobufJSON | null;
    password?: string;
  }
}

/**
 * Message implementation for routeguide.SignUpResponse
 */
export class SignUpResponse implements GrpcMessage {
  static id = 'routeguide.SignUpResponse';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new SignUpResponse();
    SignUpResponse.deserializeBinaryFromReader(
      instance,
      new BinaryReader(bytes)
    );
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: SignUpResponse) {
    _instance.user = _instance.user || undefined;
    _instance.sid = _instance.sid || '';
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: SignUpResponse,
    _reader: BinaryReader
  ) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 2:
          _instance.user = new User();
          _reader.readMessage(_instance.user, User.deserializeBinaryFromReader);
          break;
        case 3:
          _instance.sid = _reader.readString();
          break;
        default:
          _reader.skipField();
      }
    }

    SignUpResponse.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(
    _instance: SignUpResponse,
    _writer: BinaryWriter
  ) {
    if (_instance.user) {
      _writer.writeMessage(
        2,
        _instance.user as any,
        User.serializeBinaryToWriter
      );
    }
    if (_instance.sid) {
      _writer.writeString(3, _instance.sid);
    }
  }

  private _user?: User;
  private _sid?: string;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of SignUpResponse to deeply clone from
   */
  constructor(_value?: RecursivePartial<SignUpResponse.AsObject>) {
    _value = _value || {};
    this.user = _value.user ? new User(_value.user) : undefined;
    this.sid = _value.sid;
    SignUpResponse.refineValues(this);
  }
  get user(): User | undefined {
    return this._user;
  }
  set user(value: User | undefined) {
    this._user = value;
  }
  get sid(): string | undefined {
    return this._sid;
  }
  set sid(value: string | undefined) {
    this._sid = value;
  }

  /**
   * Serialize message to binary data
   * @param instance message instance
   */
  serializeBinary() {
    const writer = new BinaryWriter();
    SignUpResponse.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): SignUpResponse.AsObject {
    return {
      user: this.user ? this.user.toObject() : undefined,
      sid: this.sid
    };
  }

  /**
   * Convenience method to support JSON.stringify(message), replicates the structure of toObject()
   */
  toJSON() {
    return this.toObject();
  }

  /**
   * Cast message to JSON using protobuf JSON notation: https://developers.google.com/protocol-buffers/docs/proto3#json
   * Attention: output differs from toObject() e.g. enums are represented as names and not as numbers, Timestamp is an ISO Date string format etc.
   * If the message itself or some of descendant messages is google.protobuf.Any, you MUST provide a message pool as options. If not, the messagePool is not required
   */
  toProtobufJSON(
    // @ts-ignore
    options?: ToProtobufJSONOptions
  ): SignUpResponse.AsProtobufJSON {
    return {
      user: this.user ? this.user.toProtobufJSON(options) : null,
      sid: this.sid
    };
  }
}
export module SignUpResponse {
  /**
   * Standard JavaScript object representation for SignUpResponse
   */
  export interface AsObject {
    user?: User.AsObject;
    sid?: string;
  }

  /**
   * Protobuf JSON representation for SignUpResponse
   */
  export interface AsProtobufJSON {
    user?: User.AsProtobufJSON | null;
    sid?: string;
  }
}

/**
 * Message implementation for routeguide.Empty
 */
export class Empty implements GrpcMessage {
  static id = 'routeguide.Empty';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new Empty();
    Empty.deserializeBinaryFromReader(instance, new BinaryReader(bytes));
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: Empty) {}

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(_instance: Empty, _reader: BinaryReader) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        default:
          _reader.skipField();
      }
    }

    Empty.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(_instance: Empty, _writer: BinaryWriter) {}

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of Empty to deeply clone from
   */
  constructor(_value?: RecursivePartial<Empty.AsObject>) {
    _value = _value || {};
    Empty.refineValues(this);
  }

  /**
   * Serialize message to binary data
   * @param instance message instance
   */
  serializeBinary() {
    const writer = new BinaryWriter();
    Empty.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): Empty.AsObject {
    return {};
  }

  /**
   * Convenience method to support JSON.stringify(message), replicates the structure of toObject()
   */
  toJSON() {
    return this.toObject();
  }

  /**
   * Cast message to JSON using protobuf JSON notation: https://developers.google.com/protocol-buffers/docs/proto3#json
   * Attention: output differs from toObject() e.g. enums are represented as names and not as numbers, Timestamp is an ISO Date string format etc.
   * If the message itself or some of descendant messages is google.protobuf.Any, you MUST provide a message pool as options. If not, the messagePool is not required
   */
  toProtobufJSON(
    // @ts-ignore
    options?: ToProtobufJSONOptions
  ): Empty.AsProtobufJSON {
    return {};
  }
}
export module Empty {
  /**
   * Standard JavaScript object representation for Empty
   */
  export interface AsObject {}

  /**
   * Protobuf JSON representation for Empty
   */
  export interface AsProtobufJSON {}
}

/**
 * Message implementation for routeguide.Status
 */
export class Status implements GrpcMessage {
  static id = 'routeguide.Status';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new Status();
    Status.deserializeBinaryFromReader(instance, new BinaryReader(bytes));
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: Status) {
    _instance.code = _instance.code || '0';
    _instance.message = _instance.message || '';
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(_instance: Status, _reader: BinaryReader) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          _instance.code = _reader.readInt64String();
          break;
        case 2:
          _instance.message = _reader.readString();
          break;
        default:
          _reader.skipField();
      }
    }

    Status.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(_instance: Status, _writer: BinaryWriter) {
    if (_instance.code) {
      _writer.writeInt64String(1, _instance.code);
    }
    if (_instance.message) {
      _writer.writeString(2, _instance.message);
    }
  }

  private _code?: string;
  private _message?: string;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of Status to deeply clone from
   */
  constructor(_value?: RecursivePartial<Status.AsObject>) {
    _value = _value || {};
    this.code = _value.code;
    this.message = _value.message;
    Status.refineValues(this);
  }
  get code(): string | undefined {
    return this._code;
  }
  set code(value: string | undefined) {
    this._code = value;
  }
  get message(): string | undefined {
    return this._message;
  }
  set message(value: string | undefined) {
    this._message = value;
  }

  /**
   * Serialize message to binary data
   * @param instance message instance
   */
  serializeBinary() {
    const writer = new BinaryWriter();
    Status.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): Status.AsObject {
    return {
      code: this.code,
      message: this.message
    };
  }

  /**
   * Convenience method to support JSON.stringify(message), replicates the structure of toObject()
   */
  toJSON() {
    return this.toObject();
  }

  /**
   * Cast message to JSON using protobuf JSON notation: https://developers.google.com/protocol-buffers/docs/proto3#json
   * Attention: output differs from toObject() e.g. enums are represented as names and not as numbers, Timestamp is an ISO Date string format etc.
   * If the message itself or some of descendant messages is google.protobuf.Any, you MUST provide a message pool as options. If not, the messagePool is not required
   */
  toProtobufJSON(
    // @ts-ignore
    options?: ToProtobufJSONOptions
  ): Status.AsProtobufJSON {
    return {
      code: this.code,
      message: this.message
    };
  }
}
export module Status {
  /**
   * Standard JavaScript object representation for Status
   */
  export interface AsObject {
    code?: string;
    message?: string;
  }

  /**
   * Protobuf JSON representation for Status
   */
  export interface AsProtobufJSON {
    code?: string;
    message?: string;
  }
}

/**
 * Message implementation for routeguide.Package
 */
export class Package implements GrpcMessage {
  static id = 'routeguide.Package';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new Package();
    Package.deserializeBinaryFromReader(instance, new BinaryReader(bytes));
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: Package) {
    _instance.packageId = _instance.packageId || '0';
    _instance.name = _instance.name || '';
    _instance.description = _instance.description || '';
    _instance.primaryCategory = _instance.primaryCategory || '';
    _instance.secondaryCategory = _instance.secondaryCategory || '';
    _instance.status = _instance.status || '';
    _instance.authorId = _instance.authorId || '0';
    _instance.binaryIds = _instance.binaryIds || [];
    _instance.imageIds = _instance.imageIds || [];
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: Package,
    _reader: BinaryReader
  ) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          _instance.packageId = _reader.readInt64String();
          break;
        case 2:
          _instance.name = _reader.readString();
          break;
        case 3:
          _instance.description = _reader.readString();
          break;
        case 4:
          _instance.primaryCategory = _reader.readString();
          break;
        case 5:
          _instance.secondaryCategory = _reader.readString();
          break;
        case 6:
          _instance.status = _reader.readString();
          break;
        case 7:
          _instance.authorId = _reader.readInt64String();
          break;
        case 8:
          (_instance.binaryIds = _instance.binaryIds || []).push(
            ...(_reader.readPackedInt64String() || [])
          );
          break;
        case 9:
          (_instance.imageIds = _instance.imageIds || []).push(
            ...(_reader.readPackedInt64String() || [])
          );
          break;
        default:
          _reader.skipField();
      }
    }

    Package.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(_instance: Package, _writer: BinaryWriter) {
    if (_instance.packageId) {
      _writer.writeInt64String(1, _instance.packageId);
    }
    if (_instance.name) {
      _writer.writeString(2, _instance.name);
    }
    if (_instance.description) {
      _writer.writeString(3, _instance.description);
    }
    if (_instance.primaryCategory) {
      _writer.writeString(4, _instance.primaryCategory);
    }
    if (_instance.secondaryCategory) {
      _writer.writeString(5, _instance.secondaryCategory);
    }
    if (_instance.status) {
      _writer.writeString(6, _instance.status);
    }
    if (_instance.authorId) {
      _writer.writeInt64String(7, _instance.authorId);
    }
    if (_instance.binaryIds && _instance.binaryIds.length) {
      _writer.writePackedInt64String(8, _instance.binaryIds);
    }
    if (_instance.imageIds && _instance.imageIds.length) {
      _writer.writePackedInt64String(9, _instance.imageIds);
    }
  }

  private _packageId?: string;
  private _name?: string;
  private _description?: string;
  private _primaryCategory?: string;
  private _secondaryCategory?: string;
  private _status?: string;
  private _authorId?: string;
  private _binaryIds?: string[];
  private _imageIds?: string[];

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of Package to deeply clone from
   */
  constructor(_value?: RecursivePartial<Package.AsObject>) {
    _value = _value || {};
    this.packageId = _value.packageId;
    this.name = _value.name;
    this.description = _value.description;
    this.primaryCategory = _value.primaryCategory;
    this.secondaryCategory = _value.secondaryCategory;
    this.status = _value.status;
    this.authorId = _value.authorId;
    this.binaryIds = (_value.binaryIds || []).slice();
    this.imageIds = (_value.imageIds || []).slice();
    Package.refineValues(this);
  }
  get packageId(): string | undefined {
    return this._packageId;
  }
  set packageId(value: string | undefined) {
    this._packageId = value;
  }
  get name(): string | undefined {
    return this._name;
  }
  set name(value: string | undefined) {
    this._name = value;
  }
  get description(): string | undefined {
    return this._description;
  }
  set description(value: string | undefined) {
    this._description = value;
  }
  get primaryCategory(): string | undefined {
    return this._primaryCategory;
  }
  set primaryCategory(value: string | undefined) {
    this._primaryCategory = value;
  }
  get secondaryCategory(): string | undefined {
    return this._secondaryCategory;
  }
  set secondaryCategory(value: string | undefined) {
    this._secondaryCategory = value;
  }
  get status(): string | undefined {
    return this._status;
  }
  set status(value: string | undefined) {
    this._status = value;
  }
  get authorId(): string | undefined {
    return this._authorId;
  }
  set authorId(value: string | undefined) {
    this._authorId = value;
  }
  get binaryIds(): string[] | undefined {
    return this._binaryIds;
  }
  set binaryIds(value: string[] | undefined) {
    this._binaryIds = value;
  }
  get imageIds(): string[] | undefined {
    return this._imageIds;
  }
  set imageIds(value: string[] | undefined) {
    this._imageIds = value;
  }

  /**
   * Serialize message to binary data
   * @param instance message instance
   */
  serializeBinary() {
    const writer = new BinaryWriter();
    Package.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): Package.AsObject {
    return {
      packageId: this.packageId,
      name: this.name,
      description: this.description,
      primaryCategory: this.primaryCategory,
      secondaryCategory: this.secondaryCategory,
      status: this.status,
      authorId: this.authorId,
      binaryIds: (this.binaryIds || []).slice(),
      imageIds: (this.imageIds || []).slice()
    };
  }

  /**
   * Convenience method to support JSON.stringify(message), replicates the structure of toObject()
   */
  toJSON() {
    return this.toObject();
  }

  /**
   * Cast message to JSON using protobuf JSON notation: https://developers.google.com/protocol-buffers/docs/proto3#json
   * Attention: output differs from toObject() e.g. enums are represented as names and not as numbers, Timestamp is an ISO Date string format etc.
   * If the message itself or some of descendant messages is google.protobuf.Any, you MUST provide a message pool as options. If not, the messagePool is not required
   */
  toProtobufJSON(
    // @ts-ignore
    options?: ToProtobufJSONOptions
  ): Package.AsProtobufJSON {
    return {
      packageId: this.packageId,
      name: this.name,
      description: this.description,
      primaryCategory: this.primaryCategory,
      secondaryCategory: this.secondaryCategory,
      status: this.status,
      authorId: this.authorId,
      binaryIds: (this.binaryIds || []).slice(),
      imageIds: (this.imageIds || []).slice()
    };
  }
}
export module Package {
  /**
   * Standard JavaScript object representation for Package
   */
  export interface AsObject {
    packageId?: string;
    name?: string;
    description?: string;
    primaryCategory?: string;
    secondaryCategory?: string;
    status?: string;
    authorId?: string;
    binaryIds?: string[];
    imageIds?: string[];
  }

  /**
   * Protobuf JSON representation for Package
   */
  export interface AsProtobufJSON {
    packageId?: string;
    name?: string;
    description?: string;
    primaryCategory?: string;
    secondaryCategory?: string;
    status?: string;
    authorId?: string;
    binaryIds?: string[];
    imageIds?: string[];
  }
}

/**
 * Message implementation for routeguide.Binary
 */
export class Binary implements GrpcMessage {
  static id = 'routeguide.Binary';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new Binary();
    Binary.deserializeBinaryFromReader(instance, new BinaryReader(bytes));
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: Binary) {
    _instance.binaryId = _instance.binaryId || '0';
    _instance.packageId = _instance.packageId || '0';
    _instance.downloadCount = _instance.downloadCount || '0';
    _instance.version = _instance.version || undefined;
    _instance.description = _instance.description || '';
    _instance.data = _instance.data || new Uint8Array();
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(_instance: Binary, _reader: BinaryReader) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          _instance.binaryId = _reader.readInt64String();
          break;
        case 2:
          _instance.packageId = _reader.readInt64String();
          break;
        case 3:
          _instance.downloadCount = _reader.readInt64String();
          break;
        case 4:
          _instance.version = new Version();
          _reader.readMessage(
            _instance.version,
            Version.deserializeBinaryFromReader
          );
          break;
        case 5:
          _instance.description = _reader.readString();
          break;
        case 6:
          _instance.data = _reader.readBytes();
          break;
        default:
          _reader.skipField();
      }
    }

    Binary.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(_instance: Binary, _writer: BinaryWriter) {
    if (_instance.binaryId) {
      _writer.writeInt64String(1, _instance.binaryId);
    }
    if (_instance.packageId) {
      _writer.writeInt64String(2, _instance.packageId);
    }
    if (_instance.downloadCount) {
      _writer.writeInt64String(3, _instance.downloadCount);
    }
    if (_instance.version) {
      _writer.writeMessage(
        4,
        _instance.version as any,
        Version.serializeBinaryToWriter
      );
    }
    if (_instance.description) {
      _writer.writeString(5, _instance.description);
    }
    if (_instance.data && _instance.data.length) {
      _writer.writeBytes(6, _instance.data);
    }
  }

  private _binaryId?: string;
  private _packageId?: string;
  private _downloadCount?: string;
  private _version?: Version;
  private _description?: string;
  private _data?: Uint8Array;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of Binary to deeply clone from
   */
  constructor(_value?: RecursivePartial<Binary.AsObject>) {
    _value = _value || {};
    this.binaryId = _value.binaryId;
    this.packageId = _value.packageId;
    this.downloadCount = _value.downloadCount;
    this.version = _value.version ? new Version(_value.version) : undefined;
    this.description = _value.description;
    this.data = _value.data;
    Binary.refineValues(this);
  }
  get binaryId(): string | undefined {
    return this._binaryId;
  }
  set binaryId(value: string | undefined) {
    this._binaryId = value;
  }
  get packageId(): string | undefined {
    return this._packageId;
  }
  set packageId(value: string | undefined) {
    this._packageId = value;
  }
  get downloadCount(): string | undefined {
    return this._downloadCount;
  }
  set downloadCount(value: string | undefined) {
    this._downloadCount = value;
  }
  get version(): Version | undefined {
    return this._version;
  }
  set version(value: Version | undefined) {
    this._version = value;
  }
  get description(): string | undefined {
    return this._description;
  }
  set description(value: string | undefined) {
    this._description = value;
  }
  get data(): Uint8Array | undefined {
    return this._data;
  }
  set data(value: Uint8Array | undefined) {
    this._data = value;
  }

  /**
   * Serialize message to binary data
   * @param instance message instance
   */
  serializeBinary() {
    const writer = new BinaryWriter();
    Binary.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): Binary.AsObject {
    return {
      binaryId: this.binaryId,
      packageId: this.packageId,
      downloadCount: this.downloadCount,
      version: this.version ? this.version.toObject() : undefined,
      description: this.description,
      data: this.data ? this.data.subarray(0) : new Uint8Array()
    };
  }

  /**
   * Convenience method to support JSON.stringify(message), replicates the structure of toObject()
   */
  toJSON() {
    return this.toObject();
  }

  /**
   * Cast message to JSON using protobuf JSON notation: https://developers.google.com/protocol-buffers/docs/proto3#json
   * Attention: output differs from toObject() e.g. enums are represented as names and not as numbers, Timestamp is an ISO Date string format etc.
   * If the message itself or some of descendant messages is google.protobuf.Any, you MUST provide a message pool as options. If not, the messagePool is not required
   */
  toProtobufJSON(
    // @ts-ignore
    options?: ToProtobufJSONOptions
  ): Binary.AsProtobufJSON {
    return {
      binaryId: this.binaryId,
      packageId: this.packageId,
      downloadCount: this.downloadCount,
      version: this.version ? this.version.toProtobufJSON(options) : null,
      description: this.description,
      data: this.data ? uint8ArrayToBase64(this.data) : ''
    };
  }
}
export module Binary {
  /**
   * Standard JavaScript object representation for Binary
   */
  export interface AsObject {
    binaryId?: string;
    packageId?: string;
    downloadCount?: string;
    version?: Version.AsObject;
    description?: string;
    data?: Uint8Array;
  }

  /**
   * Protobuf JSON representation for Binary
   */
  export interface AsProtobufJSON {
    binaryId?: string;
    packageId?: string;
    downloadCount?: string;
    version?: Version.AsProtobufJSON | null;
    description?: string;
    data?: string;
  }
}

/**
 * Message implementation for routeguide.Image
 */
export class Image implements GrpcMessage {
  static id = 'routeguide.Image';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new Image();
    Image.deserializeBinaryFromReader(instance, new BinaryReader(bytes));
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: Image) {
    _instance.imageId = _instance.imageId || '0';
    _instance.data = _instance.data || new Uint8Array();
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(_instance: Image, _reader: BinaryReader) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          _instance.imageId = _reader.readInt64String();
          break;
        case 2:
          _instance.data = _reader.readBytes();
          break;
        default:
          _reader.skipField();
      }
    }

    Image.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(_instance: Image, _writer: BinaryWriter) {
    if (_instance.imageId) {
      _writer.writeInt64String(1, _instance.imageId);
    }
    if (_instance.data && _instance.data.length) {
      _writer.writeBytes(2, _instance.data);
    }
  }

  private _imageId?: string;
  private _data?: Uint8Array;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of Image to deeply clone from
   */
  constructor(_value?: RecursivePartial<Image.AsObject>) {
    _value = _value || {};
    this.imageId = _value.imageId;
    this.data = _value.data;
    Image.refineValues(this);
  }
  get imageId(): string | undefined {
    return this._imageId;
  }
  set imageId(value: string | undefined) {
    this._imageId = value;
  }
  get data(): Uint8Array | undefined {
    return this._data;
  }
  set data(value: Uint8Array | undefined) {
    this._data = value;
  }

  /**
   * Serialize message to binary data
   * @param instance message instance
   */
  serializeBinary() {
    const writer = new BinaryWriter();
    Image.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): Image.AsObject {
    return {
      imageId: this.imageId,
      data: this.data ? this.data.subarray(0) : new Uint8Array()
    };
  }

  /**
   * Convenience method to support JSON.stringify(message), replicates the structure of toObject()
   */
  toJSON() {
    return this.toObject();
  }

  /**
   * Cast message to JSON using protobuf JSON notation: https://developers.google.com/protocol-buffers/docs/proto3#json
   * Attention: output differs from toObject() e.g. enums are represented as names and not as numbers, Timestamp is an ISO Date string format etc.
   * If the message itself or some of descendant messages is google.protobuf.Any, you MUST provide a message pool as options. If not, the messagePool is not required
   */
  toProtobufJSON(
    // @ts-ignore
    options?: ToProtobufJSONOptions
  ): Image.AsProtobufJSON {
    return {
      imageId: this.imageId,
      data: this.data ? uint8ArrayToBase64(this.data) : ''
    };
  }
}
export module Image {
  /**
   * Standard JavaScript object representation for Image
   */
  export interface AsObject {
    imageId?: string;
    data?: Uint8Array;
  }

  /**
   * Protobuf JSON representation for Image
   */
  export interface AsProtobufJSON {
    imageId?: string;
    data?: string;
  }
}

/**
 * Message implementation for routeguide.User
 */
export class User implements GrpcMessage {
  static id = 'routeguide.User';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new User();
    User.deserializeBinaryFromReader(instance, new BinaryReader(bytes));
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: User) {
    _instance.userId = _instance.userId || '0';
    _instance.username = _instance.username || '';
    _instance.email = _instance.email || '';
    _instance.userType = _instance.userType || '';
    _instance.imageId = _instance.imageId || '0';
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(_instance: User, _reader: BinaryReader) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          _instance.userId = _reader.readInt64String();
          break;
        case 2:
          _instance.username = _reader.readString();
          break;
        case 3:
          _instance.email = _reader.readString();
          break;
        case 4:
          _instance.userType = _reader.readString();
          break;
        case 5:
          _instance.imageId = _reader.readInt64String();
          break;
        default:
          _reader.skipField();
      }
    }

    User.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(_instance: User, _writer: BinaryWriter) {
    if (_instance.userId) {
      _writer.writeInt64String(1, _instance.userId);
    }
    if (_instance.username) {
      _writer.writeString(2, _instance.username);
    }
    if (_instance.email) {
      _writer.writeString(3, _instance.email);
    }
    if (_instance.userType) {
      _writer.writeString(4, _instance.userType);
    }
    if (_instance.imageId) {
      _writer.writeInt64String(5, _instance.imageId);
    }
  }

  private _userId?: string;
  private _username?: string;
  private _email?: string;
  private _userType?: string;
  private _imageId?: string;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of User to deeply clone from
   */
  constructor(_value?: RecursivePartial<User.AsObject>) {
    _value = _value || {};
    this.userId = _value.userId;
    this.username = _value.username;
    this.email = _value.email;
    this.userType = _value.userType;
    this.imageId = _value.imageId;
    User.refineValues(this);
  }
  get userId(): string | undefined {
    return this._userId;
  }
  set userId(value: string | undefined) {
    this._userId = value;
  }
  get username(): string | undefined {
    return this._username;
  }
  set username(value: string | undefined) {
    this._username = value;
  }
  get email(): string | undefined {
    return this._email;
  }
  set email(value: string | undefined) {
    this._email = value;
  }
  get userType(): string | undefined {
    return this._userType;
  }
  set userType(value: string | undefined) {
    this._userType = value;
  }
  get imageId(): string | undefined {
    return this._imageId;
  }
  set imageId(value: string | undefined) {
    this._imageId = value;
  }

  /**
   * Serialize message to binary data
   * @param instance message instance
   */
  serializeBinary() {
    const writer = new BinaryWriter();
    User.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): User.AsObject {
    return {
      userId: this.userId,
      username: this.username,
      email: this.email,
      userType: this.userType,
      imageId: this.imageId
    };
  }

  /**
   * Convenience method to support JSON.stringify(message), replicates the structure of toObject()
   */
  toJSON() {
    return this.toObject();
  }

  /**
   * Cast message to JSON using protobuf JSON notation: https://developers.google.com/protocol-buffers/docs/proto3#json
   * Attention: output differs from toObject() e.g. enums are represented as names and not as numbers, Timestamp is an ISO Date string format etc.
   * If the message itself or some of descendant messages is google.protobuf.Any, you MUST provide a message pool as options. If not, the messagePool is not required
   */
  toProtobufJSON(
    // @ts-ignore
    options?: ToProtobufJSONOptions
  ): User.AsProtobufJSON {
    return {
      userId: this.userId,
      username: this.username,
      email: this.email,
      userType: this.userType,
      imageId: this.imageId
    };
  }
}
export module User {
  /**
   * Standard JavaScript object representation for User
   */
  export interface AsObject {
    userId?: string;
    username?: string;
    email?: string;
    userType?: string;
    imageId?: string;
  }

  /**
   * Protobuf JSON representation for User
   */
  export interface AsProtobufJSON {
    userId?: string;
    username?: string;
    email?: string;
    userType?: string;
    imageId?: string;
  }
}

/**
 * Message implementation for routeguide.Version
 */
export class Version implements GrpcMessage {
  static id = 'routeguide.Version';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new Version();
    Version.deserializeBinaryFromReader(instance, new BinaryReader(bytes));
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: Version) {
    _instance.major = _instance.major || '0';
    _instance.minor = _instance.minor || '0';
    _instance.patch = _instance.patch || '0';
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: Version,
    _reader: BinaryReader
  ) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          _instance.major = _reader.readInt64String();
          break;
        case 2:
          _instance.minor = _reader.readInt64String();
          break;
        case 3:
          _instance.patch = _reader.readInt64String();
          break;
        default:
          _reader.skipField();
      }
    }

    Version.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(_instance: Version, _writer: BinaryWriter) {
    if (_instance.major) {
      _writer.writeInt64String(1, _instance.major);
    }
    if (_instance.minor) {
      _writer.writeInt64String(2, _instance.minor);
    }
    if (_instance.patch) {
      _writer.writeInt64String(3, _instance.patch);
    }
  }

  private _major?: string;
  private _minor?: string;
  private _patch?: string;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of Version to deeply clone from
   */
  constructor(_value?: RecursivePartial<Version.AsObject>) {
    _value = _value || {};
    this.major = _value.major;
    this.minor = _value.minor;
    this.patch = _value.patch;
    Version.refineValues(this);
  }
  get major(): string | undefined {
    return this._major;
  }
  set major(value: string | undefined) {
    this._major = value;
  }
  get minor(): string | undefined {
    return this._minor;
  }
  set minor(value: string | undefined) {
    this._minor = value;
  }
  get patch(): string | undefined {
    return this._patch;
  }
  set patch(value: string | undefined) {
    this._patch = value;
  }

  /**
   * Serialize message to binary data
   * @param instance message instance
   */
  serializeBinary() {
    const writer = new BinaryWriter();
    Version.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): Version.AsObject {
    return {
      major: this.major,
      minor: this.minor,
      patch: this.patch
    };
  }

  /**
   * Convenience method to support JSON.stringify(message), replicates the structure of toObject()
   */
  toJSON() {
    return this.toObject();
  }

  /**
   * Cast message to JSON using protobuf JSON notation: https://developers.google.com/protocol-buffers/docs/proto3#json
   * Attention: output differs from toObject() e.g. enums are represented as names and not as numbers, Timestamp is an ISO Date string format etc.
   * If the message itself or some of descendant messages is google.protobuf.Any, you MUST provide a message pool as options. If not, the messagePool is not required
   */
  toProtobufJSON(
    // @ts-ignore
    options?: ToProtobufJSONOptions
  ): Version.AsProtobufJSON {
    return {
      major: this.major,
      minor: this.minor,
      patch: this.patch
    };
  }
}
export module Version {
  /**
   * Standard JavaScript object representation for Version
   */
  export interface AsObject {
    major?: string;
    minor?: string;
    patch?: string;
  }

  /**
   * Protobuf JSON representation for Version
   */
  export interface AsProtobufJSON {
    major?: string;
    minor?: string;
    patch?: string;
  }
}
