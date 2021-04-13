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
    _instance.categoryId = _instance.categoryId || '0';
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
          _instance.categoryId = _reader.readInt64String();
          break;
        case 2:
          _instance.pageSize = _reader.readInt64String();
          break;
        case 3:
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
    if (_instance.categoryId) {
      _writer.writeInt64String(1, _instance.categoryId);
    }
    if (_instance.pageSize) {
      _writer.writeInt64String(2, _instance.pageSize);
    }
    if (_instance.pageToken) {
      _writer.writeString(3, _instance.pageToken);
    }
  }

  private _categoryId?: string;
  private _pageSize?: string;
  private _pageToken?: string;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of ListPackagesRequest to deeply clone from
   */
  constructor(_value?: RecursivePartial<ListPackagesRequest.AsObject>) {
    _value = _value || {};
    this.categoryId = _value.categoryId;
    this.pageSize = _value.pageSize;
    this.pageToken = _value.pageToken;
    ListPackagesRequest.refineValues(this);
  }
  get categoryId(): string | undefined {
    return this._categoryId;
  }
  set categoryId(value: string | undefined) {
    this._categoryId = value;
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
      categoryId: this.categoryId,
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
      categoryId: this.categoryId,
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
    categoryId?: string;
    pageSize?: string;
    pageToken?: string;
  }

  /**
   * Protobuf JSON representation for ListPackagesRequest
   */
  export interface AsProtobufJSON {
    categoryId?: string;
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
    _instance.nextPageToken = _instance.nextPageToken || '';
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
        case 2:
          _instance.nextPageToken = _reader.readString();
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
    if (_instance.nextPageToken) {
      _writer.writeString(2, _instance.nextPageToken);
    }
  }

  private _packages?: Package[];
  private _nextPageToken?: string;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of ListPackagesResponse to deeply clone from
   */
  constructor(_value?: RecursivePartial<ListPackagesResponse.AsObject>) {
    _value = _value || {};
    this.packages = (_value.packages || []).map(m => new Package(m));
    this.nextPageToken = _value.nextPageToken;
    ListPackagesResponse.refineValues(this);
  }
  get packages(): Package[] | undefined {
    return this._packages;
  }
  set packages(value: Package[] | undefined) {
    this._packages = value;
  }
  get nextPageToken(): string | undefined {
    return this._nextPageToken;
  }
  set nextPageToken(value: string | undefined) {
    this._nextPageToken = value;
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
      packages: (this.packages || []).map(m => m.toObject()),
      nextPageToken: this.nextPageToken
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
      packages: (this.packages || []).map(m => m.toProtobufJSON(options)),
      nextPageToken: this.nextPageToken
    };
  }
}
export module ListPackagesResponse {
  /**
   * Standard JavaScript object representation for ListPackagesResponse
   */
  export interface AsObject {
    packages?: Package.AsObject[];
    nextPageToken?: string;
  }

  /**
   * Protobuf JSON representation for ListPackagesResponse
   */
  export interface AsProtobufJSON {
    packages?: Package.AsProtobufJSON[] | null;
    nextPageToken?: string;
  }
}

/**
 * Message implementation for routeguide.SearchPackagesRequest
 */
export class SearchPackagesRequest implements GrpcMessage {
  static id = 'routeguide.SearchPackagesRequest';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new SearchPackagesRequest();
    SearchPackagesRequest.deserializeBinaryFromReader(
      instance,
      new BinaryReader(bytes)
    );
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: SearchPackagesRequest) {
    _instance.query = _instance.query || '';
    _instance.pageSize = _instance.pageSize || '0';
    _instance.pageToken = _instance.pageToken || '';
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: SearchPackagesRequest,
    _reader: BinaryReader
  ) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          _instance.query = _reader.readString();
          break;
        case 2:
          _instance.pageSize = _reader.readInt64String();
          break;
        case 3:
          _instance.pageToken = _reader.readString();
          break;
        default:
          _reader.skipField();
      }
    }

    SearchPackagesRequest.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(
    _instance: SearchPackagesRequest,
    _writer: BinaryWriter
  ) {
    if (_instance.query) {
      _writer.writeString(1, _instance.query);
    }
    if (_instance.pageSize) {
      _writer.writeInt64String(2, _instance.pageSize);
    }
    if (_instance.pageToken) {
      _writer.writeString(3, _instance.pageToken);
    }
  }

  private _query?: string;
  private _pageSize?: string;
  private _pageToken?: string;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of SearchPackagesRequest to deeply clone from
   */
  constructor(_value?: RecursivePartial<SearchPackagesRequest.AsObject>) {
    _value = _value || {};
    this.query = _value.query;
    this.pageSize = _value.pageSize;
    this.pageToken = _value.pageToken;
    SearchPackagesRequest.refineValues(this);
  }
  get query(): string | undefined {
    return this._query;
  }
  set query(value: string | undefined) {
    this._query = value;
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
    SearchPackagesRequest.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): SearchPackagesRequest.AsObject {
    return {
      query: this.query,
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
  ): SearchPackagesRequest.AsProtobufJSON {
    return {
      query: this.query,
      pageSize: this.pageSize,
      pageToken: this.pageToken
    };
  }
}
export module SearchPackagesRequest {
  /**
   * Standard JavaScript object representation for SearchPackagesRequest
   */
  export interface AsObject {
    query?: string;
    pageSize?: string;
    pageToken?: string;
  }

  /**
   * Protobuf JSON representation for SearchPackagesRequest
   */
  export interface AsProtobufJSON {
    query?: string;
    pageSize?: string;
    pageToken?: string;
  }
}

/**
 * Message implementation for routeguide.SearchPackagesResponse
 */
export class SearchPackagesResponse implements GrpcMessage {
  static id = 'routeguide.SearchPackagesResponse';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new SearchPackagesResponse();
    SearchPackagesResponse.deserializeBinaryFromReader(
      instance,
      new BinaryReader(bytes)
    );
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: SearchPackagesResponse) {
    _instance.packages = _instance.packages || [];
    _instance.nextPageToken = _instance.nextPageToken || '';
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: SearchPackagesResponse,
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
        case 2:
          _instance.nextPageToken = _reader.readString();
          break;
        default:
          _reader.skipField();
      }
    }

    SearchPackagesResponse.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(
    _instance: SearchPackagesResponse,
    _writer: BinaryWriter
  ) {
    if (_instance.packages && _instance.packages.length) {
      _writer.writeRepeatedMessage(
        1,
        _instance.packages as any,
        Package.serializeBinaryToWriter
      );
    }
    if (_instance.nextPageToken) {
      _writer.writeString(2, _instance.nextPageToken);
    }
  }

  private _packages?: Package[];
  private _nextPageToken?: string;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of SearchPackagesResponse to deeply clone from
   */
  constructor(_value?: RecursivePartial<SearchPackagesResponse.AsObject>) {
    _value = _value || {};
    this.packages = (_value.packages || []).map(m => new Package(m));
    this.nextPageToken = _value.nextPageToken;
    SearchPackagesResponse.refineValues(this);
  }
  get packages(): Package[] | undefined {
    return this._packages;
  }
  set packages(value: Package[] | undefined) {
    this._packages = value;
  }
  get nextPageToken(): string | undefined {
    return this._nextPageToken;
  }
  set nextPageToken(value: string | undefined) {
    this._nextPageToken = value;
  }

  /**
   * Serialize message to binary data
   * @param instance message instance
   */
  serializeBinary() {
    const writer = new BinaryWriter();
    SearchPackagesResponse.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): SearchPackagesResponse.AsObject {
    return {
      packages: (this.packages || []).map(m => m.toObject()),
      nextPageToken: this.nextPageToken
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
  ): SearchPackagesResponse.AsProtobufJSON {
    return {
      packages: (this.packages || []).map(m => m.toProtobufJSON(options)),
      nextPageToken: this.nextPageToken
    };
  }
}
export module SearchPackagesResponse {
  /**
   * Standard JavaScript object representation for SearchPackagesResponse
   */
  export interface AsObject {
    packages?: Package.AsObject[];
    nextPageToken?: string;
  }

  /**
   * Protobuf JSON representation for SearchPackagesResponse
   */
  export interface AsProtobufJSON {
    packages?: Package.AsProtobufJSON[] | null;
    nextPageToken?: string;
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
        case 3:
          _instance.data = _reader.readBytes();
          break;
        case 4:
          _instance.downloadMethod = _reader.readString();
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
    if (_instance.data && _instance.data.length) {
      _writer.writeBytes(3, _instance.data);
    }
    if (_instance.downloadMethod || _instance.downloadMethod === '') {
      _writer.writeString(4, _instance.downloadMethod);
    }
  }

  private _parent?: string;
  private _binary?: Binary;
  private _data?: Uint8Array;
  private _downloadMethod?: string;

  private _resource: UploadBinaryRequest.ResourceCase =
    UploadBinaryRequest.ResourceCase.none;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of UploadBinaryRequest to deeply clone from
   */
  constructor(_value?: RecursivePartial<UploadBinaryRequest.AsObject>) {
    _value = _value || {};
    this.parent = _value.parent;
    this.binary = _value.binary ? new Binary(_value.binary) : undefined;
    this.data = _value.data;
    this.downloadMethod = _value.downloadMethod;
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
  get data(): Uint8Array | undefined {
    return this._data;
  }
  set data(value: Uint8Array | undefined) {
    if (value !== undefined && value !== null) {
      this._downloadMethod = undefined;
      this._resource = UploadBinaryRequest.ResourceCase.data;
    }
    this._data = value;
  }
  get downloadMethod(): string | undefined {
    return this._downloadMethod;
  }
  set downloadMethod(value: string | undefined) {
    if (value !== undefined && value !== null) {
      this._data = undefined;
      this._resource = UploadBinaryRequest.ResourceCase.downloadMethod;
    }
    this._downloadMethod = value;
  }
  get resource() {
    return this._resource;
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
      binary: this.binary ? this.binary.toObject() : undefined,
      data: this.data ? this.data.subarray(0) : new Uint8Array(),
      downloadMethod: this.downloadMethod
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
      binary: this.binary ? this.binary.toProtobufJSON(options) : null,
      data: this.data ? uint8ArrayToBase64(this.data) : '',
      downloadMethod: this.downloadMethod ?? null
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
    data?: Uint8Array;
    downloadMethod?: string;
  }

  /**
   * Protobuf JSON representation for UploadBinaryRequest
   */
  export interface AsProtobufJSON {
    parent?: string;
    binary?: Binary.AsProtobufJSON | null;
    data?: string;
    downloadMethod?: string | null;
  }
  export enum ResourceCase {
    none = 0,
    data = 1,
    downloadMethod = 2
  }
}

/**
 * Message implementation for routeguide.BatchGetBinaryRequest
 */
export class BatchGetBinaryRequest implements GrpcMessage {
  static id = 'routeguide.BatchGetBinaryRequest';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new BatchGetBinaryRequest();
    BatchGetBinaryRequest.deserializeBinaryFromReader(
      instance,
      new BinaryReader(bytes)
    );
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: BatchGetBinaryRequest) {
    _instance.binaryId = _instance.binaryId || [];
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: BatchGetBinaryRequest,
    _reader: BinaryReader
  ) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          (_instance.binaryId = _instance.binaryId || []).push(
            ...(_reader.readPackedInt64String() || [])
          );
          break;
        default:
          _reader.skipField();
      }
    }

    BatchGetBinaryRequest.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(
    _instance: BatchGetBinaryRequest,
    _writer: BinaryWriter
  ) {
    if (_instance.binaryId && _instance.binaryId.length) {
      _writer.writePackedInt64String(1, _instance.binaryId);
    }
  }

  private _binaryId?: string[];

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of BatchGetBinaryRequest to deeply clone from
   */
  constructor(_value?: RecursivePartial<BatchGetBinaryRequest.AsObject>) {
    _value = _value || {};
    this.binaryId = (_value.binaryId || []).slice();
    BatchGetBinaryRequest.refineValues(this);
  }
  get binaryId(): string[] | undefined {
    return this._binaryId;
  }
  set binaryId(value: string[] | undefined) {
    this._binaryId = value;
  }

  /**
   * Serialize message to binary data
   * @param instance message instance
   */
  serializeBinary() {
    const writer = new BinaryWriter();
    BatchGetBinaryRequest.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): BatchGetBinaryRequest.AsObject {
    return {
      binaryId: (this.binaryId || []).slice()
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
  ): BatchGetBinaryRequest.AsProtobufJSON {
    return {
      binaryId: (this.binaryId || []).slice()
    };
  }
}
export module BatchGetBinaryRequest {
  /**
   * Standard JavaScript object representation for BatchGetBinaryRequest
   */
  export interface AsObject {
    binaryId?: string[];
  }

  /**
   * Protobuf JSON representation for BatchGetBinaryRequest
   */
  export interface AsProtobufJSON {
    binaryId?: string[];
  }
}

/**
 * Message implementation for routeguide.BatchGetBinaryResponse
 */
export class BatchGetBinaryResponse implements GrpcMessage {
  static id = 'routeguide.BatchGetBinaryResponse';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new BatchGetBinaryResponse();
    BatchGetBinaryResponse.deserializeBinaryFromReader(
      instance,
      new BinaryReader(bytes)
    );
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: BatchGetBinaryResponse) {
    _instance.binaries = _instance.binaries || [];
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: BatchGetBinaryResponse,
    _reader: BinaryReader
  ) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          const messageInitializer1 = new Binary();
          _reader.readMessage(
            messageInitializer1,
            Binary.deserializeBinaryFromReader
          );
          (_instance.binaries = _instance.binaries || []).push(
            messageInitializer1
          );
          break;
        default:
          _reader.skipField();
      }
    }

    BatchGetBinaryResponse.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(
    _instance: BatchGetBinaryResponse,
    _writer: BinaryWriter
  ) {
    if (_instance.binaries && _instance.binaries.length) {
      _writer.writeRepeatedMessage(
        1,
        _instance.binaries as any,
        Binary.serializeBinaryToWriter
      );
    }
  }

  private _binaries?: Binary[];

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of BatchGetBinaryResponse to deeply clone from
   */
  constructor(_value?: RecursivePartial<BatchGetBinaryResponse.AsObject>) {
    _value = _value || {};
    this.binaries = (_value.binaries || []).map(m => new Binary(m));
    BatchGetBinaryResponse.refineValues(this);
  }
  get binaries(): Binary[] | undefined {
    return this._binaries;
  }
  set binaries(value: Binary[] | undefined) {
    this._binaries = value;
  }

  /**
   * Serialize message to binary data
   * @param instance message instance
   */
  serializeBinary() {
    const writer = new BinaryWriter();
    BatchGetBinaryResponse.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): BatchGetBinaryResponse.AsObject {
    return {
      binaries: (this.binaries || []).map(m => m.toObject())
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
  ): BatchGetBinaryResponse.AsProtobufJSON {
    return {
      binaries: (this.binaries || []).map(m => m.toProtobufJSON(options))
    };
  }
}
export module BatchGetBinaryResponse {
  /**
   * Standard JavaScript object representation for BatchGetBinaryResponse
   */
  export interface AsObject {
    binaries?: Binary.AsObject[];
  }

  /**
   * Protobuf JSON representation for BatchGetBinaryResponse
   */
  export interface AsProtobufJSON {
    binaries?: Binary.AsProtobufJSON[] | null;
  }
}

/**
 * Message implementation for routeguide.DownloadBinaryRequest
 */
export class DownloadBinaryRequest implements GrpcMessage {
  static id = 'routeguide.DownloadBinaryRequest';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new DownloadBinaryRequest();
    DownloadBinaryRequest.deserializeBinaryFromReader(
      instance,
      new BinaryReader(bytes)
    );
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: DownloadBinaryRequest) {
    _instance.parent = _instance.parent || '';
    _instance.binaryId = _instance.binaryId || '0';
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: DownloadBinaryRequest,
    _reader: BinaryReader
  ) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          _instance.parent = _reader.readString();
          break;
        case 2:
          _instance.binaryId = _reader.readInt64String();
          break;
        default:
          _reader.skipField();
      }
    }

    DownloadBinaryRequest.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(
    _instance: DownloadBinaryRequest,
    _writer: BinaryWriter
  ) {
    if (_instance.parent) {
      _writer.writeString(1, _instance.parent);
    }
    if (_instance.binaryId) {
      _writer.writeInt64String(2, _instance.binaryId);
    }
  }

  private _parent?: string;
  private _binaryId?: string;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of DownloadBinaryRequest to deeply clone from
   */
  constructor(_value?: RecursivePartial<DownloadBinaryRequest.AsObject>) {
    _value = _value || {};
    this.parent = _value.parent;
    this.binaryId = _value.binaryId;
    DownloadBinaryRequest.refineValues(this);
  }
  get parent(): string | undefined {
    return this._parent;
  }
  set parent(value: string | undefined) {
    this._parent = value;
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
    DownloadBinaryRequest.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): DownloadBinaryRequest.AsObject {
    return {
      parent: this.parent,
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
  ): DownloadBinaryRequest.AsProtobufJSON {
    return {
      parent: this.parent,
      binaryId: this.binaryId
    };
  }
}
export module DownloadBinaryRequest {
  /**
   * Standard JavaScript object representation for DownloadBinaryRequest
   */
  export interface AsObject {
    parent?: string;
    binaryId?: string;
  }

  /**
   * Protobuf JSON representation for DownloadBinaryRequest
   */
  export interface AsProtobufJSON {
    parent?: string;
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
 * Message implementation for routeguide.ListBinariesRequest
 */
export class ListBinariesRequest implements GrpcMessage {
  static id = 'routeguide.ListBinariesRequest';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new ListBinariesRequest();
    ListBinariesRequest.deserializeBinaryFromReader(
      instance,
      new BinaryReader(bytes)
    );
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: ListBinariesRequest) {
    _instance.packageId = _instance.packageId || '0';
    _instance.pageSize = _instance.pageSize || '0';
    _instance.pageToken = _instance.pageToken || '';
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: ListBinariesRequest,
    _reader: BinaryReader
  ) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          _instance.packageId = _reader.readInt64String();
          break;
        case 2:
          _instance.pageSize = _reader.readInt64String();
          break;
        case 3:
          _instance.pageToken = _reader.readString();
          break;
        default:
          _reader.skipField();
      }
    }

    ListBinariesRequest.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(
    _instance: ListBinariesRequest,
    _writer: BinaryWriter
  ) {
    if (_instance.packageId) {
      _writer.writeInt64String(1, _instance.packageId);
    }
    if (_instance.pageSize) {
      _writer.writeInt64String(2, _instance.pageSize);
    }
    if (_instance.pageToken) {
      _writer.writeString(3, _instance.pageToken);
    }
  }

  private _packageId?: string;
  private _pageSize?: string;
  private _pageToken?: string;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of ListBinariesRequest to deeply clone from
   */
  constructor(_value?: RecursivePartial<ListBinariesRequest.AsObject>) {
    _value = _value || {};
    this.packageId = _value.packageId;
    this.pageSize = _value.pageSize;
    this.pageToken = _value.pageToken;
    ListBinariesRequest.refineValues(this);
  }
  get packageId(): string | undefined {
    return this._packageId;
  }
  set packageId(value: string | undefined) {
    this._packageId = value;
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
    ListBinariesRequest.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): ListBinariesRequest.AsObject {
    return {
      packageId: this.packageId,
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
  ): ListBinariesRequest.AsProtobufJSON {
    return {
      packageId: this.packageId,
      pageSize: this.pageSize,
      pageToken: this.pageToken
    };
  }
}
export module ListBinariesRequest {
  /**
   * Standard JavaScript object representation for ListBinariesRequest
   */
  export interface AsObject {
    packageId?: string;
    pageSize?: string;
    pageToken?: string;
  }

  /**
   * Protobuf JSON representation for ListBinariesRequest
   */
  export interface AsProtobufJSON {
    packageId?: string;
    pageSize?: string;
    pageToken?: string;
  }
}

/**
 * Message implementation for routeguide.ListBinariesResponse
 */
export class ListBinariesResponse implements GrpcMessage {
  static id = 'routeguide.ListBinariesResponse';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new ListBinariesResponse();
    ListBinariesResponse.deserializeBinaryFromReader(
      instance,
      new BinaryReader(bytes)
    );
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: ListBinariesResponse) {
    _instance.binaries = _instance.binaries || [];
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: ListBinariesResponse,
    _reader: BinaryReader
  ) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          const messageInitializer1 = new Binary();
          _reader.readMessage(
            messageInitializer1,
            Binary.deserializeBinaryFromReader
          );
          (_instance.binaries = _instance.binaries || []).push(
            messageInitializer1
          );
          break;
        default:
          _reader.skipField();
      }
    }

    ListBinariesResponse.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(
    _instance: ListBinariesResponse,
    _writer: BinaryWriter
  ) {
    if (_instance.binaries && _instance.binaries.length) {
      _writer.writeRepeatedMessage(
        1,
        _instance.binaries as any,
        Binary.serializeBinaryToWriter
      );
    }
  }

  private _binaries?: Binary[];

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of ListBinariesResponse to deeply clone from
   */
  constructor(_value?: RecursivePartial<ListBinariesResponse.AsObject>) {
    _value = _value || {};
    this.binaries = (_value.binaries || []).map(m => new Binary(m));
    ListBinariesResponse.refineValues(this);
  }
  get binaries(): Binary[] | undefined {
    return this._binaries;
  }
  set binaries(value: Binary[] | undefined) {
    this._binaries = value;
  }

  /**
   * Serialize message to binary data
   * @param instance message instance
   */
  serializeBinary() {
    const writer = new BinaryWriter();
    ListBinariesResponse.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): ListBinariesResponse.AsObject {
    return {
      binaries: (this.binaries || []).map(m => m.toObject())
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
  ): ListBinariesResponse.AsProtobufJSON {
    return {
      binaries: (this.binaries || []).map(m => m.toProtobufJSON(options))
    };
  }
}
export module ListBinariesResponse {
  /**
   * Standard JavaScript object representation for ListBinariesResponse
   */
  export interface AsObject {
    binaries?: Binary.AsObject[];
  }

  /**
   * Protobuf JSON representation for ListBinariesResponse
   */
  export interface AsProtobufJSON {
    binaries?: Binary.AsProtobufJSON[] | null;
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
 * Message implementation for routeguide.CreateCommentRequest
 */
export class CreateCommentRequest implements GrpcMessage {
  static id = 'routeguide.CreateCommentRequest';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new CreateCommentRequest();
    CreateCommentRequest.deserializeBinaryFromReader(
      instance,
      new BinaryReader(bytes)
    );
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: CreateCommentRequest) {
    _instance.comment = _instance.comment || undefined;
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: CreateCommentRequest,
    _reader: BinaryReader
  ) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          _instance.comment = new Comment();
          _reader.readMessage(
            _instance.comment,
            Comment.deserializeBinaryFromReader
          );
          break;
        default:
          _reader.skipField();
      }
    }

    CreateCommentRequest.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(
    _instance: CreateCommentRequest,
    _writer: BinaryWriter
  ) {
    if (_instance.comment) {
      _writer.writeMessage(
        1,
        _instance.comment as any,
        Comment.serializeBinaryToWriter
      );
    }
  }

  private _comment?: Comment;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of CreateCommentRequest to deeply clone from
   */
  constructor(_value?: RecursivePartial<CreateCommentRequest.AsObject>) {
    _value = _value || {};
    this.comment = _value.comment ? new Comment(_value.comment) : undefined;
    CreateCommentRequest.refineValues(this);
  }
  get comment(): Comment | undefined {
    return this._comment;
  }
  set comment(value: Comment | undefined) {
    this._comment = value;
  }

  /**
   * Serialize message to binary data
   * @param instance message instance
   */
  serializeBinary() {
    const writer = new BinaryWriter();
    CreateCommentRequest.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): CreateCommentRequest.AsObject {
    return {
      comment: this.comment ? this.comment.toObject() : undefined
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
  ): CreateCommentRequest.AsProtobufJSON {
    return {
      comment: this.comment ? this.comment.toProtobufJSON(options) : null
    };
  }
}
export module CreateCommentRequest {
  /**
   * Standard JavaScript object representation for CreateCommentRequest
   */
  export interface AsObject {
    comment?: Comment.AsObject;
  }

  /**
   * Protobuf JSON representation for CreateCommentRequest
   */
  export interface AsProtobufJSON {
    comment?: Comment.AsProtobufJSON | null;
  }
}

/**
 * Message implementation for routeguide.DeleteCommentRequest
 */
export class DeleteCommentRequest implements GrpcMessage {
  static id = 'routeguide.DeleteCommentRequest';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new DeleteCommentRequest();
    DeleteCommentRequest.deserializeBinaryFromReader(
      instance,
      new BinaryReader(bytes)
    );
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: DeleteCommentRequest) {
    _instance.commentId = _instance.commentId || '0';
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: DeleteCommentRequest,
    _reader: BinaryReader
  ) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          _instance.commentId = _reader.readInt64String();
          break;
        default:
          _reader.skipField();
      }
    }

    DeleteCommentRequest.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(
    _instance: DeleteCommentRequest,
    _writer: BinaryWriter
  ) {
    if (_instance.commentId) {
      _writer.writeInt64String(1, _instance.commentId);
    }
  }

  private _commentId?: string;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of DeleteCommentRequest to deeply clone from
   */
  constructor(_value?: RecursivePartial<DeleteCommentRequest.AsObject>) {
    _value = _value || {};
    this.commentId = _value.commentId;
    DeleteCommentRequest.refineValues(this);
  }
  get commentId(): string | undefined {
    return this._commentId;
  }
  set commentId(value: string | undefined) {
    this._commentId = value;
  }

  /**
   * Serialize message to binary data
   * @param instance message instance
   */
  serializeBinary() {
    const writer = new BinaryWriter();
    DeleteCommentRequest.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): DeleteCommentRequest.AsObject {
    return {
      commentId: this.commentId
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
  ): DeleteCommentRequest.AsProtobufJSON {
    return {
      commentId: this.commentId
    };
  }
}
export module DeleteCommentRequest {
  /**
   * Standard JavaScript object representation for DeleteCommentRequest
   */
  export interface AsObject {
    commentId?: string;
  }

  /**
   * Protobuf JSON representation for DeleteCommentRequest
   */
  export interface AsProtobufJSON {
    commentId?: string;
  }
}

/**
 * Message implementation for routeguide.UpdateCommentRequest
 */
export class UpdateCommentRequest implements GrpcMessage {
  static id = 'routeguide.UpdateCommentRequest';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new UpdateCommentRequest();
    UpdateCommentRequest.deserializeBinaryFromReader(
      instance,
      new BinaryReader(bytes)
    );
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: UpdateCommentRequest) {
    _instance.comment = _instance.comment || undefined;
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: UpdateCommentRequest,
    _reader: BinaryReader
  ) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          _instance.comment = new Comment();
          _reader.readMessage(
            _instance.comment,
            Comment.deserializeBinaryFromReader
          );
          break;
        default:
          _reader.skipField();
      }
    }

    UpdateCommentRequest.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(
    _instance: UpdateCommentRequest,
    _writer: BinaryWriter
  ) {
    if (_instance.comment) {
      _writer.writeMessage(
        1,
        _instance.comment as any,
        Comment.serializeBinaryToWriter
      );
    }
  }

  private _comment?: Comment;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of UpdateCommentRequest to deeply clone from
   */
  constructor(_value?: RecursivePartial<UpdateCommentRequest.AsObject>) {
    _value = _value || {};
    this.comment = _value.comment ? new Comment(_value.comment) : undefined;
    UpdateCommentRequest.refineValues(this);
  }
  get comment(): Comment | undefined {
    return this._comment;
  }
  set comment(value: Comment | undefined) {
    this._comment = value;
  }

  /**
   * Serialize message to binary data
   * @param instance message instance
   */
  serializeBinary() {
    const writer = new BinaryWriter();
    UpdateCommentRequest.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): UpdateCommentRequest.AsObject {
    return {
      comment: this.comment ? this.comment.toObject() : undefined
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
  ): UpdateCommentRequest.AsProtobufJSON {
    return {
      comment: this.comment ? this.comment.toProtobufJSON(options) : null
    };
  }
}
export module UpdateCommentRequest {
  /**
   * Standard JavaScript object representation for UpdateCommentRequest
   */
  export interface AsObject {
    comment?: Comment.AsObject;
  }

  /**
   * Protobuf JSON representation for UpdateCommentRequest
   */
  export interface AsProtobufJSON {
    comment?: Comment.AsProtobufJSON | null;
  }
}

/**
 * Message implementation for routeguide.ListCommentsRequest
 */
export class ListCommentsRequest implements GrpcMessage {
  static id = 'routeguide.ListCommentsRequest';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new ListCommentsRequest();
    ListCommentsRequest.deserializeBinaryFromReader(
      instance,
      new BinaryReader(bytes)
    );
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: ListCommentsRequest) {
    _instance.parent = _instance.parent || '';
    _instance.pageSize = _instance.pageSize || '0';
    _instance.pageToken = _instance.pageToken || '';
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: ListCommentsRequest,
    _reader: BinaryReader
  ) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          _instance.parent = _reader.readString();
          break;
        case 2:
          _instance.pageSize = _reader.readInt64String();
          break;
        case 3:
          _instance.pageToken = _reader.readString();
          break;
        default:
          _reader.skipField();
      }
    }

    ListCommentsRequest.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(
    _instance: ListCommentsRequest,
    _writer: BinaryWriter
  ) {
    if (_instance.parent) {
      _writer.writeString(1, _instance.parent);
    }
    if (_instance.pageSize) {
      _writer.writeInt64String(2, _instance.pageSize);
    }
    if (_instance.pageToken) {
      _writer.writeString(3, _instance.pageToken);
    }
  }

  private _parent?: string;
  private _pageSize?: string;
  private _pageToken?: string;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of ListCommentsRequest to deeply clone from
   */
  constructor(_value?: RecursivePartial<ListCommentsRequest.AsObject>) {
    _value = _value || {};
    this.parent = _value.parent;
    this.pageSize = _value.pageSize;
    this.pageToken = _value.pageToken;
    ListCommentsRequest.refineValues(this);
  }
  get parent(): string | undefined {
    return this._parent;
  }
  set parent(value: string | undefined) {
    this._parent = value;
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
    ListCommentsRequest.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): ListCommentsRequest.AsObject {
    return {
      parent: this.parent,
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
  ): ListCommentsRequest.AsProtobufJSON {
    return {
      parent: this.parent,
      pageSize: this.pageSize,
      pageToken: this.pageToken
    };
  }
}
export module ListCommentsRequest {
  /**
   * Standard JavaScript object representation for ListCommentsRequest
   */
  export interface AsObject {
    parent?: string;
    pageSize?: string;
    pageToken?: string;
  }

  /**
   * Protobuf JSON representation for ListCommentsRequest
   */
  export interface AsProtobufJSON {
    parent?: string;
    pageSize?: string;
    pageToken?: string;
  }
}

/**
 * Message implementation for routeguide.ListCommentsResponse
 */
export class ListCommentsResponse implements GrpcMessage {
  static id = 'routeguide.ListCommentsResponse';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new ListCommentsResponse();
    ListCommentsResponse.deserializeBinaryFromReader(
      instance,
      new BinaryReader(bytes)
    );
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: ListCommentsResponse) {
    _instance.comments = _instance.comments || [];
    _instance.pageToken = _instance.pageToken || '';
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: ListCommentsResponse,
    _reader: BinaryReader
  ) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          const messageInitializer1 = new Comment();
          _reader.readMessage(
            messageInitializer1,
            Comment.deserializeBinaryFromReader
          );
          (_instance.comments = _instance.comments || []).push(
            messageInitializer1
          );
          break;
        case 2:
          _instance.pageToken = _reader.readString();
          break;
        default:
          _reader.skipField();
      }
    }

    ListCommentsResponse.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(
    _instance: ListCommentsResponse,
    _writer: BinaryWriter
  ) {
    if (_instance.comments && _instance.comments.length) {
      _writer.writeRepeatedMessage(
        1,
        _instance.comments as any,
        Comment.serializeBinaryToWriter
      );
    }
    if (_instance.pageToken) {
      _writer.writeString(2, _instance.pageToken);
    }
  }

  private _comments?: Comment[];
  private _pageToken?: string;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of ListCommentsResponse to deeply clone from
   */
  constructor(_value?: RecursivePartial<ListCommentsResponse.AsObject>) {
    _value = _value || {};
    this.comments = (_value.comments || []).map(m => new Comment(m));
    this.pageToken = _value.pageToken;
    ListCommentsResponse.refineValues(this);
  }
  get comments(): Comment[] | undefined {
    return this._comments;
  }
  set comments(value: Comment[] | undefined) {
    this._comments = value;
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
    ListCommentsResponse.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): ListCommentsResponse.AsObject {
    return {
      comments: (this.comments || []).map(m => m.toObject()),
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
  ): ListCommentsResponse.AsProtobufJSON {
    return {
      comments: (this.comments || []).map(m => m.toProtobufJSON(options)),
      pageToken: this.pageToken
    };
  }
}
export module ListCommentsResponse {
  /**
   * Standard JavaScript object representation for ListCommentsResponse
   */
  export interface AsObject {
    comments?: Comment.AsObject[];
    pageToken?: string;
  }

  /**
   * Protobuf JSON representation for ListCommentsResponse
   */
  export interface AsProtobufJSON {
    comments?: Comment.AsProtobufJSON[] | null;
    pageToken?: string;
  }
}

/**
 * Message implementation for routeguide.CreateReplyRequest
 */
export class CreateReplyRequest implements GrpcMessage {
  static id = 'routeguide.CreateReplyRequest';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new CreateReplyRequest();
    CreateReplyRequest.deserializeBinaryFromReader(
      instance,
      new BinaryReader(bytes)
    );
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: CreateReplyRequest) {
    _instance.reply = _instance.reply || undefined;
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: CreateReplyRequest,
    _reader: BinaryReader
  ) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          _instance.reply = new Reply();
          _reader.readMessage(
            _instance.reply,
            Reply.deserializeBinaryFromReader
          );
          break;
        default:
          _reader.skipField();
      }
    }

    CreateReplyRequest.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(
    _instance: CreateReplyRequest,
    _writer: BinaryWriter
  ) {
    if (_instance.reply) {
      _writer.writeMessage(
        1,
        _instance.reply as any,
        Reply.serializeBinaryToWriter
      );
    }
  }

  private _reply?: Reply;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of CreateReplyRequest to deeply clone from
   */
  constructor(_value?: RecursivePartial<CreateReplyRequest.AsObject>) {
    _value = _value || {};
    this.reply = _value.reply ? new Reply(_value.reply) : undefined;
    CreateReplyRequest.refineValues(this);
  }
  get reply(): Reply | undefined {
    return this._reply;
  }
  set reply(value: Reply | undefined) {
    this._reply = value;
  }

  /**
   * Serialize message to binary data
   * @param instance message instance
   */
  serializeBinary() {
    const writer = new BinaryWriter();
    CreateReplyRequest.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): CreateReplyRequest.AsObject {
    return {
      reply: this.reply ? this.reply.toObject() : undefined
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
  ): CreateReplyRequest.AsProtobufJSON {
    return {
      reply: this.reply ? this.reply.toProtobufJSON(options) : null
    };
  }
}
export module CreateReplyRequest {
  /**
   * Standard JavaScript object representation for CreateReplyRequest
   */
  export interface AsObject {
    reply?: Reply.AsObject;
  }

  /**
   * Protobuf JSON representation for CreateReplyRequest
   */
  export interface AsProtobufJSON {
    reply?: Reply.AsProtobufJSON | null;
  }
}

/**
 * Message implementation for routeguide.DeleteReplyRequest
 */
export class DeleteReplyRequest implements GrpcMessage {
  static id = 'routeguide.DeleteReplyRequest';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new DeleteReplyRequest();
    DeleteReplyRequest.deserializeBinaryFromReader(
      instance,
      new BinaryReader(bytes)
    );
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: DeleteReplyRequest) {
    _instance.replyId = _instance.replyId || '0';
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: DeleteReplyRequest,
    _reader: BinaryReader
  ) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          _instance.replyId = _reader.readInt64String();
          break;
        default:
          _reader.skipField();
      }
    }

    DeleteReplyRequest.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(
    _instance: DeleteReplyRequest,
    _writer: BinaryWriter
  ) {
    if (_instance.replyId) {
      _writer.writeInt64String(1, _instance.replyId);
    }
  }

  private _replyId?: string;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of DeleteReplyRequest to deeply clone from
   */
  constructor(_value?: RecursivePartial<DeleteReplyRequest.AsObject>) {
    _value = _value || {};
    this.replyId = _value.replyId;
    DeleteReplyRequest.refineValues(this);
  }
  get replyId(): string | undefined {
    return this._replyId;
  }
  set replyId(value: string | undefined) {
    this._replyId = value;
  }

  /**
   * Serialize message to binary data
   * @param instance message instance
   */
  serializeBinary() {
    const writer = new BinaryWriter();
    DeleteReplyRequest.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): DeleteReplyRequest.AsObject {
    return {
      replyId: this.replyId
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
  ): DeleteReplyRequest.AsProtobufJSON {
    return {
      replyId: this.replyId
    };
  }
}
export module DeleteReplyRequest {
  /**
   * Standard JavaScript object representation for DeleteReplyRequest
   */
  export interface AsObject {
    replyId?: string;
  }

  /**
   * Protobuf JSON representation for DeleteReplyRequest
   */
  export interface AsProtobufJSON {
    replyId?: string;
  }
}

/**
 * Message implementation for routeguide.UpdateReplyRequest
 */
export class UpdateReplyRequest implements GrpcMessage {
  static id = 'routeguide.UpdateReplyRequest';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new UpdateReplyRequest();
    UpdateReplyRequest.deserializeBinaryFromReader(
      instance,
      new BinaryReader(bytes)
    );
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: UpdateReplyRequest) {
    _instance.reply = _instance.reply || undefined;
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: UpdateReplyRequest,
    _reader: BinaryReader
  ) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          _instance.reply = new Reply();
          _reader.readMessage(
            _instance.reply,
            Reply.deserializeBinaryFromReader
          );
          break;
        default:
          _reader.skipField();
      }
    }

    UpdateReplyRequest.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(
    _instance: UpdateReplyRequest,
    _writer: BinaryWriter
  ) {
    if (_instance.reply) {
      _writer.writeMessage(
        1,
        _instance.reply as any,
        Reply.serializeBinaryToWriter
      );
    }
  }

  private _reply?: Reply;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of UpdateReplyRequest to deeply clone from
   */
  constructor(_value?: RecursivePartial<UpdateReplyRequest.AsObject>) {
    _value = _value || {};
    this.reply = _value.reply ? new Reply(_value.reply) : undefined;
    UpdateReplyRequest.refineValues(this);
  }
  get reply(): Reply | undefined {
    return this._reply;
  }
  set reply(value: Reply | undefined) {
    this._reply = value;
  }

  /**
   * Serialize message to binary data
   * @param instance message instance
   */
  serializeBinary() {
    const writer = new BinaryWriter();
    UpdateReplyRequest.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): UpdateReplyRequest.AsObject {
    return {
      reply: this.reply ? this.reply.toObject() : undefined
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
  ): UpdateReplyRequest.AsProtobufJSON {
    return {
      reply: this.reply ? this.reply.toProtobufJSON(options) : null
    };
  }
}
export module UpdateReplyRequest {
  /**
   * Standard JavaScript object representation for UpdateReplyRequest
   */
  export interface AsObject {
    reply?: Reply.AsObject;
  }

  /**
   * Protobuf JSON representation for UpdateReplyRequest
   */
  export interface AsProtobufJSON {
    reply?: Reply.AsProtobufJSON | null;
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
 * Message implementation for routeguide.UpdateUserRequest
 */
export class UpdateUserRequest implements GrpcMessage {
  static id = 'routeguide.UpdateUserRequest';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new UpdateUserRequest();
    UpdateUserRequest.deserializeBinaryFromReader(
      instance,
      new BinaryReader(bytes)
    );
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: UpdateUserRequest) {
    _instance.user = _instance.user || undefined;
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: UpdateUserRequest,
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

    UpdateUserRequest.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(
    _instance: UpdateUserRequest,
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
   * @param _value initial values object or instance of UpdateUserRequest to deeply clone from
   */
  constructor(_value?: RecursivePartial<UpdateUserRequest.AsObject>) {
    _value = _value || {};
    this.user = _value.user ? new User(_value.user) : undefined;
    UpdateUserRequest.refineValues(this);
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
    UpdateUserRequest.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): UpdateUserRequest.AsObject {
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
  ): UpdateUserRequest.AsProtobufJSON {
    return {
      user: this.user ? this.user.toProtobufJSON(options) : null
    };
  }
}
export module UpdateUserRequest {
  /**
   * Standard JavaScript object representation for UpdateUserRequest
   */
  export interface AsObject {
    user?: User.AsObject;
  }

  /**
   * Protobuf JSON representation for UpdateUserRequest
   */
  export interface AsProtobufJSON {
    user?: User.AsProtobufJSON | null;
  }
}

/**
 * Message implementation for routeguide.UpdatePasswordRequest
 */
export class UpdatePasswordRequest implements GrpcMessage {
  static id = 'routeguide.UpdatePasswordRequest';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new UpdatePasswordRequest();
    UpdatePasswordRequest.deserializeBinaryFromReader(
      instance,
      new BinaryReader(bytes)
    );
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: UpdatePasswordRequest) {
    _instance.userId = _instance.userId || '0';
    _instance.password = _instance.password || '';
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: UpdatePasswordRequest,
    _reader: BinaryReader
  ) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          _instance.userId = _reader.readInt64String();
          break;
        case 2:
          _instance.password = _reader.readString();
          break;
        default:
          _reader.skipField();
      }
    }

    UpdatePasswordRequest.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(
    _instance: UpdatePasswordRequest,
    _writer: BinaryWriter
  ) {
    if (_instance.userId) {
      _writer.writeInt64String(1, _instance.userId);
    }
    if (_instance.password) {
      _writer.writeString(2, _instance.password);
    }
  }

  private _userId?: string;
  private _password?: string;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of UpdatePasswordRequest to deeply clone from
   */
  constructor(_value?: RecursivePartial<UpdatePasswordRequest.AsObject>) {
    _value = _value || {};
    this.userId = _value.userId;
    this.password = _value.password;
    UpdatePasswordRequest.refineValues(this);
  }
  get userId(): string | undefined {
    return this._userId;
  }
  set userId(value: string | undefined) {
    this._userId = value;
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
    UpdatePasswordRequest.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): UpdatePasswordRequest.AsObject {
    return {
      userId: this.userId,
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
  ): UpdatePasswordRequest.AsProtobufJSON {
    return {
      userId: this.userId,
      password: this.password
    };
  }
}
export module UpdatePasswordRequest {
  /**
   * Standard JavaScript object representation for UpdatePasswordRequest
   */
  export interface AsObject {
    userId?: string;
    password?: string;
  }

  /**
   * Protobuf JSON representation for UpdatePasswordRequest
   */
  export interface AsProtobufJSON {
    userId?: string;
    password?: string;
  }
}

/**
 * Message implementation for routeguide.GetStatisticRequest
 */
export class GetStatisticRequest implements GrpcMessage {
  static id = 'routeguide.GetStatisticRequest';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new GetStatisticRequest();
    GetStatisticRequest.deserializeBinaryFromReader(
      instance,
      new BinaryReader(bytes)
    );
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: GetStatisticRequest) {
    _instance.date = _instance.date || '';
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: GetStatisticRequest,
    _reader: BinaryReader
  ) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          _instance.date = _reader.readString();
          break;
        default:
          _reader.skipField();
      }
    }

    GetStatisticRequest.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(
    _instance: GetStatisticRequest,
    _writer: BinaryWriter
  ) {
    if (_instance.date) {
      _writer.writeString(1, _instance.date);
    }
  }

  private _date?: string;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of GetStatisticRequest to deeply clone from
   */
  constructor(_value?: RecursivePartial<GetStatisticRequest.AsObject>) {
    _value = _value || {};
    this.date = _value.date;
    GetStatisticRequest.refineValues(this);
  }
  get date(): string | undefined {
    return this._date;
  }
  set date(value: string | undefined) {
    this._date = value;
  }

  /**
   * Serialize message to binary data
   * @param instance message instance
   */
  serializeBinary() {
    const writer = new BinaryWriter();
    GetStatisticRequest.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): GetStatisticRequest.AsObject {
    return {
      date: this.date
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
  ): GetStatisticRequest.AsProtobufJSON {
    return {
      date: this.date
    };
  }
}
export module GetStatisticRequest {
  /**
   * Standard JavaScript object representation for GetStatisticRequest
   */
  export interface AsObject {
    date?: string;
  }

  /**
   * Protobuf JSON representation for GetStatisticRequest
   */
  export interface AsProtobufJSON {
    date?: string;
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
    _instance.createTimestamp = _instance.createTimestamp || '';
    _instance.categoryId = _instance.categoryId || '0';
    _instance.status = _instance.status || '';
    _instance.authorId = _instance.authorId || '0';
    _instance.authorImageUrl = _instance.authorImageUrl || '';
    _instance.imageUrls = _instance.imageUrls || [];
    _instance.tags = _instance.tags || [];
    _instance.downloadCount = _instance.downloadCount || '0';
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
          _instance.createTimestamp = _reader.readString();
          break;
        case 5:
          _instance.categoryId = _reader.readInt64String();
          break;
        case 6:
          _instance.status = _reader.readString();
          break;
        case 7:
          _instance.authorId = _reader.readInt64String();
          break;
        case 8:
          _instance.authorImageUrl = _reader.readString();
          break;
        case 9:
          (_instance.imageUrls = _instance.imageUrls || []).push(
            _reader.readString()
          );
          break;
        case 10:
          (_instance.tags = _instance.tags || []).push(_reader.readString());
          break;
        case 11:
          _instance.downloadCount = _reader.readInt64String();
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
    if (_instance.createTimestamp) {
      _writer.writeString(4, _instance.createTimestamp);
    }
    if (_instance.categoryId) {
      _writer.writeInt64String(5, _instance.categoryId);
    }
    if (_instance.status) {
      _writer.writeString(6, _instance.status);
    }
    if (_instance.authorId) {
      _writer.writeInt64String(7, _instance.authorId);
    }
    if (_instance.authorImageUrl) {
      _writer.writeString(8, _instance.authorImageUrl);
    }
    if (_instance.imageUrls && _instance.imageUrls.length) {
      _writer.writeRepeatedString(9, _instance.imageUrls);
    }
    if (_instance.tags && _instance.tags.length) {
      _writer.writeRepeatedString(10, _instance.tags);
    }
    if (_instance.downloadCount) {
      _writer.writeInt64String(11, _instance.downloadCount);
    }
  }

  private _packageId?: string;
  private _name?: string;
  private _description?: string;
  private _createTimestamp?: string;
  private _categoryId?: string;
  private _status?: string;
  private _authorId?: string;
  private _authorImageUrl?: string;
  private _imageUrls?: string[];
  private _tags?: string[];
  private _downloadCount?: string;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of Package to deeply clone from
   */
  constructor(_value?: RecursivePartial<Package.AsObject>) {
    _value = _value || {};
    this.packageId = _value.packageId;
    this.name = _value.name;
    this.description = _value.description;
    this.createTimestamp = _value.createTimestamp;
    this.categoryId = _value.categoryId;
    this.status = _value.status;
    this.authorId = _value.authorId;
    this.authorImageUrl = _value.authorImageUrl;
    this.imageUrls = (_value.imageUrls || []).slice();
    this.tags = (_value.tags || []).slice();
    this.downloadCount = _value.downloadCount;
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
  get createTimestamp(): string | undefined {
    return this._createTimestamp;
  }
  set createTimestamp(value: string | undefined) {
    this._createTimestamp = value;
  }
  get categoryId(): string | undefined {
    return this._categoryId;
  }
  set categoryId(value: string | undefined) {
    this._categoryId = value;
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
  get authorImageUrl(): string | undefined {
    return this._authorImageUrl;
  }
  set authorImageUrl(value: string | undefined) {
    this._authorImageUrl = value;
  }
  get imageUrls(): string[] | undefined {
    return this._imageUrls;
  }
  set imageUrls(value: string[] | undefined) {
    this._imageUrls = value;
  }
  get tags(): string[] | undefined {
    return this._tags;
  }
  set tags(value: string[] | undefined) {
    this._tags = value;
  }
  get downloadCount(): string | undefined {
    return this._downloadCount;
  }
  set downloadCount(value: string | undefined) {
    this._downloadCount = value;
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
      createTimestamp: this.createTimestamp,
      categoryId: this.categoryId,
      status: this.status,
      authorId: this.authorId,
      authorImageUrl: this.authorImageUrl,
      imageUrls: (this.imageUrls || []).slice(),
      tags: (this.tags || []).slice(),
      downloadCount: this.downloadCount
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
      createTimestamp: this.createTimestamp,
      categoryId: this.categoryId,
      status: this.status,
      authorId: this.authorId,
      authorImageUrl: this.authorImageUrl,
      imageUrls: (this.imageUrls || []).slice(),
      tags: (this.tags || []).slice(),
      downloadCount: this.downloadCount
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
    createTimestamp?: string;
    categoryId?: string;
    status?: string;
    authorId?: string;
    authorImageUrl?: string;
    imageUrls?: string[];
    tags?: string[];
    downloadCount?: string;
  }

  /**
   * Protobuf JSON representation for Package
   */
  export interface AsProtobufJSON {
    packageId?: string;
    name?: string;
    description?: string;
    createTimestamp?: string;
    categoryId?: string;
    status?: string;
    authorId?: string;
    authorImageUrl?: string;
    imageUrls?: string[];
    tags?: string[];
    downloadCount?: string;
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
    _instance.url = _instance.url || '';
    _instance.downloadMethod = _instance.downloadMethod || '';
    _instance.downloadCount = _instance.downloadCount || '0';
    _instance.version = _instance.version || undefined;
    _instance.description = _instance.description || '';
    _instance.createTimestamp = _instance.createTimestamp || '';
    _instance.tag = _instance.tag || '';
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
          _instance.url = _reader.readString();
          break;
        case 4:
          _instance.downloadMethod = _reader.readString();
          break;
        case 5:
          _instance.downloadCount = _reader.readInt64String();
          break;
        case 6:
          _instance.version = new Version();
          _reader.readMessage(
            _instance.version,
            Version.deserializeBinaryFromReader
          );
          break;
        case 7:
          _instance.description = _reader.readString();
          break;
        case 8:
          _instance.createTimestamp = _reader.readString();
          break;
        case 9:
          _instance.tag = _reader.readString();
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
    if (_instance.url) {
      _writer.writeString(3, _instance.url);
    }
    if (_instance.downloadMethod) {
      _writer.writeString(4, _instance.downloadMethod);
    }
    if (_instance.downloadCount) {
      _writer.writeInt64String(5, _instance.downloadCount);
    }
    if (_instance.version) {
      _writer.writeMessage(
        6,
        _instance.version as any,
        Version.serializeBinaryToWriter
      );
    }
    if (_instance.description) {
      _writer.writeString(7, _instance.description);
    }
    if (_instance.createTimestamp) {
      _writer.writeString(8, _instance.createTimestamp);
    }
    if (_instance.tag) {
      _writer.writeString(9, _instance.tag);
    }
  }

  private _binaryId?: string;
  private _packageId?: string;
  private _url?: string;
  private _downloadMethod?: string;
  private _downloadCount?: string;
  private _version?: Version;
  private _description?: string;
  private _createTimestamp?: string;
  private _tag?: string;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of Binary to deeply clone from
   */
  constructor(_value?: RecursivePartial<Binary.AsObject>) {
    _value = _value || {};
    this.binaryId = _value.binaryId;
    this.packageId = _value.packageId;
    this.url = _value.url;
    this.downloadMethod = _value.downloadMethod;
    this.downloadCount = _value.downloadCount;
    this.version = _value.version ? new Version(_value.version) : undefined;
    this.description = _value.description;
    this.createTimestamp = _value.createTimestamp;
    this.tag = _value.tag;
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
  get url(): string | undefined {
    return this._url;
  }
  set url(value: string | undefined) {
    this._url = value;
  }
  get downloadMethod(): string | undefined {
    return this._downloadMethod;
  }
  set downloadMethod(value: string | undefined) {
    this._downloadMethod = value;
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
  get createTimestamp(): string | undefined {
    return this._createTimestamp;
  }
  set createTimestamp(value: string | undefined) {
    this._createTimestamp = value;
  }
  get tag(): string | undefined {
    return this._tag;
  }
  set tag(value: string | undefined) {
    this._tag = value;
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
      url: this.url,
      downloadMethod: this.downloadMethod,
      downloadCount: this.downloadCount,
      version: this.version ? this.version.toObject() : undefined,
      description: this.description,
      createTimestamp: this.createTimestamp,
      tag: this.tag
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
      url: this.url,
      downloadMethod: this.downloadMethod,
      downloadCount: this.downloadCount,
      version: this.version ? this.version.toProtobufJSON(options) : null,
      description: this.description,
      createTimestamp: this.createTimestamp,
      tag: this.tag
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
    url?: string;
    downloadMethod?: string;
    downloadCount?: string;
    version?: Version.AsObject;
    description?: string;
    createTimestamp?: string;
    tag?: string;
  }

  /**
   * Protobuf JSON representation for Binary
   */
  export interface AsProtobufJSON {
    binaryId?: string;
    packageId?: string;
    url?: string;
    downloadMethod?: string;
    downloadCount?: string;
    version?: Version.AsProtobufJSON | null;
    description?: string;
    createTimestamp?: string;
    tag?: string;
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
    _instance.imageUrl = _instance.imageUrl || '';
    _instance.website = _instance.website || '';
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
          _instance.imageUrl = _reader.readString();
          break;
        case 6:
          _instance.website = _reader.readString();
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
    if (_instance.imageUrl) {
      _writer.writeString(5, _instance.imageUrl);
    }
    if (_instance.website) {
      _writer.writeString(6, _instance.website);
    }
  }

  private _userId?: string;
  private _username?: string;
  private _email?: string;
  private _userType?: string;
  private _imageUrl?: string;
  private _website?: string;

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
    this.imageUrl = _value.imageUrl;
    this.website = _value.website;
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
  get imageUrl(): string | undefined {
    return this._imageUrl;
  }
  set imageUrl(value: string | undefined) {
    this._imageUrl = value;
  }
  get website(): string | undefined {
    return this._website;
  }
  set website(value: string | undefined) {
    this._website = value;
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
      imageUrl: this.imageUrl,
      website: this.website
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
      imageUrl: this.imageUrl,
      website: this.website
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
    imageUrl?: string;
    website?: string;
  }

  /**
   * Protobuf JSON representation for User
   */
  export interface AsProtobufJSON {
    userId?: string;
    username?: string;
    email?: string;
    userType?: string;
    imageUrl?: string;
    website?: string;
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

/**
 * Message implementation for routeguide.Statistic
 */
export class Statistic implements GrpcMessage {
  static id = 'routeguide.Statistic';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new Statistic();
    Statistic.deserializeBinaryFromReader(instance, new BinaryReader(bytes));
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: Statistic) {
    _instance.visitCount = _instance.visitCount || '0';
    _instance.downloadCount = _instance.downloadCount || '0';
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: Statistic,
    _reader: BinaryReader
  ) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          _instance.visitCount = _reader.readInt64String();
          break;
        case 2:
          _instance.downloadCount = _reader.readInt64String();
          break;
        default:
          _reader.skipField();
      }
    }

    Statistic.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(_instance: Statistic, _writer: BinaryWriter) {
    if (_instance.visitCount) {
      _writer.writeInt64String(1, _instance.visitCount);
    }
    if (_instance.downloadCount) {
      _writer.writeInt64String(2, _instance.downloadCount);
    }
  }

  private _visitCount?: string;
  private _downloadCount?: string;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of Statistic to deeply clone from
   */
  constructor(_value?: RecursivePartial<Statistic.AsObject>) {
    _value = _value || {};
    this.visitCount = _value.visitCount;
    this.downloadCount = _value.downloadCount;
    Statistic.refineValues(this);
  }
  get visitCount(): string | undefined {
    return this._visitCount;
  }
  set visitCount(value: string | undefined) {
    this._visitCount = value;
  }
  get downloadCount(): string | undefined {
    return this._downloadCount;
  }
  set downloadCount(value: string | undefined) {
    this._downloadCount = value;
  }

  /**
   * Serialize message to binary data
   * @param instance message instance
   */
  serializeBinary() {
    const writer = new BinaryWriter();
    Statistic.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): Statistic.AsObject {
    return {
      visitCount: this.visitCount,
      downloadCount: this.downloadCount
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
  ): Statistic.AsProtobufJSON {
    return {
      visitCount: this.visitCount,
      downloadCount: this.downloadCount
    };
  }
}
export module Statistic {
  /**
   * Standard JavaScript object representation for Statistic
   */
  export interface AsObject {
    visitCount?: string;
    downloadCount?: string;
  }

  /**
   * Protobuf JSON representation for Statistic
   */
  export interface AsProtobufJSON {
    visitCount?: string;
    downloadCount?: string;
  }
}

/**
 * Message implementation for routeguide.Url
 */
export class Url implements GrpcMessage {
  static id = 'routeguide.Url';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new Url();
    Url.deserializeBinaryFromReader(instance, new BinaryReader(bytes));
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: Url) {
    _instance.url = _instance.url || '';
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(_instance: Url, _reader: BinaryReader) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          _instance.url = _reader.readString();
          break;
        default:
          _reader.skipField();
      }
    }

    Url.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(_instance: Url, _writer: BinaryWriter) {
    if (_instance.url) {
      _writer.writeString(1, _instance.url);
    }
  }

  private _url?: string;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of Url to deeply clone from
   */
  constructor(_value?: RecursivePartial<Url.AsObject>) {
    _value = _value || {};
    this.url = _value.url;
    Url.refineValues(this);
  }
  get url(): string | undefined {
    return this._url;
  }
  set url(value: string | undefined) {
    this._url = value;
  }

  /**
   * Serialize message to binary data
   * @param instance message instance
   */
  serializeBinary() {
    const writer = new BinaryWriter();
    Url.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): Url.AsObject {
    return {
      url: this.url
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
  ): Url.AsProtobufJSON {
    return {
      url: this.url
    };
  }
}
export module Url {
  /**
   * Standard JavaScript object representation for Url
   */
  export interface AsObject {
    url?: string;
  }

  /**
   * Protobuf JSON representation for Url
   */
  export interface AsProtobufJSON {
    url?: string;
  }
}

/**
 * Message implementation for routeguide.Comment
 */
export class Comment implements GrpcMessage {
  static id = 'routeguide.Comment';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new Comment();
    Comment.deserializeBinaryFromReader(instance, new BinaryReader(bytes));
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: Comment) {
    _instance.packageId = _instance.packageId || '0';
    _instance.commentId = _instance.commentId || '0';
    _instance.createTime = _instance.createTime || '';
    _instance.updateTime = _instance.updateTime || '';
    _instance.text = _instance.text || '';
    _instance.authorId = _instance.authorId || '0';
    _instance.upvoteCount = _instance.upvoteCount || '0';
    _instance.replies = _instance.replies || [];
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: Comment,
    _reader: BinaryReader
  ) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          _instance.packageId = _reader.readInt64String();
          break;
        case 2:
          _instance.commentId = _reader.readInt64String();
          break;
        case 3:
          _instance.createTime = _reader.readString();
          break;
        case 4:
          _instance.updateTime = _reader.readString();
          break;
        case 5:
          _instance.text = _reader.readString();
          break;
        case 6:
          _instance.authorId = _reader.readInt64String();
          break;
        case 7:
          _instance.upvoteCount = _reader.readInt64String();
          break;
        case 8:
          const messageInitializer8 = new Reply();
          _reader.readMessage(
            messageInitializer8,
            Reply.deserializeBinaryFromReader
          );
          (_instance.replies = _instance.replies || []).push(
            messageInitializer8
          );
          break;
        default:
          _reader.skipField();
      }
    }

    Comment.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(_instance: Comment, _writer: BinaryWriter) {
    if (_instance.packageId) {
      _writer.writeInt64String(1, _instance.packageId);
    }
    if (_instance.commentId) {
      _writer.writeInt64String(2, _instance.commentId);
    }
    if (_instance.createTime) {
      _writer.writeString(3, _instance.createTime);
    }
    if (_instance.updateTime) {
      _writer.writeString(4, _instance.updateTime);
    }
    if (_instance.text) {
      _writer.writeString(5, _instance.text);
    }
    if (_instance.authorId) {
      _writer.writeInt64String(6, _instance.authorId);
    }
    if (_instance.upvoteCount) {
      _writer.writeInt64String(7, _instance.upvoteCount);
    }
    if (_instance.replies && _instance.replies.length) {
      _writer.writeRepeatedMessage(
        8,
        _instance.replies as any,
        Reply.serializeBinaryToWriter
      );
    }
  }

  private _packageId?: string;
  private _commentId?: string;
  private _createTime?: string;
  private _updateTime?: string;
  private _text?: string;
  private _authorId?: string;
  private _upvoteCount?: string;
  private _replies?: Reply[];

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of Comment to deeply clone from
   */
  constructor(_value?: RecursivePartial<Comment.AsObject>) {
    _value = _value || {};
    this.packageId = _value.packageId;
    this.commentId = _value.commentId;
    this.createTime = _value.createTime;
    this.updateTime = _value.updateTime;
    this.text = _value.text;
    this.authorId = _value.authorId;
    this.upvoteCount = _value.upvoteCount;
    this.replies = (_value.replies || []).map(m => new Reply(m));
    Comment.refineValues(this);
  }
  get packageId(): string | undefined {
    return this._packageId;
  }
  set packageId(value: string | undefined) {
    this._packageId = value;
  }
  get commentId(): string | undefined {
    return this._commentId;
  }
  set commentId(value: string | undefined) {
    this._commentId = value;
  }
  get createTime(): string | undefined {
    return this._createTime;
  }
  set createTime(value: string | undefined) {
    this._createTime = value;
  }
  get updateTime(): string | undefined {
    return this._updateTime;
  }
  set updateTime(value: string | undefined) {
    this._updateTime = value;
  }
  get text(): string | undefined {
    return this._text;
  }
  set text(value: string | undefined) {
    this._text = value;
  }
  get authorId(): string | undefined {
    return this._authorId;
  }
  set authorId(value: string | undefined) {
    this._authorId = value;
  }
  get upvoteCount(): string | undefined {
    return this._upvoteCount;
  }
  set upvoteCount(value: string | undefined) {
    this._upvoteCount = value;
  }
  get replies(): Reply[] | undefined {
    return this._replies;
  }
  set replies(value: Reply[] | undefined) {
    this._replies = value;
  }

  /**
   * Serialize message to binary data
   * @param instance message instance
   */
  serializeBinary() {
    const writer = new BinaryWriter();
    Comment.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): Comment.AsObject {
    return {
      packageId: this.packageId,
      commentId: this.commentId,
      createTime: this.createTime,
      updateTime: this.updateTime,
      text: this.text,
      authorId: this.authorId,
      upvoteCount: this.upvoteCount,
      replies: (this.replies || []).map(m => m.toObject())
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
  ): Comment.AsProtobufJSON {
    return {
      packageId: this.packageId,
      commentId: this.commentId,
      createTime: this.createTime,
      updateTime: this.updateTime,
      text: this.text,
      authorId: this.authorId,
      upvoteCount: this.upvoteCount,
      replies: (this.replies || []).map(m => m.toProtobufJSON(options))
    };
  }
}
export module Comment {
  /**
   * Standard JavaScript object representation for Comment
   */
  export interface AsObject {
    packageId?: string;
    commentId?: string;
    createTime?: string;
    updateTime?: string;
    text?: string;
    authorId?: string;
    upvoteCount?: string;
    replies?: Reply.AsObject[];
  }

  /**
   * Protobuf JSON representation for Comment
   */
  export interface AsProtobufJSON {
    packageId?: string;
    commentId?: string;
    createTime?: string;
    updateTime?: string;
    text?: string;
    authorId?: string;
    upvoteCount?: string;
    replies?: Reply.AsProtobufJSON[] | null;
  }
}

/**
 * Message implementation for routeguide.Reply
 */
export class Reply implements GrpcMessage {
  static id = 'routeguide.Reply';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new Reply();
    Reply.deserializeBinaryFromReader(instance, new BinaryReader(bytes));
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: Reply) {
    _instance.commentId = _instance.commentId || '0';
    _instance.replyId = _instance.replyId || '0';
    _instance.createTime = _instance.createTime || '';
    _instance.updateTime = _instance.updateTime || '';
    _instance.text = _instance.text || '';
    _instance.authorId = _instance.authorId || '0';
    _instance.upvoteCount = _instance.upvoteCount || '0';
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(_instance: Reply, _reader: BinaryReader) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          _instance.commentId = _reader.readInt64String();
          break;
        case 2:
          _instance.replyId = _reader.readInt64String();
          break;
        case 3:
          _instance.createTime = _reader.readString();
          break;
        case 4:
          _instance.updateTime = _reader.readString();
          break;
        case 5:
          _instance.text = _reader.readString();
          break;
        case 6:
          _instance.authorId = _reader.readInt64String();
          break;
        case 7:
          _instance.upvoteCount = _reader.readInt64String();
          break;
        default:
          _reader.skipField();
      }
    }

    Reply.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(_instance: Reply, _writer: BinaryWriter) {
    if (_instance.commentId) {
      _writer.writeInt64String(1, _instance.commentId);
    }
    if (_instance.replyId) {
      _writer.writeInt64String(2, _instance.replyId);
    }
    if (_instance.createTime) {
      _writer.writeString(3, _instance.createTime);
    }
    if (_instance.updateTime) {
      _writer.writeString(4, _instance.updateTime);
    }
    if (_instance.text) {
      _writer.writeString(5, _instance.text);
    }
    if (_instance.authorId) {
      _writer.writeInt64String(6, _instance.authorId);
    }
    if (_instance.upvoteCount) {
      _writer.writeInt64String(7, _instance.upvoteCount);
    }
  }

  private _commentId?: string;
  private _replyId?: string;
  private _createTime?: string;
  private _updateTime?: string;
  private _text?: string;
  private _authorId?: string;
  private _upvoteCount?: string;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of Reply to deeply clone from
   */
  constructor(_value?: RecursivePartial<Reply.AsObject>) {
    _value = _value || {};
    this.commentId = _value.commentId;
    this.replyId = _value.replyId;
    this.createTime = _value.createTime;
    this.updateTime = _value.updateTime;
    this.text = _value.text;
    this.authorId = _value.authorId;
    this.upvoteCount = _value.upvoteCount;
    Reply.refineValues(this);
  }
  get commentId(): string | undefined {
    return this._commentId;
  }
  set commentId(value: string | undefined) {
    this._commentId = value;
  }
  get replyId(): string | undefined {
    return this._replyId;
  }
  set replyId(value: string | undefined) {
    this._replyId = value;
  }
  get createTime(): string | undefined {
    return this._createTime;
  }
  set createTime(value: string | undefined) {
    this._createTime = value;
  }
  get updateTime(): string | undefined {
    return this._updateTime;
  }
  set updateTime(value: string | undefined) {
    this._updateTime = value;
  }
  get text(): string | undefined {
    return this._text;
  }
  set text(value: string | undefined) {
    this._text = value;
  }
  get authorId(): string | undefined {
    return this._authorId;
  }
  set authorId(value: string | undefined) {
    this._authorId = value;
  }
  get upvoteCount(): string | undefined {
    return this._upvoteCount;
  }
  set upvoteCount(value: string | undefined) {
    this._upvoteCount = value;
  }

  /**
   * Serialize message to binary data
   * @param instance message instance
   */
  serializeBinary() {
    const writer = new BinaryWriter();
    Reply.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): Reply.AsObject {
    return {
      commentId: this.commentId,
      replyId: this.replyId,
      createTime: this.createTime,
      updateTime: this.updateTime,
      text: this.text,
      authorId: this.authorId,
      upvoteCount: this.upvoteCount
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
  ): Reply.AsProtobufJSON {
    return {
      commentId: this.commentId,
      replyId: this.replyId,
      createTime: this.createTime,
      updateTime: this.updateTime,
      text: this.text,
      authorId: this.authorId,
      upvoteCount: this.upvoteCount
    };
  }
}
export module Reply {
  /**
   * Standard JavaScript object representation for Reply
   */
  export interface AsObject {
    commentId?: string;
    replyId?: string;
    createTime?: string;
    updateTime?: string;
    text?: string;
    authorId?: string;
    upvoteCount?: string;
  }

  /**
   * Protobuf JSON representation for Reply
   */
  export interface AsProtobufJSON {
    commentId?: string;
    replyId?: string;
    createTime?: string;
    updateTime?: string;
    text?: string;
    authorId?: string;
    upvoteCount?: string;
  }
}
