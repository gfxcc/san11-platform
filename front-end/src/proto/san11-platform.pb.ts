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
import * as googleProtobuf000 from '@ngx-grpc/well-known-types';
export enum ResourceState {
  RESOURCE_STATE_UNSPECIFIED = 0,
  NORMAL = 1,
  UNDER_REVIEW = 2,
  HIDDEN = 3,
  SCHEDULED_DELETE = 4,
  DELETED = 5
}
export enum Action {
  ACTION_UNSPECIFIED = 0,
  CREATE = 1,
  DELETE = 2,
  UPDATE = 3,
  SELECT = 4,
  LIKE = 11,
  UPVOTE = 12,
  SUBSCRIBE = 13,
  DISLIKE = 14,
  DOWNLOAD = 21
}
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
    _instance.parent = _instance.parent || '';
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
          _instance.parent = _reader.readString();
          break;
        case 2:
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
    if (_instance.parent) {
      _writer.writeString(1, _instance.parent);
    }
    if (_instance.package) {
      _writer.writeMessage(
        2,
        _instance.package as any,
        Package.serializeBinaryToWriter
      );
    }
  }

  private _parent?: string;
  private _package?: Package;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of CreatePackageRequest to deeply clone from
   */
  constructor(_value?: RecursivePartial<CreatePackageRequest.AsObject>) {
    _value = _value || {};
    this.parent = _value.parent;
    this.package = _value.package ? new Package(_value.package) : undefined;
    CreatePackageRequest.refineValues(this);
  }
  get parent(): string | undefined {
    return this._parent;
  }
  set parent(value: string | undefined) {
    this._parent = value;
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
      parent: this.parent,
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
      parent: this.parent,
      package: this.package ? this.package.toProtobufJSON(options) : null
    };
  }
}
export module CreatePackageRequest {
  /**
   * Standard JavaScript object representation for CreatePackageRequest
   */
  export interface AsObject {
    parent?: string;
    package?: Package.AsObject;
  }

  /**
   * Protobuf JSON representation for CreatePackageRequest
   */
  export interface AsProtobufJSON {
    parent?: string;
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
    _instance.name = _instance.name || '';
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
          _instance.name = _reader.readString();
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
    if (_instance.name) {
      _writer.writeString(1, _instance.name);
    }
  }

  private _name?: string;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of GetPackageRequest to deeply clone from
   */
  constructor(_value?: RecursivePartial<GetPackageRequest.AsObject>) {
    _value = _value || {};
    this.name = _value.name;
    GetPackageRequest.refineValues(this);
  }
  get name(): string | undefined {
    return this._name;
  }
  set name(value: string | undefined) {
    this._name = value;
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
      name: this.name
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
      name: this.name
    };
  }
}
export module GetPackageRequest {
  /**
   * Standard JavaScript object representation for GetPackageRequest
   */
  export interface AsObject {
    name?: string;
  }

  /**
   * Protobuf JSON representation for GetPackageRequest
   */
  export interface AsProtobufJSON {
    name?: string;
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
    _instance.updateMask = _instance.updateMask || undefined;
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
        case 2:
          _instance.updateMask = new FieldMask();
          _reader.readMessage(
            _instance.updateMask,
            FieldMask.deserializeBinaryFromReader
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
    if (_instance.updateMask) {
      _writer.writeMessage(
        2,
        _instance.updateMask as any,
        FieldMask.serializeBinaryToWriter
      );
    }
  }

  private _package?: Package;
  private _updateMask?: FieldMask;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of UpdatePackageRequest to deeply clone from
   */
  constructor(_value?: RecursivePartial<UpdatePackageRequest.AsObject>) {
    _value = _value || {};
    this.package = _value.package ? new Package(_value.package) : undefined;
    this.updateMask = _value.updateMask
      ? new FieldMask(_value.updateMask)
      : undefined;
    UpdatePackageRequest.refineValues(this);
  }
  get package(): Package | undefined {
    return this._package;
  }
  set package(value: Package | undefined) {
    this._package = value;
  }
  get updateMask(): FieldMask | undefined {
    return this._updateMask;
  }
  set updateMask(value: FieldMask | undefined) {
    this._updateMask = value;
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
      package: this.package ? this.package.toObject() : undefined,
      updateMask: this.updateMask ? this.updateMask.toObject() : undefined
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
      package: this.package ? this.package.toProtobufJSON(options) : null,
      updateMask: this.updateMask
        ? this.updateMask.toProtobufJSON(options)
        : null
    };
  }
}
export module UpdatePackageRequest {
  /**
   * Standard JavaScript object representation for UpdatePackageRequest
   */
  export interface AsObject {
    package?: Package.AsObject;
    updateMask?: FieldMask.AsObject;
  }

  /**
   * Protobuf JSON representation for UpdatePackageRequest
   */
  export interface AsProtobufJSON {
    package?: Package.AsProtobufJSON | null;
    updateMask?: FieldMask.AsProtobufJSON | null;
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
    _instance.name = _instance.name || '';
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
          _instance.name = _reader.readString();
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
    if (_instance.name) {
      _writer.writeString(1, _instance.name);
    }
  }

  private _name?: string;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of DeletePackageRequest to deeply clone from
   */
  constructor(_value?: RecursivePartial<DeletePackageRequest.AsObject>) {
    _value = _value || {};
    this.name = _value.name;
    DeletePackageRequest.refineValues(this);
  }
  get name(): string | undefined {
    return this._name;
  }
  set name(value: string | undefined) {
    this._name = value;
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
      name: this.name
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
      name: this.name
    };
  }
}
export module DeletePackageRequest {
  /**
   * Standard JavaScript object representation for DeletePackageRequest
   */
  export interface AsObject {
    name?: string;
  }

  /**
   * Protobuf JSON representation for DeletePackageRequest
   */
  export interface AsProtobufJSON {
    name?: string;
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
    _instance.parent = _instance.parent || '';
    _instance.pageSize = _instance.pageSize || '0';
    _instance.pageToken = _instance.pageToken || '';
    _instance.orderBy = _instance.orderBy || '';
    _instance.filter = _instance.filter || '';
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
          _instance.parent = _reader.readString();
          break;
        case 2:
          _instance.pageSize = _reader.readInt64String();
          break;
        case 3:
          _instance.pageToken = _reader.readString();
          break;
        case 4:
          _instance.orderBy = _reader.readString();
          break;
        case 5:
          _instance.filter = _reader.readString();
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
    if (_instance.parent) {
      _writer.writeString(1, _instance.parent);
    }
    if (_instance.pageSize) {
      _writer.writeInt64String(2, _instance.pageSize);
    }
    if (_instance.pageToken) {
      _writer.writeString(3, _instance.pageToken);
    }
    if (_instance.orderBy) {
      _writer.writeString(4, _instance.orderBy);
    }
    if (_instance.filter) {
      _writer.writeString(5, _instance.filter);
    }
  }

  private _parent?: string;
  private _pageSize?: string;
  private _pageToken?: string;
  private _orderBy?: string;
  private _filter?: string;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of ListPackagesRequest to deeply clone from
   */
  constructor(_value?: RecursivePartial<ListPackagesRequest.AsObject>) {
    _value = _value || {};
    this.parent = _value.parent;
    this.pageSize = _value.pageSize;
    this.pageToken = _value.pageToken;
    this.orderBy = _value.orderBy;
    this.filter = _value.filter;
    ListPackagesRequest.refineValues(this);
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
  get orderBy(): string | undefined {
    return this._orderBy;
  }
  set orderBy(value: string | undefined) {
    this._orderBy = value;
  }
  get filter(): string | undefined {
    return this._filter;
  }
  set filter(value: string | undefined) {
    this._filter = value;
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
      parent: this.parent,
      pageSize: this.pageSize,
      pageToken: this.pageToken,
      orderBy: this.orderBy,
      filter: this.filter
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
      parent: this.parent,
      pageSize: this.pageSize,
      pageToken: this.pageToken,
      orderBy: this.orderBy,
      filter: this.filter
    };
  }
}
export module ListPackagesRequest {
  /**
   * Standard JavaScript object representation for ListPackagesRequest
   */
  export interface AsObject {
    parent?: string;
    pageSize?: string;
    pageToken?: string;
    orderBy?: string;
    filter?: string;
  }

  /**
   * Protobuf JSON representation for ListPackagesRequest
   */
  export interface AsProtobufJSON {
    parent?: string;
    pageSize?: string;
    pageToken?: string;
    orderBy?: string;
    filter?: string;
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
    _instance.name = _instance.name || '';
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
          _instance.name = _reader.readString();
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
    if (_instance.name) {
      _writer.writeString(1, _instance.name);
    }
  }

  private _name?: string;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of GetBinaryRequest to deeply clone from
   */
  constructor(_value?: RecursivePartial<GetBinaryRequest.AsObject>) {
    _value = _value || {};
    this.name = _value.name;
    GetBinaryRequest.refineValues(this);
  }
  get name(): string | undefined {
    return this._name;
  }
  set name(value: string | undefined) {
    this._name = value;
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
      name: this.name
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
      name: this.name
    };
  }
}
export module GetBinaryRequest {
  /**
   * Standard JavaScript object representation for GetBinaryRequest
   */
  export interface AsObject {
    name?: string;
  }

  /**
   * Protobuf JSON representation for GetBinaryRequest
   */
  export interface AsProtobufJSON {
    name?: string;
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

    _instance.sireVersion = _instance.sireVersion || '0';
    _instance.sireAutoConvert = _instance.sireAutoConvert || false;
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
        case 7:
          _instance.url = _reader.readString();
          break;
        case 5:
          _instance.sireVersion = _reader.readInt64String();
          break;
        case 6:
          _instance.sireAutoConvert = _reader.readBool();
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
    if (_instance.url || _instance.url === '') {
      _writer.writeString(7, _instance.url);
    }
    if (_instance.sireVersion) {
      _writer.writeInt64String(5, _instance.sireVersion);
    }
    if (_instance.sireAutoConvert) {
      _writer.writeBool(6, _instance.sireAutoConvert);
    }
  }

  private _parent?: string;
  private _binary?: Binary;
  private _data?: Uint8Array;
  private _downloadMethod?: string;
  private _url?: string;
  private _sireVersion?: string;
  private _sireAutoConvert?: boolean;

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
    this.url = _value.url;
    this.sireVersion = _value.sireVersion;
    this.sireAutoConvert = _value.sireAutoConvert;
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
      this._downloadMethod = this._url = undefined;
      this._resource = UploadBinaryRequest.ResourceCase.data;
    }
    this._data = value;
  }
  get downloadMethod(): string | undefined {
    return this._downloadMethod;
  }
  set downloadMethod(value: string | undefined) {
    if (value !== undefined && value !== null) {
      this._data = this._url = undefined;
      this._resource = UploadBinaryRequest.ResourceCase.downloadMethod;
    }
    this._downloadMethod = value;
  }
  get url(): string | undefined {
    return this._url;
  }
  set url(value: string | undefined) {
    if (value !== undefined && value !== null) {
      this._data = this._downloadMethod = undefined;
      this._resource = UploadBinaryRequest.ResourceCase.url;
    }
    this._url = value;
  }
  get sireVersion(): string | undefined {
    return this._sireVersion;
  }
  set sireVersion(value: string | undefined) {
    this._sireVersion = value;
  }
  get sireAutoConvert(): boolean | undefined {
    return this._sireAutoConvert;
  }
  set sireAutoConvert(value: boolean | undefined) {
    this._sireAutoConvert = value;
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
      downloadMethod: this.downloadMethod,
      url: this.url,
      sireVersion: this.sireVersion,
      sireAutoConvert: this.sireAutoConvert
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
      downloadMethod: this.downloadMethod ?? null,
      url: this.url ?? null,
      sireVersion: this.sireVersion,
      sireAutoConvert: this.sireAutoConvert
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
    url?: string;
    sireVersion?: string;
    sireAutoConvert?: boolean;
  }

  /**
   * Protobuf JSON representation for UploadBinaryRequest
   */
  export interface AsProtobufJSON {
    parent?: string;
    binary?: Binary.AsProtobufJSON | null;
    data?: string;
    downloadMethod?: string | null;
    url?: string | null;
    sireVersion?: string;
    sireAutoConvert?: boolean;
  }
  export enum ResourceCase {
    none = 0,
    data = 1,
    downloadMethod = 2,
    url = 3
  }
}

/**
 * Message implementation for routeguide.CreateBinaryRequest
 */
export class CreateBinaryRequest implements GrpcMessage {
  static id = 'routeguide.CreateBinaryRequest';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new CreateBinaryRequest();
    CreateBinaryRequest.deserializeBinaryFromReader(
      instance,
      new BinaryReader(bytes)
    );
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: CreateBinaryRequest) {
    _instance.parent = _instance.parent || '';
    _instance.binary = _instance.binary || undefined;
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: CreateBinaryRequest,
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

    CreateBinaryRequest.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(
    _instance: CreateBinaryRequest,
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
   * @param _value initial values object or instance of CreateBinaryRequest to deeply clone from
   */
  constructor(_value?: RecursivePartial<CreateBinaryRequest.AsObject>) {
    _value = _value || {};
    this.parent = _value.parent;
    this.binary = _value.binary ? new Binary(_value.binary) : undefined;
    CreateBinaryRequest.refineValues(this);
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
    CreateBinaryRequest.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): CreateBinaryRequest.AsObject {
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
  ): CreateBinaryRequest.AsProtobufJSON {
    return {
      parent: this.parent,
      binary: this.binary ? this.binary.toProtobufJSON(options) : null
    };
  }
}
export module CreateBinaryRequest {
  /**
   * Standard JavaScript object representation for CreateBinaryRequest
   */
  export interface AsObject {
    parent?: string;
    binary?: Binary.AsObject;
  }

  /**
   * Protobuf JSON representation for CreateBinaryRequest
   */
  export interface AsProtobufJSON {
    parent?: string;
    binary?: Binary.AsProtobufJSON | null;
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
    _instance.name = _instance.name || '';
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
          _instance.name = _reader.readString();
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
    if (_instance.name) {
      _writer.writeString(1, _instance.name);
    }
  }

  private _name?: string;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of DownloadBinaryRequest to deeply clone from
   */
  constructor(_value?: RecursivePartial<DownloadBinaryRequest.AsObject>) {
    _value = _value || {};
    this.name = _value.name;
    DownloadBinaryRequest.refineValues(this);
  }
  get name(): string | undefined {
    return this._name;
  }
  set name(value: string | undefined) {
    this._name = value;
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
      name: this.name
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
      name: this.name
    };
  }
}
export module DownloadBinaryRequest {
  /**
   * Standard JavaScript object representation for DownloadBinaryRequest
   */
  export interface AsObject {
    name?: string;
  }

  /**
   * Protobuf JSON representation for DownloadBinaryRequest
   */
  export interface AsProtobufJSON {
    name?: string;
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
    _instance.name = _instance.name || '';
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
          _instance.name = _reader.readString();
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
    if (_instance.name) {
      _writer.writeString(1, _instance.name);
    }
  }

  private _name?: string;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of DeleteBinaryRequest to deeply clone from
   */
  constructor(_value?: RecursivePartial<DeleteBinaryRequest.AsObject>) {
    _value = _value || {};
    this.name = _value.name;
    DeleteBinaryRequest.refineValues(this);
  }
  get name(): string | undefined {
    return this._name;
  }
  set name(value: string | undefined) {
    this._name = value;
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
      name: this.name
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
      name: this.name
    };
  }
}
export module DeleteBinaryRequest {
  /**
   * Standard JavaScript object representation for DeleteBinaryRequest
   */
  export interface AsObject {
    name?: string;
  }

  /**
   * Protobuf JSON representation for DeleteBinaryRequest
   */
  export interface AsProtobufJSON {
    name?: string;
  }
}

/**
 * Message implementation for routeguide.UpdateBinaryRequest
 */
export class UpdateBinaryRequest implements GrpcMessage {
  static id = 'routeguide.UpdateBinaryRequest';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new UpdateBinaryRequest();
    UpdateBinaryRequest.deserializeBinaryFromReader(
      instance,
      new BinaryReader(bytes)
    );
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: UpdateBinaryRequest) {
    _instance.binary = _instance.binary || undefined;
    _instance.updateMask = _instance.updateMask || undefined;
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: UpdateBinaryRequest,
    _reader: BinaryReader
  ) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          _instance.binary = new Binary();
          _reader.readMessage(
            _instance.binary,
            Binary.deserializeBinaryFromReader
          );
          break;
        case 2:
          _instance.updateMask = new FieldMask();
          _reader.readMessage(
            _instance.updateMask,
            FieldMask.deserializeBinaryFromReader
          );
          break;
        default:
          _reader.skipField();
      }
    }

    UpdateBinaryRequest.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(
    _instance: UpdateBinaryRequest,
    _writer: BinaryWriter
  ) {
    if (_instance.binary) {
      _writer.writeMessage(
        1,
        _instance.binary as any,
        Binary.serializeBinaryToWriter
      );
    }
    if (_instance.updateMask) {
      _writer.writeMessage(
        2,
        _instance.updateMask as any,
        FieldMask.serializeBinaryToWriter
      );
    }
  }

  private _binary?: Binary;
  private _updateMask?: FieldMask;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of UpdateBinaryRequest to deeply clone from
   */
  constructor(_value?: RecursivePartial<UpdateBinaryRequest.AsObject>) {
    _value = _value || {};
    this.binary = _value.binary ? new Binary(_value.binary) : undefined;
    this.updateMask = _value.updateMask
      ? new FieldMask(_value.updateMask)
      : undefined;
    UpdateBinaryRequest.refineValues(this);
  }
  get binary(): Binary | undefined {
    return this._binary;
  }
  set binary(value: Binary | undefined) {
    this._binary = value;
  }
  get updateMask(): FieldMask | undefined {
    return this._updateMask;
  }
  set updateMask(value: FieldMask | undefined) {
    this._updateMask = value;
  }

  /**
   * Serialize message to binary data
   * @param instance message instance
   */
  serializeBinary() {
    const writer = new BinaryWriter();
    UpdateBinaryRequest.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): UpdateBinaryRequest.AsObject {
    return {
      binary: this.binary ? this.binary.toObject() : undefined,
      updateMask: this.updateMask ? this.updateMask.toObject() : undefined
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
  ): UpdateBinaryRequest.AsProtobufJSON {
    return {
      binary: this.binary ? this.binary.toProtobufJSON(options) : null,
      updateMask: this.updateMask
        ? this.updateMask.toProtobufJSON(options)
        : null
    };
  }
}
export module UpdateBinaryRequest {
  /**
   * Standard JavaScript object representation for UpdateBinaryRequest
   */
  export interface AsObject {
    binary?: Binary.AsObject;
    updateMask?: FieldMask.AsObject;
  }

  /**
   * Protobuf JSON representation for UpdateBinaryRequest
   */
  export interface AsProtobufJSON {
    binary?: Binary.AsProtobufJSON | null;
    updateMask?: FieldMask.AsProtobufJSON | null;
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
    _instance.parent = _instance.parent || '';
    _instance.pageSize = _instance.pageSize || '0';
    _instance.pageToken = _instance.pageToken || '';
    _instance.orderBy = _instance.orderBy || '';
    _instance.filter = _instance.filter || '';
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
          _instance.parent = _reader.readString();
          break;
        case 2:
          _instance.pageSize = _reader.readInt64String();
          break;
        case 3:
          _instance.pageToken = _reader.readString();
          break;
        case 4:
          _instance.orderBy = _reader.readString();
          break;
        case 5:
          _instance.filter = _reader.readString();
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
    if (_instance.parent) {
      _writer.writeString(1, _instance.parent);
    }
    if (_instance.pageSize) {
      _writer.writeInt64String(2, _instance.pageSize);
    }
    if (_instance.pageToken) {
      _writer.writeString(3, _instance.pageToken);
    }
    if (_instance.orderBy) {
      _writer.writeString(4, _instance.orderBy);
    }
    if (_instance.filter) {
      _writer.writeString(5, _instance.filter);
    }
  }

  private _parent?: string;
  private _pageSize?: string;
  private _pageToken?: string;
  private _orderBy?: string;
  private _filter?: string;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of ListBinariesRequest to deeply clone from
   */
  constructor(_value?: RecursivePartial<ListBinariesRequest.AsObject>) {
    _value = _value || {};
    this.parent = _value.parent;
    this.pageSize = _value.pageSize;
    this.pageToken = _value.pageToken;
    this.orderBy = _value.orderBy;
    this.filter = _value.filter;
    ListBinariesRequest.refineValues(this);
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
  get orderBy(): string | undefined {
    return this._orderBy;
  }
  set orderBy(value: string | undefined) {
    this._orderBy = value;
  }
  get filter(): string | undefined {
    return this._filter;
  }
  set filter(value: string | undefined) {
    this._filter = value;
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
      parent: this.parent,
      pageSize: this.pageSize,
      pageToken: this.pageToken,
      orderBy: this.orderBy,
      filter: this.filter
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
      parent: this.parent,
      pageSize: this.pageSize,
      pageToken: this.pageToken,
      orderBy: this.orderBy,
      filter: this.filter
    };
  }
}
export module ListBinariesRequest {
  /**
   * Standard JavaScript object representation for ListBinariesRequest
   */
  export interface AsObject {
    parent?: string;
    pageSize?: string;
    pageToken?: string;
    orderBy?: string;
    filter?: string;
  }

  /**
   * Protobuf JSON representation for ListBinariesRequest
   */
  export interface AsProtobufJSON {
    parent?: string;
    pageSize?: string;
    pageToken?: string;
    orderBy?: string;
    filter?: string;
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
    _instance.nextPageToken = _instance.nextPageToken || '';
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
        case 2:
          _instance.nextPageToken = _reader.readString();
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
    if (_instance.nextPageToken) {
      _writer.writeString(2, _instance.nextPageToken);
    }
  }

  private _binaries?: Binary[];
  private _nextPageToken?: string;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of ListBinariesResponse to deeply clone from
   */
  constructor(_value?: RecursivePartial<ListBinariesResponse.AsObject>) {
    _value = _value || {};
    this.binaries = (_value.binaries || []).map(m => new Binary(m));
    this.nextPageToken = _value.nextPageToken;
    ListBinariesResponse.refineValues(this);
  }
  get binaries(): Binary[] | undefined {
    return this._binaries;
  }
  set binaries(value: Binary[] | undefined) {
    this._binaries = value;
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
    ListBinariesResponse.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): ListBinariesResponse.AsObject {
    return {
      binaries: (this.binaries || []).map(m => m.toObject()),
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
  ): ListBinariesResponse.AsProtobufJSON {
    return {
      binaries: (this.binaries || []).map(m => m.toProtobufJSON(options)),
      nextPageToken: this.nextPageToken
    };
  }
}
export module ListBinariesResponse {
  /**
   * Standard JavaScript object representation for ListBinariesResponse
   */
  export interface AsObject {
    binaries?: Binary.AsObject[];
    nextPageToken?: string;
  }

  /**
   * Protobuf JSON representation for ListBinariesResponse
   */
  export interface AsProtobufJSON {
    binaries?: Binary.AsProtobufJSON[] | null;
    nextPageToken?: string;
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
 * Message implementation for routeguide.CreateImageRequest
 */
export class CreateImageRequest implements GrpcMessage {
  static id = 'routeguide.CreateImageRequest';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new CreateImageRequest();
    CreateImageRequest.deserializeBinaryFromReader(
      instance,
      new BinaryReader(bytes)
    );
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: CreateImageRequest) {
    _instance.parent = _instance.parent || '';
    _instance.url = _instance.url || '';
    _instance.inDescription = _instance.inDescription || false;
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: CreateImageRequest,
    _reader: BinaryReader
  ) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          _instance.parent = _reader.readString();
          break;
        case 2:
          _instance.url = _reader.readString();
          break;
        case 3:
          _instance.inDescription = _reader.readBool();
          break;
        default:
          _reader.skipField();
      }
    }

    CreateImageRequest.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(
    _instance: CreateImageRequest,
    _writer: BinaryWriter
  ) {
    if (_instance.parent) {
      _writer.writeString(1, _instance.parent);
    }
    if (_instance.url) {
      _writer.writeString(2, _instance.url);
    }
    if (_instance.inDescription) {
      _writer.writeBool(3, _instance.inDescription);
    }
  }

  private _parent?: string;
  private _url?: string;
  private _inDescription?: boolean;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of CreateImageRequest to deeply clone from
   */
  constructor(_value?: RecursivePartial<CreateImageRequest.AsObject>) {
    _value = _value || {};
    this.parent = _value.parent;
    this.url = _value.url;
    this.inDescription = _value.inDescription;
    CreateImageRequest.refineValues(this);
  }
  get parent(): string | undefined {
    return this._parent;
  }
  set parent(value: string | undefined) {
    this._parent = value;
  }
  get url(): string | undefined {
    return this._url;
  }
  set url(value: string | undefined) {
    this._url = value;
  }
  get inDescription(): boolean | undefined {
    return this._inDescription;
  }
  set inDescription(value: boolean | undefined) {
    this._inDescription = value;
  }

  /**
   * Serialize message to binary data
   * @param instance message instance
   */
  serializeBinary() {
    const writer = new BinaryWriter();
    CreateImageRequest.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): CreateImageRequest.AsObject {
    return {
      parent: this.parent,
      url: this.url,
      inDescription: this.inDescription
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
  ): CreateImageRequest.AsProtobufJSON {
    return {
      parent: this.parent,
      url: this.url,
      inDescription: this.inDescription
    };
  }
}
export module CreateImageRequest {
  /**
   * Standard JavaScript object representation for CreateImageRequest
   */
  export interface AsObject {
    parent?: string;
    url?: string;
    inDescription?: boolean;
  }

  /**
   * Protobuf JSON representation for CreateImageRequest
   */
  export interface AsProtobufJSON {
    parent?: string;
    url?: string;
    inDescription?: boolean;
  }
}

/**
 * Message implementation for routeguide.CreateThreadRequest
 */
export class CreateThreadRequest implements GrpcMessage {
  static id = 'routeguide.CreateThreadRequest';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new CreateThreadRequest();
    CreateThreadRequest.deserializeBinaryFromReader(
      instance,
      new BinaryReader(bytes)
    );
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: CreateThreadRequest) {
    _instance.parent = _instance.parent || '';
    _instance.thread = _instance.thread || undefined;
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: CreateThreadRequest,
    _reader: BinaryReader
  ) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          _instance.parent = _reader.readString();
          break;
        case 2:
          _instance.thread = new Thread();
          _reader.readMessage(
            _instance.thread,
            Thread.deserializeBinaryFromReader
          );
          break;
        default:
          _reader.skipField();
      }
    }

    CreateThreadRequest.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(
    _instance: CreateThreadRequest,
    _writer: BinaryWriter
  ) {
    if (_instance.parent) {
      _writer.writeString(1, _instance.parent);
    }
    if (_instance.thread) {
      _writer.writeMessage(
        2,
        _instance.thread as any,
        Thread.serializeBinaryToWriter
      );
    }
  }

  private _parent?: string;
  private _thread?: Thread;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of CreateThreadRequest to deeply clone from
   */
  constructor(_value?: RecursivePartial<CreateThreadRequest.AsObject>) {
    _value = _value || {};
    this.parent = _value.parent;
    this.thread = _value.thread ? new Thread(_value.thread) : undefined;
    CreateThreadRequest.refineValues(this);
  }
  get parent(): string | undefined {
    return this._parent;
  }
  set parent(value: string | undefined) {
    this._parent = value;
  }
  get thread(): Thread | undefined {
    return this._thread;
  }
  set thread(value: Thread | undefined) {
    this._thread = value;
  }

  /**
   * Serialize message to binary data
   * @param instance message instance
   */
  serializeBinary() {
    const writer = new BinaryWriter();
    CreateThreadRequest.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): CreateThreadRequest.AsObject {
    return {
      parent: this.parent,
      thread: this.thread ? this.thread.toObject() : undefined
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
  ): CreateThreadRequest.AsProtobufJSON {
    return {
      parent: this.parent,
      thread: this.thread ? this.thread.toProtobufJSON(options) : null
    };
  }
}
export module CreateThreadRequest {
  /**
   * Standard JavaScript object representation for CreateThreadRequest
   */
  export interface AsObject {
    parent?: string;
    thread?: Thread.AsObject;
  }

  /**
   * Protobuf JSON representation for CreateThreadRequest
   */
  export interface AsProtobufJSON {
    parent?: string;
    thread?: Thread.AsProtobufJSON | null;
  }
}

/**
 * Message implementation for routeguide.GetThreadRequest
 */
export class GetThreadRequest implements GrpcMessage {
  static id = 'routeguide.GetThreadRequest';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new GetThreadRequest();
    GetThreadRequest.deserializeBinaryFromReader(
      instance,
      new BinaryReader(bytes)
    );
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: GetThreadRequest) {
    _instance.name = _instance.name || '';
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: GetThreadRequest,
    _reader: BinaryReader
  ) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          _instance.name = _reader.readString();
          break;
        default:
          _reader.skipField();
      }
    }

    GetThreadRequest.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(
    _instance: GetThreadRequest,
    _writer: BinaryWriter
  ) {
    if (_instance.name) {
      _writer.writeString(1, _instance.name);
    }
  }

  private _name?: string;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of GetThreadRequest to deeply clone from
   */
  constructor(_value?: RecursivePartial<GetThreadRequest.AsObject>) {
    _value = _value || {};
    this.name = _value.name;
    GetThreadRequest.refineValues(this);
  }
  get name(): string | undefined {
    return this._name;
  }
  set name(value: string | undefined) {
    this._name = value;
  }

  /**
   * Serialize message to binary data
   * @param instance message instance
   */
  serializeBinary() {
    const writer = new BinaryWriter();
    GetThreadRequest.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): GetThreadRequest.AsObject {
    return {
      name: this.name
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
  ): GetThreadRequest.AsProtobufJSON {
    return {
      name: this.name
    };
  }
}
export module GetThreadRequest {
  /**
   * Standard JavaScript object representation for GetThreadRequest
   */
  export interface AsObject {
    name?: string;
  }

  /**
   * Protobuf JSON representation for GetThreadRequest
   */
  export interface AsProtobufJSON {
    name?: string;
  }
}

/**
 * Message implementation for routeguide.ListThreadsRequest
 */
export class ListThreadsRequest implements GrpcMessage {
  static id = 'routeguide.ListThreadsRequest';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new ListThreadsRequest();
    ListThreadsRequest.deserializeBinaryFromReader(
      instance,
      new BinaryReader(bytes)
    );
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: ListThreadsRequest) {
    _instance.parent = _instance.parent || '';
    _instance.pageSize = _instance.pageSize || '0';
    _instance.pageToken = _instance.pageToken || '';
    _instance.orderBy = _instance.orderBy || '';
    _instance.filter = _instance.filter || '';
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: ListThreadsRequest,
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
        case 4:
          _instance.orderBy = _reader.readString();
          break;
        case 5:
          _instance.filter = _reader.readString();
          break;
        default:
          _reader.skipField();
      }
    }

    ListThreadsRequest.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(
    _instance: ListThreadsRequest,
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
    if (_instance.orderBy) {
      _writer.writeString(4, _instance.orderBy);
    }
    if (_instance.filter) {
      _writer.writeString(5, _instance.filter);
    }
  }

  private _parent?: string;
  private _pageSize?: string;
  private _pageToken?: string;
  private _orderBy?: string;
  private _filter?: string;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of ListThreadsRequest to deeply clone from
   */
  constructor(_value?: RecursivePartial<ListThreadsRequest.AsObject>) {
    _value = _value || {};
    this.parent = _value.parent;
    this.pageSize = _value.pageSize;
    this.pageToken = _value.pageToken;
    this.orderBy = _value.orderBy;
    this.filter = _value.filter;
    ListThreadsRequest.refineValues(this);
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
  get orderBy(): string | undefined {
    return this._orderBy;
  }
  set orderBy(value: string | undefined) {
    this._orderBy = value;
  }
  get filter(): string | undefined {
    return this._filter;
  }
  set filter(value: string | undefined) {
    this._filter = value;
  }

  /**
   * Serialize message to binary data
   * @param instance message instance
   */
  serializeBinary() {
    const writer = new BinaryWriter();
    ListThreadsRequest.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): ListThreadsRequest.AsObject {
    return {
      parent: this.parent,
      pageSize: this.pageSize,
      pageToken: this.pageToken,
      orderBy: this.orderBy,
      filter: this.filter
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
  ): ListThreadsRequest.AsProtobufJSON {
    return {
      parent: this.parent,
      pageSize: this.pageSize,
      pageToken: this.pageToken,
      orderBy: this.orderBy,
      filter: this.filter
    };
  }
}
export module ListThreadsRequest {
  /**
   * Standard JavaScript object representation for ListThreadsRequest
   */
  export interface AsObject {
    parent?: string;
    pageSize?: string;
    pageToken?: string;
    orderBy?: string;
    filter?: string;
  }

  /**
   * Protobuf JSON representation for ListThreadsRequest
   */
  export interface AsProtobufJSON {
    parent?: string;
    pageSize?: string;
    pageToken?: string;
    orderBy?: string;
    filter?: string;
  }
}

/**
 * Message implementation for routeguide.ListThreadsResponse
 */
export class ListThreadsResponse implements GrpcMessage {
  static id = 'routeguide.ListThreadsResponse';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new ListThreadsResponse();
    ListThreadsResponse.deserializeBinaryFromReader(
      instance,
      new BinaryReader(bytes)
    );
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: ListThreadsResponse) {
    _instance.threads = _instance.threads || [];
    _instance.nextPageToken = _instance.nextPageToken || '';
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: ListThreadsResponse,
    _reader: BinaryReader
  ) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          const messageInitializer1 = new Thread();
          _reader.readMessage(
            messageInitializer1,
            Thread.deserializeBinaryFromReader
          );
          (_instance.threads = _instance.threads || []).push(
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

    ListThreadsResponse.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(
    _instance: ListThreadsResponse,
    _writer: BinaryWriter
  ) {
    if (_instance.threads && _instance.threads.length) {
      _writer.writeRepeatedMessage(
        1,
        _instance.threads as any,
        Thread.serializeBinaryToWriter
      );
    }
    if (_instance.nextPageToken) {
      _writer.writeString(2, _instance.nextPageToken);
    }
  }

  private _threads?: Thread[];
  private _nextPageToken?: string;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of ListThreadsResponse to deeply clone from
   */
  constructor(_value?: RecursivePartial<ListThreadsResponse.AsObject>) {
    _value = _value || {};
    this.threads = (_value.threads || []).map(m => new Thread(m));
    this.nextPageToken = _value.nextPageToken;
    ListThreadsResponse.refineValues(this);
  }
  get threads(): Thread[] | undefined {
    return this._threads;
  }
  set threads(value: Thread[] | undefined) {
    this._threads = value;
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
    ListThreadsResponse.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): ListThreadsResponse.AsObject {
    return {
      threads: (this.threads || []).map(m => m.toObject()),
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
  ): ListThreadsResponse.AsProtobufJSON {
    return {
      threads: (this.threads || []).map(m => m.toProtobufJSON(options)),
      nextPageToken: this.nextPageToken
    };
  }
}
export module ListThreadsResponse {
  /**
   * Standard JavaScript object representation for ListThreadsResponse
   */
  export interface AsObject {
    threads?: Thread.AsObject[];
    nextPageToken?: string;
  }

  /**
   * Protobuf JSON representation for ListThreadsResponse
   */
  export interface AsProtobufJSON {
    threads?: Thread.AsProtobufJSON[] | null;
    nextPageToken?: string;
  }
}

/**
 * Message implementation for routeguide.UpdateThreadRequest
 */
export class UpdateThreadRequest implements GrpcMessage {
  static id = 'routeguide.UpdateThreadRequest';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new UpdateThreadRequest();
    UpdateThreadRequest.deserializeBinaryFromReader(
      instance,
      new BinaryReader(bytes)
    );
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: UpdateThreadRequest) {
    _instance.thread = _instance.thread || undefined;
    _instance.updateMask = _instance.updateMask || undefined;
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: UpdateThreadRequest,
    _reader: BinaryReader
  ) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          _instance.thread = new Thread();
          _reader.readMessage(
            _instance.thread,
            Thread.deserializeBinaryFromReader
          );
          break;
        case 2:
          _instance.updateMask = new FieldMask();
          _reader.readMessage(
            _instance.updateMask,
            FieldMask.deserializeBinaryFromReader
          );
          break;
        default:
          _reader.skipField();
      }
    }

    UpdateThreadRequest.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(
    _instance: UpdateThreadRequest,
    _writer: BinaryWriter
  ) {
    if (_instance.thread) {
      _writer.writeMessage(
        1,
        _instance.thread as any,
        Thread.serializeBinaryToWriter
      );
    }
    if (_instance.updateMask) {
      _writer.writeMessage(
        2,
        _instance.updateMask as any,
        FieldMask.serializeBinaryToWriter
      );
    }
  }

  private _thread?: Thread;
  private _updateMask?: FieldMask;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of UpdateThreadRequest to deeply clone from
   */
  constructor(_value?: RecursivePartial<UpdateThreadRequest.AsObject>) {
    _value = _value || {};
    this.thread = _value.thread ? new Thread(_value.thread) : undefined;
    this.updateMask = _value.updateMask
      ? new FieldMask(_value.updateMask)
      : undefined;
    UpdateThreadRequest.refineValues(this);
  }
  get thread(): Thread | undefined {
    return this._thread;
  }
  set thread(value: Thread | undefined) {
    this._thread = value;
  }
  get updateMask(): FieldMask | undefined {
    return this._updateMask;
  }
  set updateMask(value: FieldMask | undefined) {
    this._updateMask = value;
  }

  /**
   * Serialize message to binary data
   * @param instance message instance
   */
  serializeBinary() {
    const writer = new BinaryWriter();
    UpdateThreadRequest.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): UpdateThreadRequest.AsObject {
    return {
      thread: this.thread ? this.thread.toObject() : undefined,
      updateMask: this.updateMask ? this.updateMask.toObject() : undefined
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
  ): UpdateThreadRequest.AsProtobufJSON {
    return {
      thread: this.thread ? this.thread.toProtobufJSON(options) : null,
      updateMask: this.updateMask
        ? this.updateMask.toProtobufJSON(options)
        : null
    };
  }
}
export module UpdateThreadRequest {
  /**
   * Standard JavaScript object representation for UpdateThreadRequest
   */
  export interface AsObject {
    thread?: Thread.AsObject;
    updateMask?: FieldMask.AsObject;
  }

  /**
   * Protobuf JSON representation for UpdateThreadRequest
   */
  export interface AsProtobufJSON {
    thread?: Thread.AsProtobufJSON | null;
    updateMask?: FieldMask.AsProtobufJSON | null;
  }
}

/**
 * Message implementation for routeguide.DeleteThreadRequest
 */
export class DeleteThreadRequest implements GrpcMessage {
  static id = 'routeguide.DeleteThreadRequest';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new DeleteThreadRequest();
    DeleteThreadRequest.deserializeBinaryFromReader(
      instance,
      new BinaryReader(bytes)
    );
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: DeleteThreadRequest) {
    _instance.name = _instance.name || '';
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: DeleteThreadRequest,
    _reader: BinaryReader
  ) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          _instance.name = _reader.readString();
          break;
        default:
          _reader.skipField();
      }
    }

    DeleteThreadRequest.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(
    _instance: DeleteThreadRequest,
    _writer: BinaryWriter
  ) {
    if (_instance.name) {
      _writer.writeString(1, _instance.name);
    }
  }

  private _name?: string;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of DeleteThreadRequest to deeply clone from
   */
  constructor(_value?: RecursivePartial<DeleteThreadRequest.AsObject>) {
    _value = _value || {};
    this.name = _value.name;
    DeleteThreadRequest.refineValues(this);
  }
  get name(): string | undefined {
    return this._name;
  }
  set name(value: string | undefined) {
    this._name = value;
  }

  /**
   * Serialize message to binary data
   * @param instance message instance
   */
  serializeBinary() {
    const writer = new BinaryWriter();
    DeleteThreadRequest.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): DeleteThreadRequest.AsObject {
    return {
      name: this.name
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
  ): DeleteThreadRequest.AsProtobufJSON {
    return {
      name: this.name
    };
  }
}
export module DeleteThreadRequest {
  /**
   * Standard JavaScript object representation for DeleteThreadRequest
   */
  export interface AsObject {
    name?: string;
  }

  /**
   * Protobuf JSON representation for DeleteThreadRequest
   */
  export interface AsProtobufJSON {
    name?: string;
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
    _instance.parent = _instance.parent || '';
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
          _instance.parent = _reader.readString();
          break;
        case 2:
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
    if (_instance.parent) {
      _writer.writeString(1, _instance.parent);
    }
    if (_instance.comment) {
      _writer.writeMessage(
        2,
        _instance.comment as any,
        Comment.serializeBinaryToWriter
      );
    }
  }

  private _parent?: string;
  private _comment?: Comment;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of CreateCommentRequest to deeply clone from
   */
  constructor(_value?: RecursivePartial<CreateCommentRequest.AsObject>) {
    _value = _value || {};
    this.parent = _value.parent;
    this.comment = _value.comment ? new Comment(_value.comment) : undefined;
    CreateCommentRequest.refineValues(this);
  }
  get parent(): string | undefined {
    return this._parent;
  }
  set parent(value: string | undefined) {
    this._parent = value;
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
      parent: this.parent,
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
      parent: this.parent,
      comment: this.comment ? this.comment.toProtobufJSON(options) : null
    };
  }
}
export module CreateCommentRequest {
  /**
   * Standard JavaScript object representation for CreateCommentRequest
   */
  export interface AsObject {
    parent?: string;
    comment?: Comment.AsObject;
  }

  /**
   * Protobuf JSON representation for CreateCommentRequest
   */
  export interface AsProtobufJSON {
    parent?: string;
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
    _instance.name = _instance.name || '';
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
          _instance.name = _reader.readString();
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
    if (_instance.name) {
      _writer.writeString(1, _instance.name);
    }
  }

  private _name?: string;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of DeleteCommentRequest to deeply clone from
   */
  constructor(_value?: RecursivePartial<DeleteCommentRequest.AsObject>) {
    _value = _value || {};
    this.name = _value.name;
    DeleteCommentRequest.refineValues(this);
  }
  get name(): string | undefined {
    return this._name;
  }
  set name(value: string | undefined) {
    this._name = value;
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
      name: this.name
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
      name: this.name
    };
  }
}
export module DeleteCommentRequest {
  /**
   * Standard JavaScript object representation for DeleteCommentRequest
   */
  export interface AsObject {
    name?: string;
  }

  /**
   * Protobuf JSON representation for DeleteCommentRequest
   */
  export interface AsProtobufJSON {
    name?: string;
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
    _instance.updateMask = _instance.updateMask || undefined;
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
        case 2:
          _instance.updateMask = new FieldMask();
          _reader.readMessage(
            _instance.updateMask,
            FieldMask.deserializeBinaryFromReader
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
    if (_instance.updateMask) {
      _writer.writeMessage(
        2,
        _instance.updateMask as any,
        FieldMask.serializeBinaryToWriter
      );
    }
  }

  private _comment?: Comment;
  private _updateMask?: FieldMask;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of UpdateCommentRequest to deeply clone from
   */
  constructor(_value?: RecursivePartial<UpdateCommentRequest.AsObject>) {
    _value = _value || {};
    this.comment = _value.comment ? new Comment(_value.comment) : undefined;
    this.updateMask = _value.updateMask
      ? new FieldMask(_value.updateMask)
      : undefined;
    UpdateCommentRequest.refineValues(this);
  }
  get comment(): Comment | undefined {
    return this._comment;
  }
  set comment(value: Comment | undefined) {
    this._comment = value;
  }
  get updateMask(): FieldMask | undefined {
    return this._updateMask;
  }
  set updateMask(value: FieldMask | undefined) {
    this._updateMask = value;
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
      comment: this.comment ? this.comment.toObject() : undefined,
      updateMask: this.updateMask ? this.updateMask.toObject() : undefined
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
      comment: this.comment ? this.comment.toProtobufJSON(options) : null,
      updateMask: this.updateMask
        ? this.updateMask.toProtobufJSON(options)
        : null
    };
  }
}
export module UpdateCommentRequest {
  /**
   * Standard JavaScript object representation for UpdateCommentRequest
   */
  export interface AsObject {
    comment?: Comment.AsObject;
    updateMask?: FieldMask.AsObject;
  }

  /**
   * Protobuf JSON representation for UpdateCommentRequest
   */
  export interface AsProtobufJSON {
    comment?: Comment.AsProtobufJSON | null;
    updateMask?: FieldMask.AsProtobufJSON | null;
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
    _instance.orderBy = _instance.orderBy || '';
    _instance.filter = _instance.filter || '';
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
        case 4:
          _instance.orderBy = _reader.readString();
          break;
        case 5:
          _instance.filter = _reader.readString();
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
    if (_instance.orderBy) {
      _writer.writeString(4, _instance.orderBy);
    }
    if (_instance.filter) {
      _writer.writeString(5, _instance.filter);
    }
  }

  private _parent?: string;
  private _pageSize?: string;
  private _pageToken?: string;
  private _orderBy?: string;
  private _filter?: string;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of ListCommentsRequest to deeply clone from
   */
  constructor(_value?: RecursivePartial<ListCommentsRequest.AsObject>) {
    _value = _value || {};
    this.parent = _value.parent;
    this.pageSize = _value.pageSize;
    this.pageToken = _value.pageToken;
    this.orderBy = _value.orderBy;
    this.filter = _value.filter;
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
  get orderBy(): string | undefined {
    return this._orderBy;
  }
  set orderBy(value: string | undefined) {
    this._orderBy = value;
  }
  get filter(): string | undefined {
    return this._filter;
  }
  set filter(value: string | undefined) {
    this._filter = value;
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
      pageToken: this.pageToken,
      orderBy: this.orderBy,
      filter: this.filter
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
      pageToken: this.pageToken,
      orderBy: this.orderBy,
      filter: this.filter
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
    orderBy?: string;
    filter?: string;
  }

  /**
   * Protobuf JSON representation for ListCommentsRequest
   */
  export interface AsProtobufJSON {
    parent?: string;
    pageSize?: string;
    pageToken?: string;
    orderBy?: string;
    filter?: string;
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
    _instance.nextPageToken = _instance.nextPageToken || '';
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
          _instance.nextPageToken = _reader.readString();
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
    if (_instance.nextPageToken) {
      _writer.writeString(2, _instance.nextPageToken);
    }
  }

  private _comments?: Comment[];
  private _nextPageToken?: string;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of ListCommentsResponse to deeply clone from
   */
  constructor(_value?: RecursivePartial<ListCommentsResponse.AsObject>) {
    _value = _value || {};
    this.comments = (_value.comments || []).map(m => new Comment(m));
    this.nextPageToken = _value.nextPageToken;
    ListCommentsResponse.refineValues(this);
  }
  get comments(): Comment[] | undefined {
    return this._comments;
  }
  set comments(value: Comment[] | undefined) {
    this._comments = value;
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
    ListCommentsResponse.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): ListCommentsResponse.AsObject {
    return {
      comments: (this.comments || []).map(m => m.toObject()),
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
  ): ListCommentsResponse.AsProtobufJSON {
    return {
      comments: (this.comments || []).map(m => m.toProtobufJSON(options)),
      nextPageToken: this.nextPageToken
    };
  }
}
export module ListCommentsResponse {
  /**
   * Standard JavaScript object representation for ListCommentsResponse
   */
  export interface AsObject {
    comments?: Comment.AsObject[];
    nextPageToken?: string;
  }

  /**
   * Protobuf JSON representation for ListCommentsResponse
   */
  export interface AsProtobufJSON {
    comments?: Comment.AsProtobufJSON[] | null;
    nextPageToken?: string;
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
    _instance.parent = _instance.parent || '';
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
          _instance.parent = _reader.readString();
          break;
        case 2:
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
    if (_instance.parent) {
      _writer.writeString(1, _instance.parent);
    }
    if (_instance.reply) {
      _writer.writeMessage(
        2,
        _instance.reply as any,
        Reply.serializeBinaryToWriter
      );
    }
  }

  private _parent?: string;
  private _reply?: Reply;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of CreateReplyRequest to deeply clone from
   */
  constructor(_value?: RecursivePartial<CreateReplyRequest.AsObject>) {
    _value = _value || {};
    this.parent = _value.parent;
    this.reply = _value.reply ? new Reply(_value.reply) : undefined;
    CreateReplyRequest.refineValues(this);
  }
  get parent(): string | undefined {
    return this._parent;
  }
  set parent(value: string | undefined) {
    this._parent = value;
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
      parent: this.parent,
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
      parent: this.parent,
      reply: this.reply ? this.reply.toProtobufJSON(options) : null
    };
  }
}
export module CreateReplyRequest {
  /**
   * Standard JavaScript object representation for CreateReplyRequest
   */
  export interface AsObject {
    parent?: string;
    reply?: Reply.AsObject;
  }

  /**
   * Protobuf JSON representation for CreateReplyRequest
   */
  export interface AsProtobufJSON {
    parent?: string;
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
    _instance.name = _instance.name || '';
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
          _instance.name = _reader.readString();
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
    if (_instance.name) {
      _writer.writeString(1, _instance.name);
    }
  }

  private _name?: string;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of DeleteReplyRequest to deeply clone from
   */
  constructor(_value?: RecursivePartial<DeleteReplyRequest.AsObject>) {
    _value = _value || {};
    this.name = _value.name;
    DeleteReplyRequest.refineValues(this);
  }
  get name(): string | undefined {
    return this._name;
  }
  set name(value: string | undefined) {
    this._name = value;
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
      name: this.name
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
      name: this.name
    };
  }
}
export module DeleteReplyRequest {
  /**
   * Standard JavaScript object representation for DeleteReplyRequest
   */
  export interface AsObject {
    name?: string;
  }

  /**
   * Protobuf JSON representation for DeleteReplyRequest
   */
  export interface AsProtobufJSON {
    name?: string;
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
    _instance.updateMask = _instance.updateMask || undefined;
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
        case 2:
          _instance.updateMask = new FieldMask();
          _reader.readMessage(
            _instance.updateMask,
            FieldMask.deserializeBinaryFromReader
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
    if (_instance.updateMask) {
      _writer.writeMessage(
        2,
        _instance.updateMask as any,
        FieldMask.serializeBinaryToWriter
      );
    }
  }

  private _reply?: Reply;
  private _updateMask?: FieldMask;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of UpdateReplyRequest to deeply clone from
   */
  constructor(_value?: RecursivePartial<UpdateReplyRequest.AsObject>) {
    _value = _value || {};
    this.reply = _value.reply ? new Reply(_value.reply) : undefined;
    this.updateMask = _value.updateMask
      ? new FieldMask(_value.updateMask)
      : undefined;
    UpdateReplyRequest.refineValues(this);
  }
  get reply(): Reply | undefined {
    return this._reply;
  }
  set reply(value: Reply | undefined) {
    this._reply = value;
  }
  get updateMask(): FieldMask | undefined {
    return this._updateMask;
  }
  set updateMask(value: FieldMask | undefined) {
    this._updateMask = value;
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
      reply: this.reply ? this.reply.toObject() : undefined,
      updateMask: this.updateMask ? this.updateMask.toObject() : undefined
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
      reply: this.reply ? this.reply.toProtobufJSON(options) : null,
      updateMask: this.updateMask
        ? this.updateMask.toProtobufJSON(options)
        : null
    };
  }
}
export module UpdateReplyRequest {
  /**
   * Standard JavaScript object representation for UpdateReplyRequest
   */
  export interface AsObject {
    reply?: Reply.AsObject;
    updateMask?: FieldMask.AsObject;
  }

  /**
   * Protobuf JSON representation for UpdateReplyRequest
   */
  export interface AsProtobufJSON {
    reply?: Reply.AsProtobufJSON | null;
    updateMask?: FieldMask.AsProtobufJSON | null;
  }
}

/**
 * Message implementation for routeguide.CreateArticleRequest
 */
export class CreateArticleRequest implements GrpcMessage {
  static id = 'routeguide.CreateArticleRequest';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new CreateArticleRequest();
    CreateArticleRequest.deserializeBinaryFromReader(
      instance,
      new BinaryReader(bytes)
    );
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: CreateArticleRequest) {
    _instance.parent = _instance.parent || '';
    _instance.article = _instance.article || undefined;
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: CreateArticleRequest,
    _reader: BinaryReader
  ) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          _instance.parent = _reader.readString();
          break;
        case 2:
          _instance.article = new Article();
          _reader.readMessage(
            _instance.article,
            Article.deserializeBinaryFromReader
          );
          break;
        default:
          _reader.skipField();
      }
    }

    CreateArticleRequest.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(
    _instance: CreateArticleRequest,
    _writer: BinaryWriter
  ) {
    if (_instance.parent) {
      _writer.writeString(1, _instance.parent);
    }
    if (_instance.article) {
      _writer.writeMessage(
        2,
        _instance.article as any,
        Article.serializeBinaryToWriter
      );
    }
  }

  private _parent?: string;
  private _article?: Article;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of CreateArticleRequest to deeply clone from
   */
  constructor(_value?: RecursivePartial<CreateArticleRequest.AsObject>) {
    _value = _value || {};
    this.parent = _value.parent;
    this.article = _value.article ? new Article(_value.article) : undefined;
    CreateArticleRequest.refineValues(this);
  }
  get parent(): string | undefined {
    return this._parent;
  }
  set parent(value: string | undefined) {
    this._parent = value;
  }
  get article(): Article | undefined {
    return this._article;
  }
  set article(value: Article | undefined) {
    this._article = value;
  }

  /**
   * Serialize message to binary data
   * @param instance message instance
   */
  serializeBinary() {
    const writer = new BinaryWriter();
    CreateArticleRequest.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): CreateArticleRequest.AsObject {
    return {
      parent: this.parent,
      article: this.article ? this.article.toObject() : undefined
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
  ): CreateArticleRequest.AsProtobufJSON {
    return {
      parent: this.parent,
      article: this.article ? this.article.toProtobufJSON(options) : null
    };
  }
}
export module CreateArticleRequest {
  /**
   * Standard JavaScript object representation for CreateArticleRequest
   */
  export interface AsObject {
    parent?: string;
    article?: Article.AsObject;
  }

  /**
   * Protobuf JSON representation for CreateArticleRequest
   */
  export interface AsProtobufJSON {
    parent?: string;
    article?: Article.AsProtobufJSON | null;
  }
}

/**
 * Message implementation for routeguide.GetArticleRequest
 */
export class GetArticleRequest implements GrpcMessage {
  static id = 'routeguide.GetArticleRequest';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new GetArticleRequest();
    GetArticleRequest.deserializeBinaryFromReader(
      instance,
      new BinaryReader(bytes)
    );
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: GetArticleRequest) {
    _instance.name = _instance.name || '';
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: GetArticleRequest,
    _reader: BinaryReader
  ) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          _instance.name = _reader.readString();
          break;
        default:
          _reader.skipField();
      }
    }

    GetArticleRequest.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(
    _instance: GetArticleRequest,
    _writer: BinaryWriter
  ) {
    if (_instance.name) {
      _writer.writeString(1, _instance.name);
    }
  }

  private _name?: string;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of GetArticleRequest to deeply clone from
   */
  constructor(_value?: RecursivePartial<GetArticleRequest.AsObject>) {
    _value = _value || {};
    this.name = _value.name;
    GetArticleRequest.refineValues(this);
  }
  get name(): string | undefined {
    return this._name;
  }
  set name(value: string | undefined) {
    this._name = value;
  }

  /**
   * Serialize message to binary data
   * @param instance message instance
   */
  serializeBinary() {
    const writer = new BinaryWriter();
    GetArticleRequest.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): GetArticleRequest.AsObject {
    return {
      name: this.name
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
  ): GetArticleRequest.AsProtobufJSON {
    return {
      name: this.name
    };
  }
}
export module GetArticleRequest {
  /**
   * Standard JavaScript object representation for GetArticleRequest
   */
  export interface AsObject {
    name?: string;
  }

  /**
   * Protobuf JSON representation for GetArticleRequest
   */
  export interface AsProtobufJSON {
    name?: string;
  }
}

/**
 * Message implementation for routeguide.ListArticlesRequest
 */
export class ListArticlesRequest implements GrpcMessage {
  static id = 'routeguide.ListArticlesRequest';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new ListArticlesRequest();
    ListArticlesRequest.deserializeBinaryFromReader(
      instance,
      new BinaryReader(bytes)
    );
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: ListArticlesRequest) {
    _instance.parent = _instance.parent || '';
    _instance.pageSize = _instance.pageSize || '0';
    _instance.pageToken = _instance.pageToken || '';
    _instance.orderBy = _instance.orderBy || '';
    _instance.filter = _instance.filter || '';
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: ListArticlesRequest,
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
        case 4:
          _instance.orderBy = _reader.readString();
          break;
        case 5:
          _instance.filter = _reader.readString();
          break;
        default:
          _reader.skipField();
      }
    }

    ListArticlesRequest.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(
    _instance: ListArticlesRequest,
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
    if (_instance.orderBy) {
      _writer.writeString(4, _instance.orderBy);
    }
    if (_instance.filter) {
      _writer.writeString(5, _instance.filter);
    }
  }

  private _parent?: string;
  private _pageSize?: string;
  private _pageToken?: string;
  private _orderBy?: string;
  private _filter?: string;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of ListArticlesRequest to deeply clone from
   */
  constructor(_value?: RecursivePartial<ListArticlesRequest.AsObject>) {
    _value = _value || {};
    this.parent = _value.parent;
    this.pageSize = _value.pageSize;
    this.pageToken = _value.pageToken;
    this.orderBy = _value.orderBy;
    this.filter = _value.filter;
    ListArticlesRequest.refineValues(this);
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
  get orderBy(): string | undefined {
    return this._orderBy;
  }
  set orderBy(value: string | undefined) {
    this._orderBy = value;
  }
  get filter(): string | undefined {
    return this._filter;
  }
  set filter(value: string | undefined) {
    this._filter = value;
  }

  /**
   * Serialize message to binary data
   * @param instance message instance
   */
  serializeBinary() {
    const writer = new BinaryWriter();
    ListArticlesRequest.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): ListArticlesRequest.AsObject {
    return {
      parent: this.parent,
      pageSize: this.pageSize,
      pageToken: this.pageToken,
      orderBy: this.orderBy,
      filter: this.filter
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
  ): ListArticlesRequest.AsProtobufJSON {
    return {
      parent: this.parent,
      pageSize: this.pageSize,
      pageToken: this.pageToken,
      orderBy: this.orderBy,
      filter: this.filter
    };
  }
}
export module ListArticlesRequest {
  /**
   * Standard JavaScript object representation for ListArticlesRequest
   */
  export interface AsObject {
    parent?: string;
    pageSize?: string;
    pageToken?: string;
    orderBy?: string;
    filter?: string;
  }

  /**
   * Protobuf JSON representation for ListArticlesRequest
   */
  export interface AsProtobufJSON {
    parent?: string;
    pageSize?: string;
    pageToken?: string;
    orderBy?: string;
    filter?: string;
  }
}

/**
 * Message implementation for routeguide.ListArticlesResponse
 */
export class ListArticlesResponse implements GrpcMessage {
  static id = 'routeguide.ListArticlesResponse';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new ListArticlesResponse();
    ListArticlesResponse.deserializeBinaryFromReader(
      instance,
      new BinaryReader(bytes)
    );
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: ListArticlesResponse) {
    _instance.articles = _instance.articles || [];
    _instance.nextPageToken = _instance.nextPageToken || '';
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: ListArticlesResponse,
    _reader: BinaryReader
  ) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          const messageInitializer1 = new Article();
          _reader.readMessage(
            messageInitializer1,
            Article.deserializeBinaryFromReader
          );
          (_instance.articles = _instance.articles || []).push(
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

    ListArticlesResponse.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(
    _instance: ListArticlesResponse,
    _writer: BinaryWriter
  ) {
    if (_instance.articles && _instance.articles.length) {
      _writer.writeRepeatedMessage(
        1,
        _instance.articles as any,
        Article.serializeBinaryToWriter
      );
    }
    if (_instance.nextPageToken) {
      _writer.writeString(2, _instance.nextPageToken);
    }
  }

  private _articles?: Article[];
  private _nextPageToken?: string;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of ListArticlesResponse to deeply clone from
   */
  constructor(_value?: RecursivePartial<ListArticlesResponse.AsObject>) {
    _value = _value || {};
    this.articles = (_value.articles || []).map(m => new Article(m));
    this.nextPageToken = _value.nextPageToken;
    ListArticlesResponse.refineValues(this);
  }
  get articles(): Article[] | undefined {
    return this._articles;
  }
  set articles(value: Article[] | undefined) {
    this._articles = value;
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
    ListArticlesResponse.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): ListArticlesResponse.AsObject {
    return {
      articles: (this.articles || []).map(m => m.toObject()),
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
  ): ListArticlesResponse.AsProtobufJSON {
    return {
      articles: (this.articles || []).map(m => m.toProtobufJSON(options)),
      nextPageToken: this.nextPageToken
    };
  }
}
export module ListArticlesResponse {
  /**
   * Standard JavaScript object representation for ListArticlesResponse
   */
  export interface AsObject {
    articles?: Article.AsObject[];
    nextPageToken?: string;
  }

  /**
   * Protobuf JSON representation for ListArticlesResponse
   */
  export interface AsProtobufJSON {
    articles?: Article.AsProtobufJSON[] | null;
    nextPageToken?: string;
  }
}

/**
 * Message implementation for routeguide.UpdateArticleRequest
 */
export class UpdateArticleRequest implements GrpcMessage {
  static id = 'routeguide.UpdateArticleRequest';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new UpdateArticleRequest();
    UpdateArticleRequest.deserializeBinaryFromReader(
      instance,
      new BinaryReader(bytes)
    );
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: UpdateArticleRequest) {
    _instance.article = _instance.article || undefined;
    _instance.updateMask = _instance.updateMask || undefined;
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: UpdateArticleRequest,
    _reader: BinaryReader
  ) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          _instance.article = new Article();
          _reader.readMessage(
            _instance.article,
            Article.deserializeBinaryFromReader
          );
          break;
        case 2:
          _instance.updateMask = new FieldMask();
          _reader.readMessage(
            _instance.updateMask,
            FieldMask.deserializeBinaryFromReader
          );
          break;
        default:
          _reader.skipField();
      }
    }

    UpdateArticleRequest.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(
    _instance: UpdateArticleRequest,
    _writer: BinaryWriter
  ) {
    if (_instance.article) {
      _writer.writeMessage(
        1,
        _instance.article as any,
        Article.serializeBinaryToWriter
      );
    }
    if (_instance.updateMask) {
      _writer.writeMessage(
        2,
        _instance.updateMask as any,
        FieldMask.serializeBinaryToWriter
      );
    }
  }

  private _article?: Article;
  private _updateMask?: FieldMask;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of UpdateArticleRequest to deeply clone from
   */
  constructor(_value?: RecursivePartial<UpdateArticleRequest.AsObject>) {
    _value = _value || {};
    this.article = _value.article ? new Article(_value.article) : undefined;
    this.updateMask = _value.updateMask
      ? new FieldMask(_value.updateMask)
      : undefined;
    UpdateArticleRequest.refineValues(this);
  }
  get article(): Article | undefined {
    return this._article;
  }
  set article(value: Article | undefined) {
    this._article = value;
  }
  get updateMask(): FieldMask | undefined {
    return this._updateMask;
  }
  set updateMask(value: FieldMask | undefined) {
    this._updateMask = value;
  }

  /**
   * Serialize message to binary data
   * @param instance message instance
   */
  serializeBinary() {
    const writer = new BinaryWriter();
    UpdateArticleRequest.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): UpdateArticleRequest.AsObject {
    return {
      article: this.article ? this.article.toObject() : undefined,
      updateMask: this.updateMask ? this.updateMask.toObject() : undefined
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
  ): UpdateArticleRequest.AsProtobufJSON {
    return {
      article: this.article ? this.article.toProtobufJSON(options) : null,
      updateMask: this.updateMask
        ? this.updateMask.toProtobufJSON(options)
        : null
    };
  }
}
export module UpdateArticleRequest {
  /**
   * Standard JavaScript object representation for UpdateArticleRequest
   */
  export interface AsObject {
    article?: Article.AsObject;
    updateMask?: FieldMask.AsObject;
  }

  /**
   * Protobuf JSON representation for UpdateArticleRequest
   */
  export interface AsProtobufJSON {
    article?: Article.AsProtobufJSON | null;
    updateMask?: FieldMask.AsProtobufJSON | null;
  }
}

/**
 * Message implementation for routeguide.DeleteArticleRequest
 */
export class DeleteArticleRequest implements GrpcMessage {
  static id = 'routeguide.DeleteArticleRequest';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new DeleteArticleRequest();
    DeleteArticleRequest.deserializeBinaryFromReader(
      instance,
      new BinaryReader(bytes)
    );
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: DeleteArticleRequest) {
    _instance.name = _instance.name || '';
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: DeleteArticleRequest,
    _reader: BinaryReader
  ) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          _instance.name = _reader.readString();
          break;
        default:
          _reader.skipField();
      }
    }

    DeleteArticleRequest.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(
    _instance: DeleteArticleRequest,
    _writer: BinaryWriter
  ) {
    if (_instance.name) {
      _writer.writeString(1, _instance.name);
    }
  }

  private _name?: string;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of DeleteArticleRequest to deeply clone from
   */
  constructor(_value?: RecursivePartial<DeleteArticleRequest.AsObject>) {
    _value = _value || {};
    this.name = _value.name;
    DeleteArticleRequest.refineValues(this);
  }
  get name(): string | undefined {
    return this._name;
  }
  set name(value: string | undefined) {
    this._name = value;
  }

  /**
   * Serialize message to binary data
   * @param instance message instance
   */
  serializeBinary() {
    const writer = new BinaryWriter();
    DeleteArticleRequest.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): DeleteArticleRequest.AsObject {
    return {
      name: this.name
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
  ): DeleteArticleRequest.AsProtobufJSON {
    return {
      name: this.name
    };
  }
}
export module DeleteArticleRequest {
  /**
   * Standard JavaScript object representation for DeleteArticleRequest
   */
  export interface AsObject {
    name?: string;
  }

  /**
   * Protobuf JSON representation for DeleteArticleRequest
   */
  export interface AsProtobufJSON {
    name?: string;
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
    _instance.name = _instance.name || '';
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
          _instance.name = _reader.readString();
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
    if (_instance.name) {
      _writer.writeString(1, _instance.name);
    }
  }

  private _name?: string;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of GetUserRequest to deeply clone from
   */
  constructor(_value?: RecursivePartial<GetUserRequest.AsObject>) {
    _value = _value || {};
    this.name = _value.name;
    GetUserRequest.refineValues(this);
  }
  get name(): string | undefined {
    return this._name;
  }
  set name(value: string | undefined) {
    this._name = value;
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
      name: this.name
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
      name: this.name
    };
  }
}
export module GetUserRequest {
  /**
   * Standard JavaScript object representation for GetUserRequest
   */
  export interface AsObject {
    name?: string;
  }

  /**
   * Protobuf JSON representation for GetUserRequest
   */
  export interface AsProtobufJSON {
    name?: string;
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
    _instance.identity = _instance.identity || '';
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
          _instance.identity = _reader.readString();
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
    if (_instance.identity) {
      _writer.writeString(1, _instance.identity);
    }
    if (_instance.password) {
      _writer.writeString(2, _instance.password);
    }
  }

  private _identity?: string;
  private _password?: string;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of SignInRequest to deeply clone from
   */
  constructor(_value?: RecursivePartial<SignInRequest.AsObject>) {
    _value = _value || {};
    this.identity = _value.identity;
    this.password = _value.password;
    SignInRequest.refineValues(this);
  }
  get identity(): string | undefined {
    return this._identity;
  }
  set identity(value: string | undefined) {
    this._identity = value;
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
      identity: this.identity,
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
      identity: this.identity,
      password: this.password
    };
  }
}
export module SignInRequest {
  /**
   * Standard JavaScript object representation for SignInRequest
   */
  export interface AsObject {
    identity?: string;
    password?: string;
  }

  /**
   * Protobuf JSON representation for SignInRequest
   */
  export interface AsProtobufJSON {
    identity?: string;
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
  static refineValues(_instance: SignOutRequest) {}

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
  ) {}

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of SignOutRequest to deeply clone from
   */
  constructor(_value?: RecursivePartial<SignOutRequest.AsObject>) {
    _value = _value || {};
    SignOutRequest.refineValues(this);
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
  ): SignOutRequest.AsProtobufJSON {
    return {};
  }
}
export module SignOutRequest {
  /**
   * Standard JavaScript object representation for SignOutRequest
   */
  export interface AsObject {}

  /**
   * Protobuf JSON representation for SignOutRequest
   */
  export interface AsProtobufJSON {}
}

/**
 * Message implementation for routeguide.CreateUserRequest
 */
export class CreateUserRequest implements GrpcMessage {
  static id = 'routeguide.CreateUserRequest';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new CreateUserRequest();
    CreateUserRequest.deserializeBinaryFromReader(
      instance,
      new BinaryReader(bytes)
    );
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: CreateUserRequest) {
    _instance.parent = _instance.parent || '';
    _instance.user = _instance.user || undefined;
    _instance.password = _instance.password || '';
    _instance.verificationCode = _instance.verificationCode || '';
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: CreateUserRequest,
    _reader: BinaryReader
  ) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          _instance.parent = _reader.readString();
          break;
        case 2:
          _instance.user = new User();
          _reader.readMessage(_instance.user, User.deserializeBinaryFromReader);
          break;
        case 3:
          _instance.password = _reader.readString();
          break;
        case 4:
          _instance.verificationCode = _reader.readString();
          break;
        default:
          _reader.skipField();
      }
    }

    CreateUserRequest.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(
    _instance: CreateUserRequest,
    _writer: BinaryWriter
  ) {
    if (_instance.parent) {
      _writer.writeString(1, _instance.parent);
    }
    if (_instance.user) {
      _writer.writeMessage(
        2,
        _instance.user as any,
        User.serializeBinaryToWriter
      );
    }
    if (_instance.password) {
      _writer.writeString(3, _instance.password);
    }
    if (_instance.verificationCode) {
      _writer.writeString(4, _instance.verificationCode);
    }
  }

  private _parent?: string;
  private _user?: User;
  private _password?: string;
  private _verificationCode?: string;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of CreateUserRequest to deeply clone from
   */
  constructor(_value?: RecursivePartial<CreateUserRequest.AsObject>) {
    _value = _value || {};
    this.parent = _value.parent;
    this.user = _value.user ? new User(_value.user) : undefined;
    this.password = _value.password;
    this.verificationCode = _value.verificationCode;
    CreateUserRequest.refineValues(this);
  }
  get parent(): string | undefined {
    return this._parent;
  }
  set parent(value: string | undefined) {
    this._parent = value;
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
  get verificationCode(): string | undefined {
    return this._verificationCode;
  }
  set verificationCode(value: string | undefined) {
    this._verificationCode = value;
  }

  /**
   * Serialize message to binary data
   * @param instance message instance
   */
  serializeBinary() {
    const writer = new BinaryWriter();
    CreateUserRequest.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): CreateUserRequest.AsObject {
    return {
      parent: this.parent,
      user: this.user ? this.user.toObject() : undefined,
      password: this.password,
      verificationCode: this.verificationCode
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
  ): CreateUserRequest.AsProtobufJSON {
    return {
      parent: this.parent,
      user: this.user ? this.user.toProtobufJSON(options) : null,
      password: this.password,
      verificationCode: this.verificationCode
    };
  }
}
export module CreateUserRequest {
  /**
   * Standard JavaScript object representation for CreateUserRequest
   */
  export interface AsObject {
    parent?: string;
    user?: User.AsObject;
    password?: string;
    verificationCode?: string;
  }

  /**
   * Protobuf JSON representation for CreateUserRequest
   */
  export interface AsProtobufJSON {
    parent?: string;
    user?: User.AsProtobufJSON | null;
    password?: string;
    verificationCode?: string;
  }
}

/**
 * Message implementation for routeguide.CreateUserResponse
 */
export class CreateUserResponse implements GrpcMessage {
  static id = 'routeguide.CreateUserResponse';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new CreateUserResponse();
    CreateUserResponse.deserializeBinaryFromReader(
      instance,
      new BinaryReader(bytes)
    );
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: CreateUserResponse) {
    _instance.user = _instance.user || undefined;
    _instance.sid = _instance.sid || '';
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: CreateUserResponse,
    _reader: BinaryReader
  ) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          _instance.user = new User();
          _reader.readMessage(_instance.user, User.deserializeBinaryFromReader);
          break;
        case 2:
          _instance.sid = _reader.readString();
          break;
        default:
          _reader.skipField();
      }
    }

    CreateUserResponse.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(
    _instance: CreateUserResponse,
    _writer: BinaryWriter
  ) {
    if (_instance.user) {
      _writer.writeMessage(
        1,
        _instance.user as any,
        User.serializeBinaryToWriter
      );
    }
    if (_instance.sid) {
      _writer.writeString(2, _instance.sid);
    }
  }

  private _user?: User;
  private _sid?: string;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of CreateUserResponse to deeply clone from
   */
  constructor(_value?: RecursivePartial<CreateUserResponse.AsObject>) {
    _value = _value || {};
    this.user = _value.user ? new User(_value.user) : undefined;
    this.sid = _value.sid;
    CreateUserResponse.refineValues(this);
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
    CreateUserResponse.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): CreateUserResponse.AsObject {
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
  ): CreateUserResponse.AsProtobufJSON {
    return {
      user: this.user ? this.user.toProtobufJSON(options) : null,
      sid: this.sid
    };
  }
}
export module CreateUserResponse {
  /**
   * Standard JavaScript object representation for CreateUserResponse
   */
  export interface AsObject {
    user?: User.AsObject;
    sid?: string;
  }

  /**
   * Protobuf JSON representation for CreateUserResponse
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
    _instance.updateMask = _instance.updateMask || undefined;
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
        case 2:
          _instance.updateMask = new FieldMask();
          _reader.readMessage(
            _instance.updateMask,
            FieldMask.deserializeBinaryFromReader
          );
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
    if (_instance.updateMask) {
      _writer.writeMessage(
        2,
        _instance.updateMask as any,
        FieldMask.serializeBinaryToWriter
      );
    }
  }

  private _user?: User;
  private _updateMask?: FieldMask;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of UpdateUserRequest to deeply clone from
   */
  constructor(_value?: RecursivePartial<UpdateUserRequest.AsObject>) {
    _value = _value || {};
    this.user = _value.user ? new User(_value.user) : undefined;
    this.updateMask = _value.updateMask
      ? new FieldMask(_value.updateMask)
      : undefined;
    UpdateUserRequest.refineValues(this);
  }
  get user(): User | undefined {
    return this._user;
  }
  set user(value: User | undefined) {
    this._user = value;
  }
  get updateMask(): FieldMask | undefined {
    return this._updateMask;
  }
  set updateMask(value: FieldMask | undefined) {
    this._updateMask = value;
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
      user: this.user ? this.user.toObject() : undefined,
      updateMask: this.updateMask ? this.updateMask.toObject() : undefined
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
      user: this.user ? this.user.toProtobufJSON(options) : null,
      updateMask: this.updateMask
        ? this.updateMask.toProtobufJSON(options)
        : null
    };
  }
}
export module UpdateUserRequest {
  /**
   * Standard JavaScript object representation for UpdateUserRequest
   */
  export interface AsObject {
    user?: User.AsObject;
    updateMask?: FieldMask.AsObject;
  }

  /**
   * Protobuf JSON representation for UpdateUserRequest
   */
  export interface AsProtobufJSON {
    user?: User.AsProtobufJSON | null;
    updateMask?: FieldMask.AsProtobufJSON | null;
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
    _instance.name = _instance.name || '';
    _instance.password = _instance.password || '';
    _instance.verificationCode = _instance.verificationCode || '';
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
          _instance.name = _reader.readString();
          break;
        case 2:
          _instance.password = _reader.readString();
          break;
        case 3:
          _instance.verificationCode = _reader.readString();
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
    if (_instance.name) {
      _writer.writeString(1, _instance.name);
    }
    if (_instance.password) {
      _writer.writeString(2, _instance.password);
    }
    if (_instance.verificationCode) {
      _writer.writeString(3, _instance.verificationCode);
    }
  }

  private _name?: string;
  private _password?: string;
  private _verificationCode?: string;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of UpdatePasswordRequest to deeply clone from
   */
  constructor(_value?: RecursivePartial<UpdatePasswordRequest.AsObject>) {
    _value = _value || {};
    this.name = _value.name;
    this.password = _value.password;
    this.verificationCode = _value.verificationCode;
    UpdatePasswordRequest.refineValues(this);
  }
  get name(): string | undefined {
    return this._name;
  }
  set name(value: string | undefined) {
    this._name = value;
  }
  get password(): string | undefined {
    return this._password;
  }
  set password(value: string | undefined) {
    this._password = value;
  }
  get verificationCode(): string | undefined {
    return this._verificationCode;
  }
  set verificationCode(value: string | undefined) {
    this._verificationCode = value;
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
      name: this.name,
      password: this.password,
      verificationCode: this.verificationCode
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
      name: this.name,
      password: this.password,
      verificationCode: this.verificationCode
    };
  }
}
export module UpdatePasswordRequest {
  /**
   * Standard JavaScript object representation for UpdatePasswordRequest
   */
  export interface AsObject {
    name?: string;
    password?: string;
    verificationCode?: string;
  }

  /**
   * Protobuf JSON representation for UpdatePasswordRequest
   */
  export interface AsProtobufJSON {
    name?: string;
    password?: string;
    verificationCode?: string;
  }
}

/**
 * Message implementation for routeguide.ListUsersRequest
 */
export class ListUsersRequest implements GrpcMessage {
  static id = 'routeguide.ListUsersRequest';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new ListUsersRequest();
    ListUsersRequest.deserializeBinaryFromReader(
      instance,
      new BinaryReader(bytes)
    );
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: ListUsersRequest) {
    _instance.parent = _instance.parent || '';
    _instance.pageSize = _instance.pageSize || '0';
    _instance.pageToken = _instance.pageToken || '';
    _instance.orderBy = _instance.orderBy || '';
    _instance.filter = _instance.filter || '';
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: ListUsersRequest,
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
        case 4:
          _instance.orderBy = _reader.readString();
          break;
        case 5:
          _instance.filter = _reader.readString();
          break;
        default:
          _reader.skipField();
      }
    }

    ListUsersRequest.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(
    _instance: ListUsersRequest,
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
    if (_instance.orderBy) {
      _writer.writeString(4, _instance.orderBy);
    }
    if (_instance.filter) {
      _writer.writeString(5, _instance.filter);
    }
  }

  private _parent?: string;
  private _pageSize?: string;
  private _pageToken?: string;
  private _orderBy?: string;
  private _filter?: string;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of ListUsersRequest to deeply clone from
   */
  constructor(_value?: RecursivePartial<ListUsersRequest.AsObject>) {
    _value = _value || {};
    this.parent = _value.parent;
    this.pageSize = _value.pageSize;
    this.pageToken = _value.pageToken;
    this.orderBy = _value.orderBy;
    this.filter = _value.filter;
    ListUsersRequest.refineValues(this);
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
  get orderBy(): string | undefined {
    return this._orderBy;
  }
  set orderBy(value: string | undefined) {
    this._orderBy = value;
  }
  get filter(): string | undefined {
    return this._filter;
  }
  set filter(value: string | undefined) {
    this._filter = value;
  }

  /**
   * Serialize message to binary data
   * @param instance message instance
   */
  serializeBinary() {
    const writer = new BinaryWriter();
    ListUsersRequest.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): ListUsersRequest.AsObject {
    return {
      parent: this.parent,
      pageSize: this.pageSize,
      pageToken: this.pageToken,
      orderBy: this.orderBy,
      filter: this.filter
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
  ): ListUsersRequest.AsProtobufJSON {
    return {
      parent: this.parent,
      pageSize: this.pageSize,
      pageToken: this.pageToken,
      orderBy: this.orderBy,
      filter: this.filter
    };
  }
}
export module ListUsersRequest {
  /**
   * Standard JavaScript object representation for ListUsersRequest
   */
  export interface AsObject {
    parent?: string;
    pageSize?: string;
    pageToken?: string;
    orderBy?: string;
    filter?: string;
  }

  /**
   * Protobuf JSON representation for ListUsersRequest
   */
  export interface AsProtobufJSON {
    parent?: string;
    pageSize?: string;
    pageToken?: string;
    orderBy?: string;
    filter?: string;
  }
}

/**
 * Message implementation for routeguide.ListUsersResponse
 */
export class ListUsersResponse implements GrpcMessage {
  static id = 'routeguide.ListUsersResponse';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new ListUsersResponse();
    ListUsersResponse.deserializeBinaryFromReader(
      instance,
      new BinaryReader(bytes)
    );
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: ListUsersResponse) {
    _instance.users = _instance.users || [];
    _instance.nextPageToken = _instance.nextPageToken || '';
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: ListUsersResponse,
    _reader: BinaryReader
  ) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          const messageInitializer1 = new User();
          _reader.readMessage(
            messageInitializer1,
            User.deserializeBinaryFromReader
          );
          (_instance.users = _instance.users || []).push(messageInitializer1);
          break;
        case 2:
          _instance.nextPageToken = _reader.readString();
          break;
        default:
          _reader.skipField();
      }
    }

    ListUsersResponse.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(
    _instance: ListUsersResponse,
    _writer: BinaryWriter
  ) {
    if (_instance.users && _instance.users.length) {
      _writer.writeRepeatedMessage(
        1,
        _instance.users as any,
        User.serializeBinaryToWriter
      );
    }
    if (_instance.nextPageToken) {
      _writer.writeString(2, _instance.nextPageToken);
    }
  }

  private _users?: User[];
  private _nextPageToken?: string;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of ListUsersResponse to deeply clone from
   */
  constructor(_value?: RecursivePartial<ListUsersResponse.AsObject>) {
    _value = _value || {};
    this.users = (_value.users || []).map(m => new User(m));
    this.nextPageToken = _value.nextPageToken;
    ListUsersResponse.refineValues(this);
  }
  get users(): User[] | undefined {
    return this._users;
  }
  set users(value: User[] | undefined) {
    this._users = value;
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
    ListUsersResponse.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): ListUsersResponse.AsObject {
    return {
      users: (this.users || []).map(m => m.toObject()),
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
  ): ListUsersResponse.AsProtobufJSON {
    return {
      users: (this.users || []).map(m => m.toProtobufJSON(options)),
      nextPageToken: this.nextPageToken
    };
  }
}
export module ListUsersResponse {
  /**
   * Standard JavaScript object representation for ListUsersResponse
   */
  export interface AsObject {
    users?: User.AsObject[];
    nextPageToken?: string;
  }

  /**
   * Protobuf JSON representation for ListUsersResponse
   */
  export interface AsProtobufJSON {
    users?: User.AsProtobufJSON[] | null;
    nextPageToken?: string;
  }
}

/**
 * Message implementation for routeguide.SendVerificationCodeRequest
 */
export class SendVerificationCodeRequest implements GrpcMessage {
  static id = 'routeguide.SendVerificationCodeRequest';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new SendVerificationCodeRequest();
    SendVerificationCodeRequest.deserializeBinaryFromReader(
      instance,
      new BinaryReader(bytes)
    );
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: SendVerificationCodeRequest) {
    _instance.email = _instance.email || '';
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: SendVerificationCodeRequest,
    _reader: BinaryReader
  ) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          _instance.email = _reader.readString();
          break;
        default:
          _reader.skipField();
      }
    }

    SendVerificationCodeRequest.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(
    _instance: SendVerificationCodeRequest,
    _writer: BinaryWriter
  ) {
    if (_instance.email) {
      _writer.writeString(1, _instance.email);
    }
  }

  private _email?: string;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of SendVerificationCodeRequest to deeply clone from
   */
  constructor(_value?: RecursivePartial<SendVerificationCodeRequest.AsObject>) {
    _value = _value || {};
    this.email = _value.email;
    SendVerificationCodeRequest.refineValues(this);
  }
  get email(): string | undefined {
    return this._email;
  }
  set email(value: string | undefined) {
    this._email = value;
  }

  /**
   * Serialize message to binary data
   * @param instance message instance
   */
  serializeBinary() {
    const writer = new BinaryWriter();
    SendVerificationCodeRequest.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): SendVerificationCodeRequest.AsObject {
    return {
      email: this.email
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
  ): SendVerificationCodeRequest.AsProtobufJSON {
    return {
      email: this.email
    };
  }
}
export module SendVerificationCodeRequest {
  /**
   * Standard JavaScript object representation for SendVerificationCodeRequest
   */
  export interface AsObject {
    email?: string;
  }

  /**
   * Protobuf JSON representation for SendVerificationCodeRequest
   */
  export interface AsProtobufJSON {
    email?: string;
  }
}

/**
 * Message implementation for routeguide.VerifyEmailRequest
 */
export class VerifyEmailRequest implements GrpcMessage {
  static id = 'routeguide.VerifyEmailRequest';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new VerifyEmailRequest();
    VerifyEmailRequest.deserializeBinaryFromReader(
      instance,
      new BinaryReader(bytes)
    );
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: VerifyEmailRequest) {
    _instance.email = _instance.email || '';
    _instance.verificationCode = _instance.verificationCode || '';
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: VerifyEmailRequest,
    _reader: BinaryReader
  ) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          _instance.email = _reader.readString();
          break;
        case 2:
          _instance.verificationCode = _reader.readString();
          break;
        default:
          _reader.skipField();
      }
    }

    VerifyEmailRequest.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(
    _instance: VerifyEmailRequest,
    _writer: BinaryWriter
  ) {
    if (_instance.email) {
      _writer.writeString(1, _instance.email);
    }
    if (_instance.verificationCode) {
      _writer.writeString(2, _instance.verificationCode);
    }
  }

  private _email?: string;
  private _verificationCode?: string;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of VerifyEmailRequest to deeply clone from
   */
  constructor(_value?: RecursivePartial<VerifyEmailRequest.AsObject>) {
    _value = _value || {};
    this.email = _value.email;
    this.verificationCode = _value.verificationCode;
    VerifyEmailRequest.refineValues(this);
  }
  get email(): string | undefined {
    return this._email;
  }
  set email(value: string | undefined) {
    this._email = value;
  }
  get verificationCode(): string | undefined {
    return this._verificationCode;
  }
  set verificationCode(value: string | undefined) {
    this._verificationCode = value;
  }

  /**
   * Serialize message to binary data
   * @param instance message instance
   */
  serializeBinary() {
    const writer = new BinaryWriter();
    VerifyEmailRequest.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): VerifyEmailRequest.AsObject {
    return {
      email: this.email,
      verificationCode: this.verificationCode
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
  ): VerifyEmailRequest.AsProtobufJSON {
    return {
      email: this.email,
      verificationCode: this.verificationCode
    };
  }
}
export module VerifyEmailRequest {
  /**
   * Standard JavaScript object representation for VerifyEmailRequest
   */
  export interface AsObject {
    email?: string;
    verificationCode?: string;
  }

  /**
   * Protobuf JSON representation for VerifyEmailRequest
   */
  export interface AsProtobufJSON {
    email?: string;
    verificationCode?: string;
  }
}

/**
 * Message implementation for routeguide.VerifyEmailResponse
 */
export class VerifyEmailResponse implements GrpcMessage {
  static id = 'routeguide.VerifyEmailResponse';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new VerifyEmailResponse();
    VerifyEmailResponse.deserializeBinaryFromReader(
      instance,
      new BinaryReader(bytes)
    );
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: VerifyEmailResponse) {
    _instance.ok = _instance.ok || false;
    _instance.user = _instance.user || undefined;
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: VerifyEmailResponse,
    _reader: BinaryReader
  ) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          _instance.ok = _reader.readBool();
          break;
        case 2:
          _instance.user = new User();
          _reader.readMessage(_instance.user, User.deserializeBinaryFromReader);
          break;
        default:
          _reader.skipField();
      }
    }

    VerifyEmailResponse.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(
    _instance: VerifyEmailResponse,
    _writer: BinaryWriter
  ) {
    if (_instance.ok) {
      _writer.writeBool(1, _instance.ok);
    }
    if (_instance.user) {
      _writer.writeMessage(
        2,
        _instance.user as any,
        User.serializeBinaryToWriter
      );
    }
  }

  private _ok?: boolean;
  private _user?: User;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of VerifyEmailResponse to deeply clone from
   */
  constructor(_value?: RecursivePartial<VerifyEmailResponse.AsObject>) {
    _value = _value || {};
    this.ok = _value.ok;
    this.user = _value.user ? new User(_value.user) : undefined;
    VerifyEmailResponse.refineValues(this);
  }
  get ok(): boolean | undefined {
    return this._ok;
  }
  set ok(value: boolean | undefined) {
    this._ok = value;
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
    VerifyEmailResponse.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): VerifyEmailResponse.AsObject {
    return {
      ok: this.ok,
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
  ): VerifyEmailResponse.AsProtobufJSON {
    return {
      ok: this.ok,
      user: this.user ? this.user.toProtobufJSON(options) : null
    };
  }
}
export module VerifyEmailResponse {
  /**
   * Standard JavaScript object representation for VerifyEmailResponse
   */
  export interface AsObject {
    ok?: boolean;
    user?: User.AsObject;
  }

  /**
   * Protobuf JSON representation for VerifyEmailResponse
   */
  export interface AsProtobufJSON {
    ok?: boolean;
    user?: User.AsProtobufJSON | null;
  }
}

/**
 * Message implementation for routeguide.ValidateNewUserRequest
 */
export class ValidateNewUserRequest implements GrpcMessage {
  static id = 'routeguide.ValidateNewUserRequest';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new ValidateNewUserRequest();
    ValidateNewUserRequest.deserializeBinaryFromReader(
      instance,
      new BinaryReader(bytes)
    );
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: ValidateNewUserRequest) {
    _instance.user = _instance.user || undefined;
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: ValidateNewUserRequest,
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

    ValidateNewUserRequest.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(
    _instance: ValidateNewUserRequest,
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
   * @param _value initial values object or instance of ValidateNewUserRequest to deeply clone from
   */
  constructor(_value?: RecursivePartial<ValidateNewUserRequest.AsObject>) {
    _value = _value || {};
    this.user = _value.user ? new User(_value.user) : undefined;
    ValidateNewUserRequest.refineValues(this);
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
    ValidateNewUserRequest.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): ValidateNewUserRequest.AsObject {
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
  ): ValidateNewUserRequest.AsProtobufJSON {
    return {
      user: this.user ? this.user.toProtobufJSON(options) : null
    };
  }
}
export module ValidateNewUserRequest {
  /**
   * Standard JavaScript object representation for ValidateNewUserRequest
   */
  export interface AsObject {
    user?: User.AsObject;
  }

  /**
   * Protobuf JSON representation for ValidateNewUserRequest
   */
  export interface AsProtobufJSON {
    user?: User.AsProtobufJSON | null;
  }
}

/**
 * Message implementation for routeguide.ListActivitiesRequest
 */
export class ListActivitiesRequest implements GrpcMessage {
  static id = 'routeguide.ListActivitiesRequest';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new ListActivitiesRequest();
    ListActivitiesRequest.deserializeBinaryFromReader(
      instance,
      new BinaryReader(bytes)
    );
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: ListActivitiesRequest) {
    _instance.parent = _instance.parent || '';
    _instance.pageSize = _instance.pageSize || '0';
    _instance.pageToken = _instance.pageToken || '';
    _instance.orderBy = _instance.orderBy || '';
    _instance.filter = _instance.filter || '';
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: ListActivitiesRequest,
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
        case 4:
          _instance.orderBy = _reader.readString();
          break;
        case 5:
          _instance.filter = _reader.readString();
          break;
        default:
          _reader.skipField();
      }
    }

    ListActivitiesRequest.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(
    _instance: ListActivitiesRequest,
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
    if (_instance.orderBy) {
      _writer.writeString(4, _instance.orderBy);
    }
    if (_instance.filter) {
      _writer.writeString(5, _instance.filter);
    }
  }

  private _parent?: string;
  private _pageSize?: string;
  private _pageToken?: string;
  private _orderBy?: string;
  private _filter?: string;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of ListActivitiesRequest to deeply clone from
   */
  constructor(_value?: RecursivePartial<ListActivitiesRequest.AsObject>) {
    _value = _value || {};
    this.parent = _value.parent;
    this.pageSize = _value.pageSize;
    this.pageToken = _value.pageToken;
    this.orderBy = _value.orderBy;
    this.filter = _value.filter;
    ListActivitiesRequest.refineValues(this);
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
  get orderBy(): string | undefined {
    return this._orderBy;
  }
  set orderBy(value: string | undefined) {
    this._orderBy = value;
  }
  get filter(): string | undefined {
    return this._filter;
  }
  set filter(value: string | undefined) {
    this._filter = value;
  }

  /**
   * Serialize message to binary data
   * @param instance message instance
   */
  serializeBinary() {
    const writer = new BinaryWriter();
    ListActivitiesRequest.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): ListActivitiesRequest.AsObject {
    return {
      parent: this.parent,
      pageSize: this.pageSize,
      pageToken: this.pageToken,
      orderBy: this.orderBy,
      filter: this.filter
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
  ): ListActivitiesRequest.AsProtobufJSON {
    return {
      parent: this.parent,
      pageSize: this.pageSize,
      pageToken: this.pageToken,
      orderBy: this.orderBy,
      filter: this.filter
    };
  }
}
export module ListActivitiesRequest {
  /**
   * Standard JavaScript object representation for ListActivitiesRequest
   */
  export interface AsObject {
    parent?: string;
    pageSize?: string;
    pageToken?: string;
    orderBy?: string;
    filter?: string;
  }

  /**
   * Protobuf JSON representation for ListActivitiesRequest
   */
  export interface AsProtobufJSON {
    parent?: string;
    pageSize?: string;
    pageToken?: string;
    orderBy?: string;
    filter?: string;
  }
}

/**
 * Message implementation for routeguide.ListActivitiesResponse
 */
export class ListActivitiesResponse implements GrpcMessage {
  static id = 'routeguide.ListActivitiesResponse';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new ListActivitiesResponse();
    ListActivitiesResponse.deserializeBinaryFromReader(
      instance,
      new BinaryReader(bytes)
    );
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: ListActivitiesResponse) {
    _instance.activities = _instance.activities || [];
    _instance.nextPageToken = _instance.nextPageToken || '';
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: ListActivitiesResponse,
    _reader: BinaryReader
  ) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          const messageInitializer1 = new Activity();
          _reader.readMessage(
            messageInitializer1,
            Activity.deserializeBinaryFromReader
          );
          (_instance.activities = _instance.activities || []).push(
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

    ListActivitiesResponse.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(
    _instance: ListActivitiesResponse,
    _writer: BinaryWriter
  ) {
    if (_instance.activities && _instance.activities.length) {
      _writer.writeRepeatedMessage(
        1,
        _instance.activities as any,
        Activity.serializeBinaryToWriter
      );
    }
    if (_instance.nextPageToken) {
      _writer.writeString(2, _instance.nextPageToken);
    }
  }

  private _activities?: Activity[];
  private _nextPageToken?: string;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of ListActivitiesResponse to deeply clone from
   */
  constructor(_value?: RecursivePartial<ListActivitiesResponse.AsObject>) {
    _value = _value || {};
    this.activities = (_value.activities || []).map(m => new Activity(m));
    this.nextPageToken = _value.nextPageToken;
    ListActivitiesResponse.refineValues(this);
  }
  get activities(): Activity[] | undefined {
    return this._activities;
  }
  set activities(value: Activity[] | undefined) {
    this._activities = value;
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
    ListActivitiesResponse.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): ListActivitiesResponse.AsObject {
    return {
      activities: (this.activities || []).map(m => m.toObject()),
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
  ): ListActivitiesResponse.AsProtobufJSON {
    return {
      activities: (this.activities || []).map(m => m.toProtobufJSON(options)),
      nextPageToken: this.nextPageToken
    };
  }
}
export module ListActivitiesResponse {
  /**
   * Standard JavaScript object representation for ListActivitiesResponse
   */
  export interface AsObject {
    activities?: Activity.AsObject[];
    nextPageToken?: string;
  }

  /**
   * Protobuf JSON representation for ListActivitiesResponse
   */
  export interface AsProtobufJSON {
    activities?: Activity.AsProtobufJSON[] | null;
    nextPageToken?: string;
  }
}

/**
 * Message implementation for routeguide.ListNotificationsRequest
 */
export class ListNotificationsRequest implements GrpcMessage {
  static id = 'routeguide.ListNotificationsRequest';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new ListNotificationsRequest();
    ListNotificationsRequest.deserializeBinaryFromReader(
      instance,
      new BinaryReader(bytes)
    );
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: ListNotificationsRequest) {
    _instance.parent = _instance.parent || '';
    _instance.pageSize = _instance.pageSize || '0';
    _instance.pageToken = _instance.pageToken || '';
    _instance.orderBy = _instance.orderBy || '';
    _instance.filter = _instance.filter || '';
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: ListNotificationsRequest,
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
        case 4:
          _instance.orderBy = _reader.readString();
          break;
        case 5:
          _instance.filter = _reader.readString();
          break;
        default:
          _reader.skipField();
      }
    }

    ListNotificationsRequest.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(
    _instance: ListNotificationsRequest,
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
    if (_instance.orderBy) {
      _writer.writeString(4, _instance.orderBy);
    }
    if (_instance.filter) {
      _writer.writeString(5, _instance.filter);
    }
  }

  private _parent?: string;
  private _pageSize?: string;
  private _pageToken?: string;
  private _orderBy?: string;
  private _filter?: string;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of ListNotificationsRequest to deeply clone from
   */
  constructor(_value?: RecursivePartial<ListNotificationsRequest.AsObject>) {
    _value = _value || {};
    this.parent = _value.parent;
    this.pageSize = _value.pageSize;
    this.pageToken = _value.pageToken;
    this.orderBy = _value.orderBy;
    this.filter = _value.filter;
    ListNotificationsRequest.refineValues(this);
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
  get orderBy(): string | undefined {
    return this._orderBy;
  }
  set orderBy(value: string | undefined) {
    this._orderBy = value;
  }
  get filter(): string | undefined {
    return this._filter;
  }
  set filter(value: string | undefined) {
    this._filter = value;
  }

  /**
   * Serialize message to binary data
   * @param instance message instance
   */
  serializeBinary() {
    const writer = new BinaryWriter();
    ListNotificationsRequest.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): ListNotificationsRequest.AsObject {
    return {
      parent: this.parent,
      pageSize: this.pageSize,
      pageToken: this.pageToken,
      orderBy: this.orderBy,
      filter: this.filter
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
  ): ListNotificationsRequest.AsProtobufJSON {
    return {
      parent: this.parent,
      pageSize: this.pageSize,
      pageToken: this.pageToken,
      orderBy: this.orderBy,
      filter: this.filter
    };
  }
}
export module ListNotificationsRequest {
  /**
   * Standard JavaScript object representation for ListNotificationsRequest
   */
  export interface AsObject {
    parent?: string;
    pageSize?: string;
    pageToken?: string;
    orderBy?: string;
    filter?: string;
  }

  /**
   * Protobuf JSON representation for ListNotificationsRequest
   */
  export interface AsProtobufJSON {
    parent?: string;
    pageSize?: string;
    pageToken?: string;
    orderBy?: string;
    filter?: string;
  }
}

/**
 * Message implementation for routeguide.ListNotificationsResponse
 */
export class ListNotificationsResponse implements GrpcMessage {
  static id = 'routeguide.ListNotificationsResponse';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new ListNotificationsResponse();
    ListNotificationsResponse.deserializeBinaryFromReader(
      instance,
      new BinaryReader(bytes)
    );
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: ListNotificationsResponse) {
    _instance.nextPageToken = _instance.nextPageToken || '';
    _instance.notifications = _instance.notifications || [];
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: ListNotificationsResponse,
    _reader: BinaryReader
  ) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          _instance.nextPageToken = _reader.readString();
          break;
        case 2:
          const messageInitializer2 = new Notification();
          _reader.readMessage(
            messageInitializer2,
            Notification.deserializeBinaryFromReader
          );
          (_instance.notifications = _instance.notifications || []).push(
            messageInitializer2
          );
          break;
        default:
          _reader.skipField();
      }
    }

    ListNotificationsResponse.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(
    _instance: ListNotificationsResponse,
    _writer: BinaryWriter
  ) {
    if (_instance.nextPageToken) {
      _writer.writeString(1, _instance.nextPageToken);
    }
    if (_instance.notifications && _instance.notifications.length) {
      _writer.writeRepeatedMessage(
        2,
        _instance.notifications as any,
        Notification.serializeBinaryToWriter
      );
    }
  }

  private _nextPageToken?: string;
  private _notifications?: Notification[];

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of ListNotificationsResponse to deeply clone from
   */
  constructor(_value?: RecursivePartial<ListNotificationsResponse.AsObject>) {
    _value = _value || {};
    this.nextPageToken = _value.nextPageToken;
    this.notifications = (_value.notifications || []).map(
      m => new Notification(m)
    );
    ListNotificationsResponse.refineValues(this);
  }
  get nextPageToken(): string | undefined {
    return this._nextPageToken;
  }
  set nextPageToken(value: string | undefined) {
    this._nextPageToken = value;
  }
  get notifications(): Notification[] | undefined {
    return this._notifications;
  }
  set notifications(value: Notification[] | undefined) {
    this._notifications = value;
  }

  /**
   * Serialize message to binary data
   * @param instance message instance
   */
  serializeBinary() {
    const writer = new BinaryWriter();
    ListNotificationsResponse.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): ListNotificationsResponse.AsObject {
    return {
      nextPageToken: this.nextPageToken,
      notifications: (this.notifications || []).map(m => m.toObject())
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
  ): ListNotificationsResponse.AsProtobufJSON {
    return {
      nextPageToken: this.nextPageToken,
      notifications: (this.notifications || []).map(m =>
        m.toProtobufJSON(options)
      )
    };
  }
}
export module ListNotificationsResponse {
  /**
   * Standard JavaScript object representation for ListNotificationsResponse
   */
  export interface AsObject {
    nextPageToken?: string;
    notifications?: Notification.AsObject[];
  }

  /**
   * Protobuf JSON representation for ListNotificationsResponse
   */
  export interface AsProtobufJSON {
    nextPageToken?: string;
    notifications?: Notification.AsProtobufJSON[] | null;
  }
}

/**
 * Message implementation for routeguide.UpdateNotificationRequest
 */
export class UpdateNotificationRequest implements GrpcMessage {
  static id = 'routeguide.UpdateNotificationRequest';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new UpdateNotificationRequest();
    UpdateNotificationRequest.deserializeBinaryFromReader(
      instance,
      new BinaryReader(bytes)
    );
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: UpdateNotificationRequest) {
    _instance.notification = _instance.notification || undefined;
    _instance.updateMask = _instance.updateMask || undefined;
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: UpdateNotificationRequest,
    _reader: BinaryReader
  ) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          _instance.notification = new Notification();
          _reader.readMessage(
            _instance.notification,
            Notification.deserializeBinaryFromReader
          );
          break;
        case 2:
          _instance.updateMask = new FieldMask();
          _reader.readMessage(
            _instance.updateMask,
            FieldMask.deserializeBinaryFromReader
          );
          break;
        default:
          _reader.skipField();
      }
    }

    UpdateNotificationRequest.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(
    _instance: UpdateNotificationRequest,
    _writer: BinaryWriter
  ) {
    if (_instance.notification) {
      _writer.writeMessage(
        1,
        _instance.notification as any,
        Notification.serializeBinaryToWriter
      );
    }
    if (_instance.updateMask) {
      _writer.writeMessage(
        2,
        _instance.updateMask as any,
        FieldMask.serializeBinaryToWriter
      );
    }
  }

  private _notification?: Notification;
  private _updateMask?: FieldMask;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of UpdateNotificationRequest to deeply clone from
   */
  constructor(_value?: RecursivePartial<UpdateNotificationRequest.AsObject>) {
    _value = _value || {};
    this.notification = _value.notification
      ? new Notification(_value.notification)
      : undefined;
    this.updateMask = _value.updateMask
      ? new FieldMask(_value.updateMask)
      : undefined;
    UpdateNotificationRequest.refineValues(this);
  }
  get notification(): Notification | undefined {
    return this._notification;
  }
  set notification(value: Notification | undefined) {
    this._notification = value;
  }
  get updateMask(): FieldMask | undefined {
    return this._updateMask;
  }
  set updateMask(value: FieldMask | undefined) {
    this._updateMask = value;
  }

  /**
   * Serialize message to binary data
   * @param instance message instance
   */
  serializeBinary() {
    const writer = new BinaryWriter();
    UpdateNotificationRequest.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): UpdateNotificationRequest.AsObject {
    return {
      notification: this.notification
        ? this.notification.toObject()
        : undefined,
      updateMask: this.updateMask ? this.updateMask.toObject() : undefined
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
  ): UpdateNotificationRequest.AsProtobufJSON {
    return {
      notification: this.notification
        ? this.notification.toProtobufJSON(options)
        : null,
      updateMask: this.updateMask
        ? this.updateMask.toProtobufJSON(options)
        : null
    };
  }
}
export module UpdateNotificationRequest {
  /**
   * Standard JavaScript object representation for UpdateNotificationRequest
   */
  export interface AsObject {
    notification?: Notification.AsObject;
    updateMask?: FieldMask.AsObject;
  }

  /**
   * Protobuf JSON representation for UpdateNotificationRequest
   */
  export interface AsProtobufJSON {
    notification?: Notification.AsProtobufJSON | null;
    updateMask?: FieldMask.AsProtobufJSON | null;
  }
}

/**
 * Message implementation for routeguide.CreateTagRequest
 */
export class CreateTagRequest implements GrpcMessage {
  static id = 'routeguide.CreateTagRequest';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new CreateTagRequest();
    CreateTagRequest.deserializeBinaryFromReader(
      instance,
      new BinaryReader(bytes)
    );
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: CreateTagRequest) {
    _instance.parent = _instance.parent || '';
    _instance.tag = _instance.tag || undefined;
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: CreateTagRequest,
    _reader: BinaryReader
  ) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          _instance.parent = _reader.readString();
          break;
        case 2:
          _instance.tag = new Tag();
          _reader.readMessage(_instance.tag, Tag.deserializeBinaryFromReader);
          break;
        default:
          _reader.skipField();
      }
    }

    CreateTagRequest.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(
    _instance: CreateTagRequest,
    _writer: BinaryWriter
  ) {
    if (_instance.parent) {
      _writer.writeString(1, _instance.parent);
    }
    if (_instance.tag) {
      _writer.writeMessage(
        2,
        _instance.tag as any,
        Tag.serializeBinaryToWriter
      );
    }
  }

  private _parent?: string;
  private _tag?: Tag;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of CreateTagRequest to deeply clone from
   */
  constructor(_value?: RecursivePartial<CreateTagRequest.AsObject>) {
    _value = _value || {};
    this.parent = _value.parent;
    this.tag = _value.tag ? new Tag(_value.tag) : undefined;
    CreateTagRequest.refineValues(this);
  }
  get parent(): string | undefined {
    return this._parent;
  }
  set parent(value: string | undefined) {
    this._parent = value;
  }
  get tag(): Tag | undefined {
    return this._tag;
  }
  set tag(value: Tag | undefined) {
    this._tag = value;
  }

  /**
   * Serialize message to binary data
   * @param instance message instance
   */
  serializeBinary() {
    const writer = new BinaryWriter();
    CreateTagRequest.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): CreateTagRequest.AsObject {
    return {
      parent: this.parent,
      tag: this.tag ? this.tag.toObject() : undefined
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
  ): CreateTagRequest.AsProtobufJSON {
    return {
      parent: this.parent,
      tag: this.tag ? this.tag.toProtobufJSON(options) : null
    };
  }
}
export module CreateTagRequest {
  /**
   * Standard JavaScript object representation for CreateTagRequest
   */
  export interface AsObject {
    parent?: string;
    tag?: Tag.AsObject;
  }

  /**
   * Protobuf JSON representation for CreateTagRequest
   */
  export interface AsProtobufJSON {
    parent?: string;
    tag?: Tag.AsProtobufJSON | null;
  }
}

/**
 * Message implementation for routeguide.ListTagsRequest
 */
export class ListTagsRequest implements GrpcMessage {
  static id = 'routeguide.ListTagsRequest';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new ListTagsRequest();
    ListTagsRequest.deserializeBinaryFromReader(
      instance,
      new BinaryReader(bytes)
    );
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: ListTagsRequest) {
    _instance.parent = _instance.parent || '';
    _instance.pageSize = _instance.pageSize || '0';
    _instance.pageToken = _instance.pageToken || '';
    _instance.orderBy = _instance.orderBy || '';
    _instance.filter = _instance.filter || '';
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: ListTagsRequest,
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
        case 4:
          _instance.orderBy = _reader.readString();
          break;
        case 5:
          _instance.filter = _reader.readString();
          break;
        default:
          _reader.skipField();
      }
    }

    ListTagsRequest.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(
    _instance: ListTagsRequest,
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
    if (_instance.orderBy) {
      _writer.writeString(4, _instance.orderBy);
    }
    if (_instance.filter) {
      _writer.writeString(5, _instance.filter);
    }
  }

  private _parent?: string;
  private _pageSize?: string;
  private _pageToken?: string;
  private _orderBy?: string;
  private _filter?: string;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of ListTagsRequest to deeply clone from
   */
  constructor(_value?: RecursivePartial<ListTagsRequest.AsObject>) {
    _value = _value || {};
    this.parent = _value.parent;
    this.pageSize = _value.pageSize;
    this.pageToken = _value.pageToken;
    this.orderBy = _value.orderBy;
    this.filter = _value.filter;
    ListTagsRequest.refineValues(this);
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
  get orderBy(): string | undefined {
    return this._orderBy;
  }
  set orderBy(value: string | undefined) {
    this._orderBy = value;
  }
  get filter(): string | undefined {
    return this._filter;
  }
  set filter(value: string | undefined) {
    this._filter = value;
  }

  /**
   * Serialize message to binary data
   * @param instance message instance
   */
  serializeBinary() {
    const writer = new BinaryWriter();
    ListTagsRequest.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): ListTagsRequest.AsObject {
    return {
      parent: this.parent,
      pageSize: this.pageSize,
      pageToken: this.pageToken,
      orderBy: this.orderBy,
      filter: this.filter
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
  ): ListTagsRequest.AsProtobufJSON {
    return {
      parent: this.parent,
      pageSize: this.pageSize,
      pageToken: this.pageToken,
      orderBy: this.orderBy,
      filter: this.filter
    };
  }
}
export module ListTagsRequest {
  /**
   * Standard JavaScript object representation for ListTagsRequest
   */
  export interface AsObject {
    parent?: string;
    pageSize?: string;
    pageToken?: string;
    orderBy?: string;
    filter?: string;
  }

  /**
   * Protobuf JSON representation for ListTagsRequest
   */
  export interface AsProtobufJSON {
    parent?: string;
    pageSize?: string;
    pageToken?: string;
    orderBy?: string;
    filter?: string;
  }
}

/**
 * Message implementation for routeguide.ListTagsResponse
 */
export class ListTagsResponse implements GrpcMessage {
  static id = 'routeguide.ListTagsResponse';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new ListTagsResponse();
    ListTagsResponse.deserializeBinaryFromReader(
      instance,
      new BinaryReader(bytes)
    );
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: ListTagsResponse) {
    _instance.tags = _instance.tags || [];
    _instance.nextPageToken = _instance.nextPageToken || '';
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: ListTagsResponse,
    _reader: BinaryReader
  ) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          const messageInitializer1 = new Tag();
          _reader.readMessage(
            messageInitializer1,
            Tag.deserializeBinaryFromReader
          );
          (_instance.tags = _instance.tags || []).push(messageInitializer1);
          break;
        case 2:
          _instance.nextPageToken = _reader.readString();
          break;
        default:
          _reader.skipField();
      }
    }

    ListTagsResponse.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(
    _instance: ListTagsResponse,
    _writer: BinaryWriter
  ) {
    if (_instance.tags && _instance.tags.length) {
      _writer.writeRepeatedMessage(
        1,
        _instance.tags as any,
        Tag.serializeBinaryToWriter
      );
    }
    if (_instance.nextPageToken) {
      _writer.writeString(2, _instance.nextPageToken);
    }
  }

  private _tags?: Tag[];
  private _nextPageToken?: string;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of ListTagsResponse to deeply clone from
   */
  constructor(_value?: RecursivePartial<ListTagsResponse.AsObject>) {
    _value = _value || {};
    this.tags = (_value.tags || []).map(m => new Tag(m));
    this.nextPageToken = _value.nextPageToken;
    ListTagsResponse.refineValues(this);
  }
  get tags(): Tag[] | undefined {
    return this._tags;
  }
  set tags(value: Tag[] | undefined) {
    this._tags = value;
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
    ListTagsResponse.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): ListTagsResponse.AsObject {
    return {
      tags: (this.tags || []).map(m => m.toObject()),
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
  ): ListTagsResponse.AsProtobufJSON {
    return {
      tags: (this.tags || []).map(m => m.toProtobufJSON(options)),
      nextPageToken: this.nextPageToken
    };
  }
}
export module ListTagsResponse {
  /**
   * Standard JavaScript object representation for ListTagsResponse
   */
  export interface AsObject {
    tags?: Tag.AsObject[];
    nextPageToken?: string;
  }

  /**
   * Protobuf JSON representation for ListTagsResponse
   */
  export interface AsProtobufJSON {
    tags?: Tag.AsProtobufJSON[] | null;
    nextPageToken?: string;
  }
}

/**
 * Message implementation for routeguide.DeleteTagRequest
 */
export class DeleteTagRequest implements GrpcMessage {
  static id = 'routeguide.DeleteTagRequest';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new DeleteTagRequest();
    DeleteTagRequest.deserializeBinaryFromReader(
      instance,
      new BinaryReader(bytes)
    );
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: DeleteTagRequest) {
    _instance.name = _instance.name || '';
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: DeleteTagRequest,
    _reader: BinaryReader
  ) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          _instance.name = _reader.readString();
          break;
        default:
          _reader.skipField();
      }
    }

    DeleteTagRequest.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(
    _instance: DeleteTagRequest,
    _writer: BinaryWriter
  ) {
    if (_instance.name) {
      _writer.writeString(1, _instance.name);
    }
  }

  private _name?: string;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of DeleteTagRequest to deeply clone from
   */
  constructor(_value?: RecursivePartial<DeleteTagRequest.AsObject>) {
    _value = _value || {};
    this.name = _value.name;
    DeleteTagRequest.refineValues(this);
  }
  get name(): string | undefined {
    return this._name;
  }
  set name(value: string | undefined) {
    this._name = value;
  }

  /**
   * Serialize message to binary data
   * @param instance message instance
   */
  serializeBinary() {
    const writer = new BinaryWriter();
    DeleteTagRequest.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): DeleteTagRequest.AsObject {
    return {
      name: this.name
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
  ): DeleteTagRequest.AsProtobufJSON {
    return {
      name: this.name
    };
  }
}
export module DeleteTagRequest {
  /**
   * Standard JavaScript object representation for DeleteTagRequest
   */
  export interface AsObject {
    name?: string;
  }

  /**
   * Protobuf JSON representation for DeleteTagRequest
   */
  export interface AsProtobufJSON {
    name?: string;
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
 * Message implementation for routeguide.GetAdminMessageRequest
 */
export class GetAdminMessageRequest implements GrpcMessage {
  static id = 'routeguide.GetAdminMessageRequest';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new GetAdminMessageRequest();
    GetAdminMessageRequest.deserializeBinaryFromReader(
      instance,
      new BinaryReader(bytes)
    );
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: GetAdminMessageRequest) {}

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: GetAdminMessageRequest,
    _reader: BinaryReader
  ) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        default:
          _reader.skipField();
      }
    }

    GetAdminMessageRequest.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(
    _instance: GetAdminMessageRequest,
    _writer: BinaryWriter
  ) {}

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of GetAdminMessageRequest to deeply clone from
   */
  constructor(_value?: RecursivePartial<GetAdminMessageRequest.AsObject>) {
    _value = _value || {};
    GetAdminMessageRequest.refineValues(this);
  }

  /**
   * Serialize message to binary data
   * @param instance message instance
   */
  serializeBinary() {
    const writer = new BinaryWriter();
    GetAdminMessageRequest.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): GetAdminMessageRequest.AsObject {
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
  ): GetAdminMessageRequest.AsProtobufJSON {
    return {};
  }
}
export module GetAdminMessageRequest {
  /**
   * Standard JavaScript object representation for GetAdminMessageRequest
   */
  export interface AsObject {}

  /**
   * Protobuf JSON representation for GetAdminMessageRequest
   */
  export interface AsProtobufJSON {}
}

/**
 * Message implementation for routeguide.CreateSubscriptionRequest
 */
export class CreateSubscriptionRequest implements GrpcMessage {
  static id = 'routeguide.CreateSubscriptionRequest';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new CreateSubscriptionRequest();
    CreateSubscriptionRequest.deserializeBinaryFromReader(
      instance,
      new BinaryReader(bytes)
    );
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: CreateSubscriptionRequest) {
    _instance.parent = _instance.parent || '';
    _instance.subscription = _instance.subscription || undefined;
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: CreateSubscriptionRequest,
    _reader: BinaryReader
  ) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          _instance.parent = _reader.readString();
          break;
        case 2:
          _instance.subscription = new Subscription();
          _reader.readMessage(
            _instance.subscription,
            Subscription.deserializeBinaryFromReader
          );
          break;
        default:
          _reader.skipField();
      }
    }

    CreateSubscriptionRequest.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(
    _instance: CreateSubscriptionRequest,
    _writer: BinaryWriter
  ) {
    if (_instance.parent) {
      _writer.writeString(1, _instance.parent);
    }
    if (_instance.subscription) {
      _writer.writeMessage(
        2,
        _instance.subscription as any,
        Subscription.serializeBinaryToWriter
      );
    }
  }

  private _parent?: string;
  private _subscription?: Subscription;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of CreateSubscriptionRequest to deeply clone from
   */
  constructor(_value?: RecursivePartial<CreateSubscriptionRequest.AsObject>) {
    _value = _value || {};
    this.parent = _value.parent;
    this.subscription = _value.subscription
      ? new Subscription(_value.subscription)
      : undefined;
    CreateSubscriptionRequest.refineValues(this);
  }
  get parent(): string | undefined {
    return this._parent;
  }
  set parent(value: string | undefined) {
    this._parent = value;
  }
  get subscription(): Subscription | undefined {
    return this._subscription;
  }
  set subscription(value: Subscription | undefined) {
    this._subscription = value;
  }

  /**
   * Serialize message to binary data
   * @param instance message instance
   */
  serializeBinary() {
    const writer = new BinaryWriter();
    CreateSubscriptionRequest.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): CreateSubscriptionRequest.AsObject {
    return {
      parent: this.parent,
      subscription: this.subscription ? this.subscription.toObject() : undefined
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
  ): CreateSubscriptionRequest.AsProtobufJSON {
    return {
      parent: this.parent,
      subscription: this.subscription
        ? this.subscription.toProtobufJSON(options)
        : null
    };
  }
}
export module CreateSubscriptionRequest {
  /**
   * Standard JavaScript object representation for CreateSubscriptionRequest
   */
  export interface AsObject {
    parent?: string;
    subscription?: Subscription.AsObject;
  }

  /**
   * Protobuf JSON representation for CreateSubscriptionRequest
   */
  export interface AsProtobufJSON {
    parent?: string;
    subscription?: Subscription.AsProtobufJSON | null;
  }
}

/**
 * Message implementation for routeguide.ListSubscriptionsRequest
 */
export class ListSubscriptionsRequest implements GrpcMessage {
  static id = 'routeguide.ListSubscriptionsRequest';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new ListSubscriptionsRequest();
    ListSubscriptionsRequest.deserializeBinaryFromReader(
      instance,
      new BinaryReader(bytes)
    );
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: ListSubscriptionsRequest) {
    _instance.parent = _instance.parent || '';
    _instance.pageSize = _instance.pageSize || '0';
    _instance.pageToken = _instance.pageToken || '';
    _instance.orderBy = _instance.orderBy || '';
    _instance.filter = _instance.filter || '';
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: ListSubscriptionsRequest,
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
        case 4:
          _instance.orderBy = _reader.readString();
          break;
        case 5:
          _instance.filter = _reader.readString();
          break;
        default:
          _reader.skipField();
      }
    }

    ListSubscriptionsRequest.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(
    _instance: ListSubscriptionsRequest,
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
    if (_instance.orderBy) {
      _writer.writeString(4, _instance.orderBy);
    }
    if (_instance.filter) {
      _writer.writeString(5, _instance.filter);
    }
  }

  private _parent?: string;
  private _pageSize?: string;
  private _pageToken?: string;
  private _orderBy?: string;
  private _filter?: string;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of ListSubscriptionsRequest to deeply clone from
   */
  constructor(_value?: RecursivePartial<ListSubscriptionsRequest.AsObject>) {
    _value = _value || {};
    this.parent = _value.parent;
    this.pageSize = _value.pageSize;
    this.pageToken = _value.pageToken;
    this.orderBy = _value.orderBy;
    this.filter = _value.filter;
    ListSubscriptionsRequest.refineValues(this);
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
  get orderBy(): string | undefined {
    return this._orderBy;
  }
  set orderBy(value: string | undefined) {
    this._orderBy = value;
  }
  get filter(): string | undefined {
    return this._filter;
  }
  set filter(value: string | undefined) {
    this._filter = value;
  }

  /**
   * Serialize message to binary data
   * @param instance message instance
   */
  serializeBinary() {
    const writer = new BinaryWriter();
    ListSubscriptionsRequest.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): ListSubscriptionsRequest.AsObject {
    return {
      parent: this.parent,
      pageSize: this.pageSize,
      pageToken: this.pageToken,
      orderBy: this.orderBy,
      filter: this.filter
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
  ): ListSubscriptionsRequest.AsProtobufJSON {
    return {
      parent: this.parent,
      pageSize: this.pageSize,
      pageToken: this.pageToken,
      orderBy: this.orderBy,
      filter: this.filter
    };
  }
}
export module ListSubscriptionsRequest {
  /**
   * Standard JavaScript object representation for ListSubscriptionsRequest
   */
  export interface AsObject {
    parent?: string;
    pageSize?: string;
    pageToken?: string;
    orderBy?: string;
    filter?: string;
  }

  /**
   * Protobuf JSON representation for ListSubscriptionsRequest
   */
  export interface AsProtobufJSON {
    parent?: string;
    pageSize?: string;
    pageToken?: string;
    orderBy?: string;
    filter?: string;
  }
}

/**
 * Message implementation for routeguide.ListSubscriptionsResponse
 */
export class ListSubscriptionsResponse implements GrpcMessage {
  static id = 'routeguide.ListSubscriptionsResponse';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new ListSubscriptionsResponse();
    ListSubscriptionsResponse.deserializeBinaryFromReader(
      instance,
      new BinaryReader(bytes)
    );
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: ListSubscriptionsResponse) {
    _instance.subscriptions = _instance.subscriptions || [];
    _instance.nextPageToken = _instance.nextPageToken || '';
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: ListSubscriptionsResponse,
    _reader: BinaryReader
  ) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          const messageInitializer1 = new Subscription();
          _reader.readMessage(
            messageInitializer1,
            Subscription.deserializeBinaryFromReader
          );
          (_instance.subscriptions = _instance.subscriptions || []).push(
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

    ListSubscriptionsResponse.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(
    _instance: ListSubscriptionsResponse,
    _writer: BinaryWriter
  ) {
    if (_instance.subscriptions && _instance.subscriptions.length) {
      _writer.writeRepeatedMessage(
        1,
        _instance.subscriptions as any,
        Subscription.serializeBinaryToWriter
      );
    }
    if (_instance.nextPageToken) {
      _writer.writeString(2, _instance.nextPageToken);
    }
  }

  private _subscriptions?: Subscription[];
  private _nextPageToken?: string;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of ListSubscriptionsResponse to deeply clone from
   */
  constructor(_value?: RecursivePartial<ListSubscriptionsResponse.AsObject>) {
    _value = _value || {};
    this.subscriptions = (_value.subscriptions || []).map(
      m => new Subscription(m)
    );
    this.nextPageToken = _value.nextPageToken;
    ListSubscriptionsResponse.refineValues(this);
  }
  get subscriptions(): Subscription[] | undefined {
    return this._subscriptions;
  }
  set subscriptions(value: Subscription[] | undefined) {
    this._subscriptions = value;
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
    ListSubscriptionsResponse.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): ListSubscriptionsResponse.AsObject {
    return {
      subscriptions: (this.subscriptions || []).map(m => m.toObject()),
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
  ): ListSubscriptionsResponse.AsProtobufJSON {
    return {
      subscriptions: (this.subscriptions || []).map(m =>
        m.toProtobufJSON(options)
      ),
      nextPageToken: this.nextPageToken
    };
  }
}
export module ListSubscriptionsResponse {
  /**
   * Standard JavaScript object representation for ListSubscriptionsResponse
   */
  export interface AsObject {
    subscriptions?: Subscription.AsObject[];
    nextPageToken?: string;
  }

  /**
   * Protobuf JSON representation for ListSubscriptionsResponse
   */
  export interface AsProtobufJSON {
    subscriptions?: Subscription.AsProtobufJSON[] | null;
    nextPageToken?: string;
  }
}

/**
 * Message implementation for routeguide.UpdateSubscriptionRequest
 */
export class UpdateSubscriptionRequest implements GrpcMessage {
  static id = 'routeguide.UpdateSubscriptionRequest';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new UpdateSubscriptionRequest();
    UpdateSubscriptionRequest.deserializeBinaryFromReader(
      instance,
      new BinaryReader(bytes)
    );
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: UpdateSubscriptionRequest) {
    _instance.subscription = _instance.subscription || undefined;
    _instance.updateMask = _instance.updateMask || undefined;
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: UpdateSubscriptionRequest,
    _reader: BinaryReader
  ) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          _instance.subscription = new Subscription();
          _reader.readMessage(
            _instance.subscription,
            Subscription.deserializeBinaryFromReader
          );
          break;
        case 2:
          _instance.updateMask = new FieldMask();
          _reader.readMessage(
            _instance.updateMask,
            FieldMask.deserializeBinaryFromReader
          );
          break;
        default:
          _reader.skipField();
      }
    }

    UpdateSubscriptionRequest.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(
    _instance: UpdateSubscriptionRequest,
    _writer: BinaryWriter
  ) {
    if (_instance.subscription) {
      _writer.writeMessage(
        1,
        _instance.subscription as any,
        Subscription.serializeBinaryToWriter
      );
    }
    if (_instance.updateMask) {
      _writer.writeMessage(
        2,
        _instance.updateMask as any,
        FieldMask.serializeBinaryToWriter
      );
    }
  }

  private _subscription?: Subscription;
  private _updateMask?: FieldMask;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of UpdateSubscriptionRequest to deeply clone from
   */
  constructor(_value?: RecursivePartial<UpdateSubscriptionRequest.AsObject>) {
    _value = _value || {};
    this.subscription = _value.subscription
      ? new Subscription(_value.subscription)
      : undefined;
    this.updateMask = _value.updateMask
      ? new FieldMask(_value.updateMask)
      : undefined;
    UpdateSubscriptionRequest.refineValues(this);
  }
  get subscription(): Subscription | undefined {
    return this._subscription;
  }
  set subscription(value: Subscription | undefined) {
    this._subscription = value;
  }
  get updateMask(): FieldMask | undefined {
    return this._updateMask;
  }
  set updateMask(value: FieldMask | undefined) {
    this._updateMask = value;
  }

  /**
   * Serialize message to binary data
   * @param instance message instance
   */
  serializeBinary() {
    const writer = new BinaryWriter();
    UpdateSubscriptionRequest.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): UpdateSubscriptionRequest.AsObject {
    return {
      subscription: this.subscription
        ? this.subscription.toObject()
        : undefined,
      updateMask: this.updateMask ? this.updateMask.toObject() : undefined
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
  ): UpdateSubscriptionRequest.AsProtobufJSON {
    return {
      subscription: this.subscription
        ? this.subscription.toProtobufJSON(options)
        : null,
      updateMask: this.updateMask
        ? this.updateMask.toProtobufJSON(options)
        : null
    };
  }
}
export module UpdateSubscriptionRequest {
  /**
   * Standard JavaScript object representation for UpdateSubscriptionRequest
   */
  export interface AsObject {
    subscription?: Subscription.AsObject;
    updateMask?: FieldMask.AsObject;
  }

  /**
   * Protobuf JSON representation for UpdateSubscriptionRequest
   */
  export interface AsProtobufJSON {
    subscription?: Subscription.AsProtobufJSON | null;
    updateMask?: FieldMask.AsProtobufJSON | null;
  }
}

/**
 * Message implementation for routeguide.DeleteSubscriptionRequest
 */
export class DeleteSubscriptionRequest implements GrpcMessage {
  static id = 'routeguide.DeleteSubscriptionRequest';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new DeleteSubscriptionRequest();
    DeleteSubscriptionRequest.deserializeBinaryFromReader(
      instance,
      new BinaryReader(bytes)
    );
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: DeleteSubscriptionRequest) {
    _instance.name = _instance.name || '';
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: DeleteSubscriptionRequest,
    _reader: BinaryReader
  ) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          _instance.name = _reader.readString();
          break;
        default:
          _reader.skipField();
      }
    }

    DeleteSubscriptionRequest.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(
    _instance: DeleteSubscriptionRequest,
    _writer: BinaryWriter
  ) {
    if (_instance.name) {
      _writer.writeString(1, _instance.name);
    }
  }

  private _name?: string;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of DeleteSubscriptionRequest to deeply clone from
   */
  constructor(_value?: RecursivePartial<DeleteSubscriptionRequest.AsObject>) {
    _value = _value || {};
    this.name = _value.name;
    DeleteSubscriptionRequest.refineValues(this);
  }
  get name(): string | undefined {
    return this._name;
  }
  set name(value: string | undefined) {
    this._name = value;
  }

  /**
   * Serialize message to binary data
   * @param instance message instance
   */
  serializeBinary() {
    const writer = new BinaryWriter();
    DeleteSubscriptionRequest.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): DeleteSubscriptionRequest.AsObject {
    return {
      name: this.name
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
  ): DeleteSubscriptionRequest.AsProtobufJSON {
    return {
      name: this.name
    };
  }
}
export module DeleteSubscriptionRequest {
  /**
   * Standard JavaScript object representation for DeleteSubscriptionRequest
   */
  export interface AsObject {
    name?: string;
  }

  /**
   * Protobuf JSON representation for DeleteSubscriptionRequest
   */
  export interface AsProtobufJSON {
    name?: string;
  }
}

/**
 * Message implementation for routeguide.UnSubscribeRequest
 */
export class UnSubscribeRequest implements GrpcMessage {
  static id = 'routeguide.UnSubscribeRequest';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new UnSubscribeRequest();
    UnSubscribeRequest.deserializeBinaryFromReader(
      instance,
      new BinaryReader(bytes)
    );
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: UnSubscribeRequest) {
    _instance.subscribedResource = _instance.subscribedResource || '';
    _instance.subscriberId = _instance.subscriberId || '0';
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: UnSubscribeRequest,
    _reader: BinaryReader
  ) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          _instance.subscribedResource = _reader.readString();
          break;
        case 2:
          _instance.subscriberId = _reader.readInt64String();
          break;
        default:
          _reader.skipField();
      }
    }

    UnSubscribeRequest.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(
    _instance: UnSubscribeRequest,
    _writer: BinaryWriter
  ) {
    if (_instance.subscribedResource) {
      _writer.writeString(1, _instance.subscribedResource);
    }
    if (_instance.subscriberId) {
      _writer.writeInt64String(2, _instance.subscriberId);
    }
  }

  private _subscribedResource?: string;
  private _subscriberId?: string;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of UnSubscribeRequest to deeply clone from
   */
  constructor(_value?: RecursivePartial<UnSubscribeRequest.AsObject>) {
    _value = _value || {};
    this.subscribedResource = _value.subscribedResource;
    this.subscriberId = _value.subscriberId;
    UnSubscribeRequest.refineValues(this);
  }
  get subscribedResource(): string | undefined {
    return this._subscribedResource;
  }
  set subscribedResource(value: string | undefined) {
    this._subscribedResource = value;
  }
  get subscriberId(): string | undefined {
    return this._subscriberId;
  }
  set subscriberId(value: string | undefined) {
    this._subscriberId = value;
  }

  /**
   * Serialize message to binary data
   * @param instance message instance
   */
  serializeBinary() {
    const writer = new BinaryWriter();
    UnSubscribeRequest.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): UnSubscribeRequest.AsObject {
    return {
      subscribedResource: this.subscribedResource,
      subscriberId: this.subscriberId
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
  ): UnSubscribeRequest.AsProtobufJSON {
    return {
      subscribedResource: this.subscribedResource,
      subscriberId: this.subscriberId
    };
  }
}
export module UnSubscribeRequest {
  /**
   * Standard JavaScript object representation for UnSubscribeRequest
   */
  export interface AsObject {
    subscribedResource?: string;
    subscriberId?: string;
  }

  /**
   * Protobuf JSON representation for UnSubscribeRequest
   */
  export interface AsProtobufJSON {
    subscribedResource?: string;
    subscriberId?: string;
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
    _instance.name = _instance.name || '';
    _instance.packageName = _instance.packageName || '';
    _instance.description = _instance.description || '';
    _instance.createTime = _instance.createTime || '';
    _instance.updateTime = _instance.updateTime || '';
    _instance.state = _instance.state || 0;
    _instance.authorId = _instance.authorId || '0';
    _instance.imageUrls = _instance.imageUrls || [];
    _instance.tags = _instance.tags || [];
    _instance.downloadCount = _instance.downloadCount || '0';
    _instance.likeCount = _instance.likeCount || '0';
    _instance.dislikeCount = _instance.dislikeCount || '0';
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
          _instance.name = _reader.readString();
          break;
        case 2:
          _instance.packageName = _reader.readString();
          break;
        case 3:
          _instance.description = _reader.readString();
          break;
        case 4:
          _instance.createTime = _reader.readString();
          break;
        case 6:
          _instance.updateTime = _reader.readString();
          break;
        case 7:
          _instance.state = _reader.readEnum();
          break;
        case 8:
          _instance.authorId = _reader.readInt64String();
          break;
        case 10:
          (_instance.imageUrls = _instance.imageUrls || []).push(
            _reader.readString()
          );
          break;
        case 11:
          const messageInitializer11 = new Tag();
          _reader.readMessage(
            messageInitializer11,
            Tag.deserializeBinaryFromReader
          );
          (_instance.tags = _instance.tags || []).push(messageInitializer11);
          break;
        case 20:
          _instance.downloadCount = _reader.readInt64String();
          break;
        case 21:
          _instance.likeCount = _reader.readInt64String();
          break;
        case 22:
          _instance.dislikeCount = _reader.readInt64String();
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
    if (_instance.name) {
      _writer.writeString(1, _instance.name);
    }
    if (_instance.packageName) {
      _writer.writeString(2, _instance.packageName);
    }
    if (_instance.description) {
      _writer.writeString(3, _instance.description);
    }
    if (_instance.createTime) {
      _writer.writeString(4, _instance.createTime);
    }
    if (_instance.updateTime) {
      _writer.writeString(6, _instance.updateTime);
    }
    if (_instance.state) {
      _writer.writeEnum(7, _instance.state);
    }
    if (_instance.authorId) {
      _writer.writeInt64String(8, _instance.authorId);
    }
    if (_instance.imageUrls && _instance.imageUrls.length) {
      _writer.writeRepeatedString(10, _instance.imageUrls);
    }
    if (_instance.tags && _instance.tags.length) {
      _writer.writeRepeatedMessage(
        11,
        _instance.tags as any,
        Tag.serializeBinaryToWriter
      );
    }
    if (_instance.downloadCount) {
      _writer.writeInt64String(20, _instance.downloadCount);
    }
    if (_instance.likeCount) {
      _writer.writeInt64String(21, _instance.likeCount);
    }
    if (_instance.dislikeCount) {
      _writer.writeInt64String(22, _instance.dislikeCount);
    }
  }

  private _name?: string;
  private _packageName?: string;
  private _description?: string;
  private _createTime?: string;
  private _updateTime?: string;
  private _state?: ResourceState;
  private _authorId?: string;
  private _imageUrls?: string[];
  private _tags?: Tag[];
  private _downloadCount?: string;
  private _likeCount?: string;
  private _dislikeCount?: string;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of Package to deeply clone from
   */
  constructor(_value?: RecursivePartial<Package.AsObject>) {
    _value = _value || {};
    this.name = _value.name;
    this.packageName = _value.packageName;
    this.description = _value.description;
    this.createTime = _value.createTime;
    this.updateTime = _value.updateTime;
    this.state = _value.state;
    this.authorId = _value.authorId;
    this.imageUrls = (_value.imageUrls || []).slice();
    this.tags = (_value.tags || []).map(m => new Tag(m));
    this.downloadCount = _value.downloadCount;
    this.likeCount = _value.likeCount;
    this.dislikeCount = _value.dislikeCount;
    Package.refineValues(this);
  }
  get name(): string | undefined {
    return this._name;
  }
  set name(value: string | undefined) {
    this._name = value;
  }
  get packageName(): string | undefined {
    return this._packageName;
  }
  set packageName(value: string | undefined) {
    this._packageName = value;
  }
  get description(): string | undefined {
    return this._description;
  }
  set description(value: string | undefined) {
    this._description = value;
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
  get state(): ResourceState | undefined {
    return this._state;
  }
  set state(value: ResourceState | undefined) {
    this._state = value;
  }
  get authorId(): string | undefined {
    return this._authorId;
  }
  set authorId(value: string | undefined) {
    this._authorId = value;
  }
  get imageUrls(): string[] | undefined {
    return this._imageUrls;
  }
  set imageUrls(value: string[] | undefined) {
    this._imageUrls = value;
  }
  get tags(): Tag[] | undefined {
    return this._tags;
  }
  set tags(value: Tag[] | undefined) {
    this._tags = value;
  }
  get downloadCount(): string | undefined {
    return this._downloadCount;
  }
  set downloadCount(value: string | undefined) {
    this._downloadCount = value;
  }
  get likeCount(): string | undefined {
    return this._likeCount;
  }
  set likeCount(value: string | undefined) {
    this._likeCount = value;
  }
  get dislikeCount(): string | undefined {
    return this._dislikeCount;
  }
  set dislikeCount(value: string | undefined) {
    this._dislikeCount = value;
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
      name: this.name,
      packageName: this.packageName,
      description: this.description,
      createTime: this.createTime,
      updateTime: this.updateTime,
      state: this.state,
      authorId: this.authorId,
      imageUrls: (this.imageUrls || []).slice(),
      tags: (this.tags || []).map(m => m.toObject()),
      downloadCount: this.downloadCount,
      likeCount: this.likeCount,
      dislikeCount: this.dislikeCount
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
      name: this.name,
      packageName: this.packageName,
      description: this.description,
      createTime: this.createTime,
      updateTime: this.updateTime,
      state: ResourceState[this.state ?? 0],
      authorId: this.authorId,
      imageUrls: (this.imageUrls || []).slice(),
      tags: (this.tags || []).map(m => m.toProtobufJSON(options)),
      downloadCount: this.downloadCount,
      likeCount: this.likeCount,
      dislikeCount: this.dislikeCount
    };
  }
}
export module Package {
  /**
   * Standard JavaScript object representation for Package
   */
  export interface AsObject {
    name?: string;
    packageName?: string;
    description?: string;
    createTime?: string;
    updateTime?: string;
    state?: ResourceState;
    authorId?: string;
    imageUrls?: string[];
    tags?: Tag.AsObject[];
    downloadCount?: string;
    likeCount?: string;
    dislikeCount?: string;
  }

  /**
   * Protobuf JSON representation for Package
   */
  export interface AsProtobufJSON {
    name?: string;
    packageName?: string;
    description?: string;
    createTime?: string;
    updateTime?: string;
    state?: string;
    authorId?: string;
    imageUrls?: string[];
    tags?: Tag.AsProtobufJSON[] | null;
    downloadCount?: string;
    likeCount?: string;
    dislikeCount?: string;
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
    _instance.createTime = _instance.createTime || '';
    _instance.tag = _instance.tag || '';
    _instance.size = _instance.size || '';
    _instance.name = _instance.name || '';
    _instance.updateTime = _instance.updateTime || '';
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
        case 4:
          _instance.downloadCount = _reader.readInt64String();
          break;
        case 5:
          _instance.version = new Version();
          _reader.readMessage(
            _instance.version,
            Version.deserializeBinaryFromReader
          );
          break;
        case 6:
          _instance.description = _reader.readString();
          break;
        case 7:
          _instance.createTime = _reader.readString();
          break;
        case 8:
          _instance.tag = _reader.readString();
          break;
        case 10:
          _instance.size = _reader.readString();
          break;
        case 11:
          _instance.name = _reader.readString();
          break;
        case 12:
          _instance.updateTime = _reader.readString();
          break;
        case 13:
          _instance.file = new File();
          _reader.readMessage(_instance.file, File.deserializeBinaryFromReader);
          break;
        case 14:
          _instance.downloadMethod = _reader.readString();
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
      _writer.writeInt64String(4, _instance.downloadCount);
    }
    if (_instance.version) {
      _writer.writeMessage(
        5,
        _instance.version as any,
        Version.serializeBinaryToWriter
      );
    }
    if (_instance.description) {
      _writer.writeString(6, _instance.description);
    }
    if (_instance.createTime) {
      _writer.writeString(7, _instance.createTime);
    }
    if (_instance.tag) {
      _writer.writeString(8, _instance.tag);
    }
    if (_instance.size) {
      _writer.writeString(10, _instance.size);
    }
    if (_instance.name) {
      _writer.writeString(11, _instance.name);
    }
    if (_instance.updateTime) {
      _writer.writeString(12, _instance.updateTime);
    }
    if (_instance.file) {
      _writer.writeMessage(
        13,
        _instance.file as any,
        File.serializeBinaryToWriter
      );
    }
    if (_instance.downloadMethod || _instance.downloadMethod === '') {
      _writer.writeString(14, _instance.downloadMethod);
    }
  }

  private _binaryId?: string;
  private _packageId?: string;
  private _downloadCount?: string;
  private _version?: Version;
  private _description?: string;
  private _createTime?: string;
  private _tag?: string;
  private _size?: string;
  private _name?: string;
  private _updateTime?: string;
  private _file?: File;
  private _downloadMethod?: string;

  private _resource: Binary.ResourceCase = Binary.ResourceCase.none;

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
    this.createTime = _value.createTime;
    this.tag = _value.tag;
    this.size = _value.size;
    this.name = _value.name;
    this.updateTime = _value.updateTime;
    this.file = _value.file ? new File(_value.file) : undefined;
    this.downloadMethod = _value.downloadMethod;
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
  get createTime(): string | undefined {
    return this._createTime;
  }
  set createTime(value: string | undefined) {
    this._createTime = value;
  }
  get tag(): string | undefined {
    return this._tag;
  }
  set tag(value: string | undefined) {
    this._tag = value;
  }
  get size(): string | undefined {
    return this._size;
  }
  set size(value: string | undefined) {
    this._size = value;
  }
  get name(): string | undefined {
    return this._name;
  }
  set name(value: string | undefined) {
    this._name = value;
  }
  get updateTime(): string | undefined {
    return this._updateTime;
  }
  set updateTime(value: string | undefined) {
    this._updateTime = value;
  }
  get file(): File | undefined {
    return this._file;
  }
  set file(value: File | undefined) {
    if (value !== undefined && value !== null) {
      this._downloadMethod = undefined;
      this._resource = Binary.ResourceCase.file;
    }
    this._file = value;
  }
  get downloadMethod(): string | undefined {
    return this._downloadMethod;
  }
  set downloadMethod(value: string | undefined) {
    if (value !== undefined && value !== null) {
      this._file = undefined;
      this._resource = Binary.ResourceCase.downloadMethod;
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
      createTime: this.createTime,
      tag: this.tag,
      size: this.size,
      name: this.name,
      updateTime: this.updateTime,
      file: this.file ? this.file.toObject() : undefined,
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
  ): Binary.AsProtobufJSON {
    return {
      binaryId: this.binaryId,
      packageId: this.packageId,
      downloadCount: this.downloadCount,
      version: this.version ? this.version.toProtobufJSON(options) : null,
      description: this.description,
      createTime: this.createTime,
      tag: this.tag,
      size: this.size,
      name: this.name,
      updateTime: this.updateTime,
      file: this.file ? this.file.toProtobufJSON(options) : null,
      downloadMethod: this.downloadMethod ?? null
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
    createTime?: string;
    tag?: string;
    size?: string;
    name?: string;
    updateTime?: string;
    file?: File.AsObject;
    downloadMethod?: string;
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
    createTime?: string;
    tag?: string;
    size?: string;
    name?: string;
    updateTime?: string;
    file?: File.AsProtobufJSON | null;
    downloadMethod?: string | null;
  }
  export enum ResourceCase {
    none = 0,
    file = 1,
    downloadMethod = 2
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
    _instance.name = _instance.name || '';
    _instance.username = _instance.username || '';
    _instance.email = _instance.email || '';
    _instance.type = _instance.type || 0;
    _instance.imageUrl = _instance.imageUrl || '';
    _instance.website = _instance.website || '';
    _instance.userId = _instance.userId || '0';
    _instance.subscriberCount = _instance.subscriberCount || '0';
    _instance.createTime = _instance.createTime || undefined;
    _instance.updateTime = _instance.updateTime || undefined;
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
          _instance.name = _reader.readString();
          break;
        case 2:
          _instance.username = _reader.readString();
          break;
        case 3:
          _instance.email = _reader.readString();
          break;
        case 4:
          _instance.type = _reader.readEnum();
          break;
        case 5:
          _instance.imageUrl = _reader.readString();
          break;
        case 6:
          _instance.website = _reader.readString();
          break;
        case 7:
          _instance.userId = _reader.readInt64String();
          break;
        case 8:
          _instance.subscriberCount = _reader.readInt64String();
          break;
        case 9:
          _instance.createTime = new googleProtobuf000.Timestamp();
          _reader.readMessage(
            _instance.createTime,
            googleProtobuf000.Timestamp.deserializeBinaryFromReader
          );
          break;
        case 10:
          _instance.updateTime = new googleProtobuf000.Timestamp();
          _reader.readMessage(
            _instance.updateTime,
            googleProtobuf000.Timestamp.deserializeBinaryFromReader
          );
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
    if (_instance.name) {
      _writer.writeString(1, _instance.name);
    }
    if (_instance.username) {
      _writer.writeString(2, _instance.username);
    }
    if (_instance.email) {
      _writer.writeString(3, _instance.email);
    }
    if (_instance.type) {
      _writer.writeEnum(4, _instance.type);
    }
    if (_instance.imageUrl) {
      _writer.writeString(5, _instance.imageUrl);
    }
    if (_instance.website) {
      _writer.writeString(6, _instance.website);
    }
    if (_instance.userId) {
      _writer.writeInt64String(7, _instance.userId);
    }
    if (_instance.subscriberCount) {
      _writer.writeInt64String(8, _instance.subscriberCount);
    }
    if (_instance.createTime) {
      _writer.writeMessage(
        9,
        _instance.createTime as any,
        googleProtobuf000.Timestamp.serializeBinaryToWriter
      );
    }
    if (_instance.updateTime) {
      _writer.writeMessage(
        10,
        _instance.updateTime as any,
        googleProtobuf000.Timestamp.serializeBinaryToWriter
      );
    }
  }

  private _name?: string;
  private _username?: string;
  private _email?: string;
  private _type?: User.UserType;
  private _imageUrl?: string;
  private _website?: string;
  private _userId?: string;
  private _subscriberCount?: string;
  private _createTime?: googleProtobuf000.Timestamp;
  private _updateTime?: googleProtobuf000.Timestamp;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of User to deeply clone from
   */
  constructor(_value?: RecursivePartial<User.AsObject>) {
    _value = _value || {};
    this.name = _value.name;
    this.username = _value.username;
    this.email = _value.email;
    this.type = _value.type;
    this.imageUrl = _value.imageUrl;
    this.website = _value.website;
    this.userId = _value.userId;
    this.subscriberCount = _value.subscriberCount;
    this.createTime = _value.createTime
      ? new googleProtobuf000.Timestamp(_value.createTime)
      : undefined;
    this.updateTime = _value.updateTime
      ? new googleProtobuf000.Timestamp(_value.updateTime)
      : undefined;
    User.refineValues(this);
  }
  get name(): string | undefined {
    return this._name;
  }
  set name(value: string | undefined) {
    this._name = value;
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
  get type(): User.UserType | undefined {
    return this._type;
  }
  set type(value: User.UserType | undefined) {
    this._type = value;
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
  get userId(): string | undefined {
    return this._userId;
  }
  set userId(value: string | undefined) {
    this._userId = value;
  }
  get subscriberCount(): string | undefined {
    return this._subscriberCount;
  }
  set subscriberCount(value: string | undefined) {
    this._subscriberCount = value;
  }
  get createTime(): googleProtobuf000.Timestamp | undefined {
    return this._createTime;
  }
  set createTime(value: googleProtobuf000.Timestamp | undefined) {
    this._createTime = value;
  }
  get updateTime(): googleProtobuf000.Timestamp | undefined {
    return this._updateTime;
  }
  set updateTime(value: googleProtobuf000.Timestamp | undefined) {
    this._updateTime = value;
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
      name: this.name,
      username: this.username,
      email: this.email,
      type: this.type,
      imageUrl: this.imageUrl,
      website: this.website,
      userId: this.userId,
      subscriberCount: this.subscriberCount,
      createTime: this.createTime ? this.createTime.toObject() : undefined,
      updateTime: this.updateTime ? this.updateTime.toObject() : undefined
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
      name: this.name,
      username: this.username,
      email: this.email,
      type: User.UserType[this.type ?? 0],
      imageUrl: this.imageUrl,
      website: this.website,
      userId: this.userId,
      subscriberCount: this.subscriberCount,
      createTime: this.createTime
        ? this.createTime.toProtobufJSON(options)
        : null,
      updateTime: this.updateTime
        ? this.updateTime.toProtobufJSON(options)
        : null
    };
  }
}
export module User {
  /**
   * Standard JavaScript object representation for User
   */
  export interface AsObject {
    name?: string;
    username?: string;
    email?: string;
    type?: User.UserType;
    imageUrl?: string;
    website?: string;
    userId?: string;
    subscriberCount?: string;
    createTime?: googleProtobuf000.Timestamp.AsObject;
    updateTime?: googleProtobuf000.Timestamp.AsObject;
  }

  /**
   * Protobuf JSON representation for User
   */
  export interface AsProtobufJSON {
    name?: string;
    username?: string;
    email?: string;
    type?: string;
    imageUrl?: string;
    website?: string;
    userId?: string;
    subscriberCount?: string;
    createTime?: googleProtobuf000.Timestamp.AsProtobufJSON | null;
    updateTime?: googleProtobuf000.Timestamp.AsProtobufJSON | null;
  }
  export enum UserType {
    USER_TYPE_UNSPECIFIED = 0,
    ADMIN = 1,
    TESTER = 2,
    REGULAR = 11
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
 * Message implementation for routeguide.Thread
 */
export class Thread implements GrpcMessage {
  static id = 'routeguide.Thread';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new Thread();
    Thread.deserializeBinaryFromReader(instance, new BinaryReader(bytes));
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: Thread) {
    _instance.name = _instance.name || '';
    _instance.subject = _instance.subject || '';
    _instance.content = _instance.content || '';
    _instance.authorId = _instance.authorId || '0';
    _instance.createTime = _instance.createTime || undefined;
    _instance.updateTime = _instance.updateTime || undefined;
    _instance.state = _instance.state || 0;
    _instance.tags = _instance.tags || [];
    _instance.pinned = _instance.pinned || false;
    _instance.latestCommentedTime = _instance.latestCommentedTime || undefined;
    _instance.latestCommenterId = _instance.latestCommenterId || '0';
    _instance.viewCount = _instance.viewCount || '0';
    _instance.likeCount = _instance.likeCount || '0';
    _instance.commentCount = _instance.commentCount || '0';
    _instance.replyCount = _instance.replyCount || '0';
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(_instance: Thread, _reader: BinaryReader) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          _instance.name = _reader.readString();
          break;
        case 2:
          _instance.subject = _reader.readString();
          break;
        case 3:
          _instance.content = _reader.readString();
          break;
        case 4:
          _instance.authorId = _reader.readInt64String();
          break;
        case 5:
          _instance.createTime = new googleProtobuf000.Timestamp();
          _reader.readMessage(
            _instance.createTime,
            googleProtobuf000.Timestamp.deserializeBinaryFromReader
          );
          break;
        case 6:
          _instance.updateTime = new googleProtobuf000.Timestamp();
          _reader.readMessage(
            _instance.updateTime,
            googleProtobuf000.Timestamp.deserializeBinaryFromReader
          );
          break;
        case 7:
          _instance.state = _reader.readEnum();
          break;
        case 8:
          (_instance.tags = _instance.tags || []).push(_reader.readString());
          break;
        case 9:
          _instance.pinned = _reader.readBool();
          break;
        case 10:
          _instance.latestCommentedTime = new googleProtobuf000.Timestamp();
          _reader.readMessage(
            _instance.latestCommentedTime,
            googleProtobuf000.Timestamp.deserializeBinaryFromReader
          );
          break;
        case 11:
          _instance.latestCommenterId = _reader.readInt64String();
          break;
        case 21:
          _instance.viewCount = _reader.readInt64String();
          break;
        case 22:
          _instance.likeCount = _reader.readInt64String();
          break;
        case 23:
          _instance.commentCount = _reader.readInt64String();
          break;
        case 24:
          _instance.replyCount = _reader.readInt64String();
          break;
        default:
          _reader.skipField();
      }
    }

    Thread.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(_instance: Thread, _writer: BinaryWriter) {
    if (_instance.name) {
      _writer.writeString(1, _instance.name);
    }
    if (_instance.subject) {
      _writer.writeString(2, _instance.subject);
    }
    if (_instance.content) {
      _writer.writeString(3, _instance.content);
    }
    if (_instance.authorId) {
      _writer.writeInt64String(4, _instance.authorId);
    }
    if (_instance.createTime) {
      _writer.writeMessage(
        5,
        _instance.createTime as any,
        googleProtobuf000.Timestamp.serializeBinaryToWriter
      );
    }
    if (_instance.updateTime) {
      _writer.writeMessage(
        6,
        _instance.updateTime as any,
        googleProtobuf000.Timestamp.serializeBinaryToWriter
      );
    }
    if (_instance.state) {
      _writer.writeEnum(7, _instance.state);
    }
    if (_instance.tags && _instance.tags.length) {
      _writer.writeRepeatedString(8, _instance.tags);
    }
    if (_instance.pinned) {
      _writer.writeBool(9, _instance.pinned);
    }
    if (_instance.latestCommentedTime) {
      _writer.writeMessage(
        10,
        _instance.latestCommentedTime as any,
        googleProtobuf000.Timestamp.serializeBinaryToWriter
      );
    }
    if (_instance.latestCommenterId) {
      _writer.writeInt64String(11, _instance.latestCommenterId);
    }
    if (_instance.viewCount) {
      _writer.writeInt64String(21, _instance.viewCount);
    }
    if (_instance.likeCount) {
      _writer.writeInt64String(22, _instance.likeCount);
    }
    if (_instance.commentCount) {
      _writer.writeInt64String(23, _instance.commentCount);
    }
    if (_instance.replyCount) {
      _writer.writeInt64String(24, _instance.replyCount);
    }
  }

  private _name?: string;
  private _subject?: string;
  private _content?: string;
  private _authorId?: string;
  private _createTime?: googleProtobuf000.Timestamp;
  private _updateTime?: googleProtobuf000.Timestamp;
  private _state?: ResourceState;
  private _tags?: string[];
  private _pinned?: boolean;
  private _latestCommentedTime?: googleProtobuf000.Timestamp;
  private _latestCommenterId?: string;
  private _viewCount?: string;
  private _likeCount?: string;
  private _commentCount?: string;
  private _replyCount?: string;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of Thread to deeply clone from
   */
  constructor(_value?: RecursivePartial<Thread.AsObject>) {
    _value = _value || {};
    this.name = _value.name;
    this.subject = _value.subject;
    this.content = _value.content;
    this.authorId = _value.authorId;
    this.createTime = _value.createTime
      ? new googleProtobuf000.Timestamp(_value.createTime)
      : undefined;
    this.updateTime = _value.updateTime
      ? new googleProtobuf000.Timestamp(_value.updateTime)
      : undefined;
    this.state = _value.state;
    this.tags = (_value.tags || []).slice();
    this.pinned = _value.pinned;
    this.latestCommentedTime = _value.latestCommentedTime
      ? new googleProtobuf000.Timestamp(_value.latestCommentedTime)
      : undefined;
    this.latestCommenterId = _value.latestCommenterId;
    this.viewCount = _value.viewCount;
    this.likeCount = _value.likeCount;
    this.commentCount = _value.commentCount;
    this.replyCount = _value.replyCount;
    Thread.refineValues(this);
  }
  get name(): string | undefined {
    return this._name;
  }
  set name(value: string | undefined) {
    this._name = value;
  }
  get subject(): string | undefined {
    return this._subject;
  }
  set subject(value: string | undefined) {
    this._subject = value;
  }
  get content(): string | undefined {
    return this._content;
  }
  set content(value: string | undefined) {
    this._content = value;
  }
  get authorId(): string | undefined {
    return this._authorId;
  }
  set authorId(value: string | undefined) {
    this._authorId = value;
  }
  get createTime(): googleProtobuf000.Timestamp | undefined {
    return this._createTime;
  }
  set createTime(value: googleProtobuf000.Timestamp | undefined) {
    this._createTime = value;
  }
  get updateTime(): googleProtobuf000.Timestamp | undefined {
    return this._updateTime;
  }
  set updateTime(value: googleProtobuf000.Timestamp | undefined) {
    this._updateTime = value;
  }
  get state(): ResourceState | undefined {
    return this._state;
  }
  set state(value: ResourceState | undefined) {
    this._state = value;
  }
  get tags(): string[] | undefined {
    return this._tags;
  }
  set tags(value: string[] | undefined) {
    this._tags = value;
  }
  get pinned(): boolean | undefined {
    return this._pinned;
  }
  set pinned(value: boolean | undefined) {
    this._pinned = value;
  }
  get latestCommentedTime(): googleProtobuf000.Timestamp | undefined {
    return this._latestCommentedTime;
  }
  set latestCommentedTime(value: googleProtobuf000.Timestamp | undefined) {
    this._latestCommentedTime = value;
  }
  get latestCommenterId(): string | undefined {
    return this._latestCommenterId;
  }
  set latestCommenterId(value: string | undefined) {
    this._latestCommenterId = value;
  }
  get viewCount(): string | undefined {
    return this._viewCount;
  }
  set viewCount(value: string | undefined) {
    this._viewCount = value;
  }
  get likeCount(): string | undefined {
    return this._likeCount;
  }
  set likeCount(value: string | undefined) {
    this._likeCount = value;
  }
  get commentCount(): string | undefined {
    return this._commentCount;
  }
  set commentCount(value: string | undefined) {
    this._commentCount = value;
  }
  get replyCount(): string | undefined {
    return this._replyCount;
  }
  set replyCount(value: string | undefined) {
    this._replyCount = value;
  }

  /**
   * Serialize message to binary data
   * @param instance message instance
   */
  serializeBinary() {
    const writer = new BinaryWriter();
    Thread.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): Thread.AsObject {
    return {
      name: this.name,
      subject: this.subject,
      content: this.content,
      authorId: this.authorId,
      createTime: this.createTime ? this.createTime.toObject() : undefined,
      updateTime: this.updateTime ? this.updateTime.toObject() : undefined,
      state: this.state,
      tags: (this.tags || []).slice(),
      pinned: this.pinned,
      latestCommentedTime: this.latestCommentedTime
        ? this.latestCommentedTime.toObject()
        : undefined,
      latestCommenterId: this.latestCommenterId,
      viewCount: this.viewCount,
      likeCount: this.likeCount,
      commentCount: this.commentCount,
      replyCount: this.replyCount
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
  ): Thread.AsProtobufJSON {
    return {
      name: this.name,
      subject: this.subject,
      content: this.content,
      authorId: this.authorId,
      createTime: this.createTime
        ? this.createTime.toProtobufJSON(options)
        : null,
      updateTime: this.updateTime
        ? this.updateTime.toProtobufJSON(options)
        : null,
      state: ResourceState[this.state ?? 0],
      tags: (this.tags || []).slice(),
      pinned: this.pinned,
      latestCommentedTime: this.latestCommentedTime
        ? this.latestCommentedTime.toProtobufJSON(options)
        : null,
      latestCommenterId: this.latestCommenterId,
      viewCount: this.viewCount,
      likeCount: this.likeCount,
      commentCount: this.commentCount,
      replyCount: this.replyCount
    };
  }
}
export module Thread {
  /**
   * Standard JavaScript object representation for Thread
   */
  export interface AsObject {
    name?: string;
    subject?: string;
    content?: string;
    authorId?: string;
    createTime?: googleProtobuf000.Timestamp.AsObject;
    updateTime?: googleProtobuf000.Timestamp.AsObject;
    state?: ResourceState;
    tags?: string[];
    pinned?: boolean;
    latestCommentedTime?: googleProtobuf000.Timestamp.AsObject;
    latestCommenterId?: string;
    viewCount?: string;
    likeCount?: string;
    commentCount?: string;
    replyCount?: string;
  }

  /**
   * Protobuf JSON representation for Thread
   */
  export interface AsProtobufJSON {
    name?: string;
    subject?: string;
    content?: string;
    authorId?: string;
    createTime?: googleProtobuf000.Timestamp.AsProtobufJSON | null;
    updateTime?: googleProtobuf000.Timestamp.AsProtobufJSON | null;
    state?: string;
    tags?: string[];
    pinned?: boolean;
    latestCommentedTime?: googleProtobuf000.Timestamp.AsProtobufJSON | null;
    latestCommenterId?: string;
    viewCount?: string;
    likeCount?: string;
    commentCount?: string;
    replyCount?: string;
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
    _instance.name = _instance.name || '';
    _instance.createTime = _instance.createTime || undefined;
    _instance.updateTime = _instance.updateTime || undefined;
    _instance.text = _instance.text || '';
    _instance.authorId = _instance.authorId || '0';
    _instance.upvoteCount = _instance.upvoteCount || '0';
    _instance.replies = _instance.replies || [];
    _instance.index = _instance.index || '0';
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
          _instance.name = _reader.readString();
          break;
        case 3:
          _instance.createTime = new googleProtobuf000.Timestamp();
          _reader.readMessage(
            _instance.createTime,
            googleProtobuf000.Timestamp.deserializeBinaryFromReader
          );
          break;
        case 4:
          _instance.updateTime = new googleProtobuf000.Timestamp();
          _reader.readMessage(
            _instance.updateTime,
            googleProtobuf000.Timestamp.deserializeBinaryFromReader
          );
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
        case 9:
          _instance.index = _reader.readInt64String();
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
    if (_instance.name) {
      _writer.writeString(1, _instance.name);
    }
    if (_instance.createTime) {
      _writer.writeMessage(
        3,
        _instance.createTime as any,
        googleProtobuf000.Timestamp.serializeBinaryToWriter
      );
    }
    if (_instance.updateTime) {
      _writer.writeMessage(
        4,
        _instance.updateTime as any,
        googleProtobuf000.Timestamp.serializeBinaryToWriter
      );
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
    if (_instance.index) {
      _writer.writeInt64String(9, _instance.index);
    }
  }

  private _name?: string;
  private _createTime?: googleProtobuf000.Timestamp;
  private _updateTime?: googleProtobuf000.Timestamp;
  private _text?: string;
  private _authorId?: string;
  private _upvoteCount?: string;
  private _replies?: Reply[];
  private _index?: string;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of Comment to deeply clone from
   */
  constructor(_value?: RecursivePartial<Comment.AsObject>) {
    _value = _value || {};
    this.name = _value.name;
    this.createTime = _value.createTime
      ? new googleProtobuf000.Timestamp(_value.createTime)
      : undefined;
    this.updateTime = _value.updateTime
      ? new googleProtobuf000.Timestamp(_value.updateTime)
      : undefined;
    this.text = _value.text;
    this.authorId = _value.authorId;
    this.upvoteCount = _value.upvoteCount;
    this.replies = (_value.replies || []).map(m => new Reply(m));
    this.index = _value.index;
    Comment.refineValues(this);
  }
  get name(): string | undefined {
    return this._name;
  }
  set name(value: string | undefined) {
    this._name = value;
  }
  get createTime(): googleProtobuf000.Timestamp | undefined {
    return this._createTime;
  }
  set createTime(value: googleProtobuf000.Timestamp | undefined) {
    this._createTime = value;
  }
  get updateTime(): googleProtobuf000.Timestamp | undefined {
    return this._updateTime;
  }
  set updateTime(value: googleProtobuf000.Timestamp | undefined) {
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
  get index(): string | undefined {
    return this._index;
  }
  set index(value: string | undefined) {
    this._index = value;
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
      name: this.name,
      createTime: this.createTime ? this.createTime.toObject() : undefined,
      updateTime: this.updateTime ? this.updateTime.toObject() : undefined,
      text: this.text,
      authorId: this.authorId,
      upvoteCount: this.upvoteCount,
      replies: (this.replies || []).map(m => m.toObject()),
      index: this.index
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
      name: this.name,
      createTime: this.createTime
        ? this.createTime.toProtobufJSON(options)
        : null,
      updateTime: this.updateTime
        ? this.updateTime.toProtobufJSON(options)
        : null,
      text: this.text,
      authorId: this.authorId,
      upvoteCount: this.upvoteCount,
      replies: (this.replies || []).map(m => m.toProtobufJSON(options)),
      index: this.index
    };
  }
}
export module Comment {
  /**
   * Standard JavaScript object representation for Comment
   */
  export interface AsObject {
    name?: string;
    createTime?: googleProtobuf000.Timestamp.AsObject;
    updateTime?: googleProtobuf000.Timestamp.AsObject;
    text?: string;
    authorId?: string;
    upvoteCount?: string;
    replies?: Reply.AsObject[];
    index?: string;
  }

  /**
   * Protobuf JSON representation for Comment
   */
  export interface AsProtobufJSON {
    name?: string;
    createTime?: googleProtobuf000.Timestamp.AsProtobufJSON | null;
    updateTime?: googleProtobuf000.Timestamp.AsProtobufJSON | null;
    text?: string;
    authorId?: string;
    upvoteCount?: string;
    replies?: Reply.AsProtobufJSON[] | null;
    index?: string;
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
    _instance.name = _instance.name || '';
    _instance.createTime = _instance.createTime || undefined;
    _instance.updateTime = _instance.updateTime || undefined;
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
          _instance.name = _reader.readString();
          break;
        case 2:
          _instance.createTime = new googleProtobuf000.Timestamp();
          _reader.readMessage(
            _instance.createTime,
            googleProtobuf000.Timestamp.deserializeBinaryFromReader
          );
          break;
        case 3:
          _instance.updateTime = new googleProtobuf000.Timestamp();
          _reader.readMessage(
            _instance.updateTime,
            googleProtobuf000.Timestamp.deserializeBinaryFromReader
          );
          break;
        case 4:
          _instance.text = _reader.readString();
          break;
        case 5:
          _instance.authorId = _reader.readInt64String();
          break;
        case 6:
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
    if (_instance.name) {
      _writer.writeString(1, _instance.name);
    }
    if (_instance.createTime) {
      _writer.writeMessage(
        2,
        _instance.createTime as any,
        googleProtobuf000.Timestamp.serializeBinaryToWriter
      );
    }
    if (_instance.updateTime) {
      _writer.writeMessage(
        3,
        _instance.updateTime as any,
        googleProtobuf000.Timestamp.serializeBinaryToWriter
      );
    }
    if (_instance.text) {
      _writer.writeString(4, _instance.text);
    }
    if (_instance.authorId) {
      _writer.writeInt64String(5, _instance.authorId);
    }
    if (_instance.upvoteCount) {
      _writer.writeInt64String(6, _instance.upvoteCount);
    }
  }

  private _name?: string;
  private _createTime?: googleProtobuf000.Timestamp;
  private _updateTime?: googleProtobuf000.Timestamp;
  private _text?: string;
  private _authorId?: string;
  private _upvoteCount?: string;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of Reply to deeply clone from
   */
  constructor(_value?: RecursivePartial<Reply.AsObject>) {
    _value = _value || {};
    this.name = _value.name;
    this.createTime = _value.createTime
      ? new googleProtobuf000.Timestamp(_value.createTime)
      : undefined;
    this.updateTime = _value.updateTime
      ? new googleProtobuf000.Timestamp(_value.updateTime)
      : undefined;
    this.text = _value.text;
    this.authorId = _value.authorId;
    this.upvoteCount = _value.upvoteCount;
    Reply.refineValues(this);
  }
  get name(): string | undefined {
    return this._name;
  }
  set name(value: string | undefined) {
    this._name = value;
  }
  get createTime(): googleProtobuf000.Timestamp | undefined {
    return this._createTime;
  }
  set createTime(value: googleProtobuf000.Timestamp | undefined) {
    this._createTime = value;
  }
  get updateTime(): googleProtobuf000.Timestamp | undefined {
    return this._updateTime;
  }
  set updateTime(value: googleProtobuf000.Timestamp | undefined) {
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
      name: this.name,
      createTime: this.createTime ? this.createTime.toObject() : undefined,
      updateTime: this.updateTime ? this.updateTime.toObject() : undefined,
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
      name: this.name,
      createTime: this.createTime
        ? this.createTime.toProtobufJSON(options)
        : null,
      updateTime: this.updateTime
        ? this.updateTime.toProtobufJSON(options)
        : null,
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
    name?: string;
    createTime?: googleProtobuf000.Timestamp.AsObject;
    updateTime?: googleProtobuf000.Timestamp.AsObject;
    text?: string;
    authorId?: string;
    upvoteCount?: string;
  }

  /**
   * Protobuf JSON representation for Reply
   */
  export interface AsProtobufJSON {
    name?: string;
    createTime?: googleProtobuf000.Timestamp.AsProtobufJSON | null;
    updateTime?: googleProtobuf000.Timestamp.AsProtobufJSON | null;
    text?: string;
    authorId?: string;
    upvoteCount?: string;
  }
}

/**
 * Message implementation for routeguide.Tag
 */
export class Tag implements GrpcMessage {
  static id = 'routeguide.Tag';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new Tag();
    Tag.deserializeBinaryFromReader(instance, new BinaryReader(bytes));
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: Tag) {
    _instance.name = _instance.name || '';
    _instance.tagName = _instance.tagName || '';
    _instance.mutable = _instance.mutable || false;
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(_instance: Tag, _reader: BinaryReader) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          _instance.name = _reader.readString();
          break;
        case 2:
          _instance.tagName = _reader.readString();
          break;
        case 3:
          _instance.mutable = _reader.readBool();
          break;
        default:
          _reader.skipField();
      }
    }

    Tag.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(_instance: Tag, _writer: BinaryWriter) {
    if (_instance.name) {
      _writer.writeString(1, _instance.name);
    }
    if (_instance.tagName) {
      _writer.writeString(2, _instance.tagName);
    }
    if (_instance.mutable) {
      _writer.writeBool(3, _instance.mutable);
    }
  }

  private _name?: string;
  private _tagName?: string;
  private _mutable?: boolean;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of Tag to deeply clone from
   */
  constructor(_value?: RecursivePartial<Tag.AsObject>) {
    _value = _value || {};
    this.name = _value.name;
    this.tagName = _value.tagName;
    this.mutable = _value.mutable;
    Tag.refineValues(this);
  }
  get name(): string | undefined {
    return this._name;
  }
  set name(value: string | undefined) {
    this._name = value;
  }
  get tagName(): string | undefined {
    return this._tagName;
  }
  set tagName(value: string | undefined) {
    this._tagName = value;
  }
  get mutable(): boolean | undefined {
    return this._mutable;
  }
  set mutable(value: boolean | undefined) {
    this._mutable = value;
  }

  /**
   * Serialize message to binary data
   * @param instance message instance
   */
  serializeBinary() {
    const writer = new BinaryWriter();
    Tag.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): Tag.AsObject {
    return {
      name: this.name,
      tagName: this.tagName,
      mutable: this.mutable
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
  ): Tag.AsProtobufJSON {
    return {
      name: this.name,
      tagName: this.tagName,
      mutable: this.mutable
    };
  }
}
export module Tag {
  /**
   * Standard JavaScript object representation for Tag
   */
  export interface AsObject {
    name?: string;
    tagName?: string;
    mutable?: boolean;
  }

  /**
   * Protobuf JSON representation for Tag
   */
  export interface AsProtobufJSON {
    name?: string;
    tagName?: string;
    mutable?: boolean;
  }
}

/**
 * Message implementation for routeguide.AdminMessage
 */
export class AdminMessage implements GrpcMessage {
  static id = 'routeguide.AdminMessage';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new AdminMessage();
    AdminMessage.deserializeBinaryFromReader(instance, new BinaryReader(bytes));
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: AdminMessage) {
    _instance.message = _instance.message || '';
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: AdminMessage,
    _reader: BinaryReader
  ) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          _instance.message = _reader.readString();
          break;
        default:
          _reader.skipField();
      }
    }

    AdminMessage.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(
    _instance: AdminMessage,
    _writer: BinaryWriter
  ) {
    if (_instance.message) {
      _writer.writeString(1, _instance.message);
    }
  }

  private _message?: string;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of AdminMessage to deeply clone from
   */
  constructor(_value?: RecursivePartial<AdminMessage.AsObject>) {
    _value = _value || {};
    this.message = _value.message;
    AdminMessage.refineValues(this);
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
    AdminMessage.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): AdminMessage.AsObject {
    return {
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
  ): AdminMessage.AsProtobufJSON {
    return {
      message: this.message
    };
  }
}
export module AdminMessage {
  /**
   * Standard JavaScript object representation for AdminMessage
   */
  export interface AsObject {
    message?: string;
  }

  /**
   * Protobuf JSON representation for AdminMessage
   */
  export interface AsProtobufJSON {
    message?: string;
  }
}

/**
 * Message implementation for routeguide.Auth
 */
export class Auth implements GrpcMessage {
  static id = 'routeguide.Auth';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new Auth();
    Auth.deserializeBinaryFromReader(instance, new BinaryReader(bytes));
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: Auth) {
    _instance.oauth2Token = _instance.oauth2Token || '';
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(_instance: Auth, _reader: BinaryReader) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          _instance.oauth2Token = _reader.readString();
          break;
        default:
          _reader.skipField();
      }
    }

    Auth.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(_instance: Auth, _writer: BinaryWriter) {
    if (_instance.oauth2Token) {
      _writer.writeString(1, _instance.oauth2Token);
    }
  }

  private _oauth2Token?: string;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of Auth to deeply clone from
   */
  constructor(_value?: RecursivePartial<Auth.AsObject>) {
    _value = _value || {};
    this.oauth2Token = _value.oauth2Token;
    Auth.refineValues(this);
  }
  get oauth2Token(): string | undefined {
    return this._oauth2Token;
  }
  set oauth2Token(value: string | undefined) {
    this._oauth2Token = value;
  }

  /**
   * Serialize message to binary data
   * @param instance message instance
   */
  serializeBinary() {
    const writer = new BinaryWriter();
    Auth.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): Auth.AsObject {
    return {
      oauth2Token: this.oauth2Token
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
  ): Auth.AsProtobufJSON {
    return {
      oauth2Token: this.oauth2Token
    };
  }
}
export module Auth {
  /**
   * Standard JavaScript object representation for Auth
   */
  export interface AsObject {
    oauth2Token?: string;
  }

  /**
   * Protobuf JSON representation for Auth
   */
  export interface AsProtobufJSON {
    oauth2Token?: string;
  }
}

/**
 * Message implementation for routeguide.Activity
 */
export class Activity implements GrpcMessage {
  static id = 'routeguide.Activity';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new Activity();
    Activity.deserializeBinaryFromReader(instance, new BinaryReader(bytes));
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: Activity) {
    _instance.name = _instance.name || '';
    _instance.createTime = _instance.createTime || '';
    _instance.action = _instance.action || 0;
    _instance.resourceView = _instance.resourceView || undefined;
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: Activity,
    _reader: BinaryReader
  ) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          _instance.name = _reader.readString();
          break;
        case 2:
          _instance.createTime = _reader.readString();
          break;
        case 3:
          _instance.action = _reader.readEnum();
          break;
        case 4:
          _instance.resourceView = new ResourceView();
          _reader.readMessage(
            _instance.resourceView,
            ResourceView.deserializeBinaryFromReader
          );
          break;
        default:
          _reader.skipField();
      }
    }

    Activity.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(_instance: Activity, _writer: BinaryWriter) {
    if (_instance.name) {
      _writer.writeString(1, _instance.name);
    }
    if (_instance.createTime) {
      _writer.writeString(2, _instance.createTime);
    }
    if (_instance.action) {
      _writer.writeEnum(3, _instance.action);
    }
    if (_instance.resourceView) {
      _writer.writeMessage(
        4,
        _instance.resourceView as any,
        ResourceView.serializeBinaryToWriter
      );
    }
  }

  private _name?: string;
  private _createTime?: string;
  private _action?: Action;
  private _resourceView?: ResourceView;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of Activity to deeply clone from
   */
  constructor(_value?: RecursivePartial<Activity.AsObject>) {
    _value = _value || {};
    this.name = _value.name;
    this.createTime = _value.createTime;
    this.action = _value.action;
    this.resourceView = _value.resourceView
      ? new ResourceView(_value.resourceView)
      : undefined;
    Activity.refineValues(this);
  }
  get name(): string | undefined {
    return this._name;
  }
  set name(value: string | undefined) {
    this._name = value;
  }
  get createTime(): string | undefined {
    return this._createTime;
  }
  set createTime(value: string | undefined) {
    this._createTime = value;
  }
  get action(): Action | undefined {
    return this._action;
  }
  set action(value: Action | undefined) {
    this._action = value;
  }
  get resourceView(): ResourceView | undefined {
    return this._resourceView;
  }
  set resourceView(value: ResourceView | undefined) {
    this._resourceView = value;
  }

  /**
   * Serialize message to binary data
   * @param instance message instance
   */
  serializeBinary() {
    const writer = new BinaryWriter();
    Activity.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): Activity.AsObject {
    return {
      name: this.name,
      createTime: this.createTime,
      action: this.action,
      resourceView: this.resourceView ? this.resourceView.toObject() : undefined
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
  ): Activity.AsProtobufJSON {
    return {
      name: this.name,
      createTime: this.createTime,
      action: Action[this.action ?? 0],
      resourceView: this.resourceView
        ? this.resourceView.toProtobufJSON(options)
        : null
    };
  }
}
export module Activity {
  /**
   * Standard JavaScript object representation for Activity
   */
  export interface AsObject {
    name?: string;
    createTime?: string;
    action?: Action;
    resourceView?: ResourceView.AsObject;
  }

  /**
   * Protobuf JSON representation for Activity
   */
  export interface AsProtobufJSON {
    name?: string;
    createTime?: string;
    action?: string;
    resourceView?: ResourceView.AsProtobufJSON | null;
  }
}

/**
 * Message implementation for routeguide.Notification
 */
export class Notification implements GrpcMessage {
  static id = 'routeguide.Notification';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new Notification();
    Notification.deserializeBinaryFromReader(instance, new BinaryReader(bytes));
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: Notification) {
    _instance.name = _instance.name || '';
    _instance.senderId = _instance.senderId || '0';
    _instance.createTime = _instance.createTime || undefined;
    _instance.updateTime = _instance.updateTime || undefined;
    _instance.unread = _instance.unread || false;
    _instance.content = _instance.content || '';
    _instance.imagePreview = _instance.imagePreview || '';
    _instance.link = _instance.link || '';
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: Notification,
    _reader: BinaryReader
  ) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          _instance.name = _reader.readString();
          break;
        case 2:
          _instance.senderId = _reader.readInt64String();
          break;
        case 3:
          _instance.createTime = new googleProtobuf000.Timestamp();
          _reader.readMessage(
            _instance.createTime,
            googleProtobuf000.Timestamp.deserializeBinaryFromReader
          );
          break;
        case 4:
          _instance.updateTime = new googleProtobuf000.Timestamp();
          _reader.readMessage(
            _instance.updateTime,
            googleProtobuf000.Timestamp.deserializeBinaryFromReader
          );
          break;
        case 5:
          _instance.unread = _reader.readBool();
          break;
        case 6:
          _instance.content = _reader.readString();
          break;
        case 7:
          _instance.imagePreview = _reader.readString();
          break;
        case 8:
          _instance.link = _reader.readString();
          break;
        default:
          _reader.skipField();
      }
    }

    Notification.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(
    _instance: Notification,
    _writer: BinaryWriter
  ) {
    if (_instance.name) {
      _writer.writeString(1, _instance.name);
    }
    if (_instance.senderId) {
      _writer.writeInt64String(2, _instance.senderId);
    }
    if (_instance.createTime) {
      _writer.writeMessage(
        3,
        _instance.createTime as any,
        googleProtobuf000.Timestamp.serializeBinaryToWriter
      );
    }
    if (_instance.updateTime) {
      _writer.writeMessage(
        4,
        _instance.updateTime as any,
        googleProtobuf000.Timestamp.serializeBinaryToWriter
      );
    }
    if (_instance.unread) {
      _writer.writeBool(5, _instance.unread);
    }
    if (_instance.content) {
      _writer.writeString(6, _instance.content);
    }
    if (_instance.imagePreview) {
      _writer.writeString(7, _instance.imagePreview);
    }
    if (_instance.link) {
      _writer.writeString(8, _instance.link);
    }
  }

  private _name?: string;
  private _senderId?: string;
  private _createTime?: googleProtobuf000.Timestamp;
  private _updateTime?: googleProtobuf000.Timestamp;
  private _unread?: boolean;
  private _content?: string;
  private _imagePreview?: string;
  private _link?: string;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of Notification to deeply clone from
   */
  constructor(_value?: RecursivePartial<Notification.AsObject>) {
    _value = _value || {};
    this.name = _value.name;
    this.senderId = _value.senderId;
    this.createTime = _value.createTime
      ? new googleProtobuf000.Timestamp(_value.createTime)
      : undefined;
    this.updateTime = _value.updateTime
      ? new googleProtobuf000.Timestamp(_value.updateTime)
      : undefined;
    this.unread = _value.unread;
    this.content = _value.content;
    this.imagePreview = _value.imagePreview;
    this.link = _value.link;
    Notification.refineValues(this);
  }
  get name(): string | undefined {
    return this._name;
  }
  set name(value: string | undefined) {
    this._name = value;
  }
  get senderId(): string | undefined {
    return this._senderId;
  }
  set senderId(value: string | undefined) {
    this._senderId = value;
  }
  get createTime(): googleProtobuf000.Timestamp | undefined {
    return this._createTime;
  }
  set createTime(value: googleProtobuf000.Timestamp | undefined) {
    this._createTime = value;
  }
  get updateTime(): googleProtobuf000.Timestamp | undefined {
    return this._updateTime;
  }
  set updateTime(value: googleProtobuf000.Timestamp | undefined) {
    this._updateTime = value;
  }
  get unread(): boolean | undefined {
    return this._unread;
  }
  set unread(value: boolean | undefined) {
    this._unread = value;
  }
  get content(): string | undefined {
    return this._content;
  }
  set content(value: string | undefined) {
    this._content = value;
  }
  get imagePreview(): string | undefined {
    return this._imagePreview;
  }
  set imagePreview(value: string | undefined) {
    this._imagePreview = value;
  }
  get link(): string | undefined {
    return this._link;
  }
  set link(value: string | undefined) {
    this._link = value;
  }

  /**
   * Serialize message to binary data
   * @param instance message instance
   */
  serializeBinary() {
    const writer = new BinaryWriter();
    Notification.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): Notification.AsObject {
    return {
      name: this.name,
      senderId: this.senderId,
      createTime: this.createTime ? this.createTime.toObject() : undefined,
      updateTime: this.updateTime ? this.updateTime.toObject() : undefined,
      unread: this.unread,
      content: this.content,
      imagePreview: this.imagePreview,
      link: this.link
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
  ): Notification.AsProtobufJSON {
    return {
      name: this.name,
      senderId: this.senderId,
      createTime: this.createTime
        ? this.createTime.toProtobufJSON(options)
        : null,
      updateTime: this.updateTime
        ? this.updateTime.toProtobufJSON(options)
        : null,
      unread: this.unread,
      content: this.content,
      imagePreview: this.imagePreview,
      link: this.link
    };
  }
}
export module Notification {
  /**
   * Standard JavaScript object representation for Notification
   */
  export interface AsObject {
    name?: string;
    senderId?: string;
    createTime?: googleProtobuf000.Timestamp.AsObject;
    updateTime?: googleProtobuf000.Timestamp.AsObject;
    unread?: boolean;
    content?: string;
    imagePreview?: string;
    link?: string;
  }

  /**
   * Protobuf JSON representation for Notification
   */
  export interface AsProtobufJSON {
    name?: string;
    senderId?: string;
    createTime?: googleProtobuf000.Timestamp.AsProtobufJSON | null;
    updateTime?: googleProtobuf000.Timestamp.AsProtobufJSON | null;
    unread?: boolean;
    content?: string;
    imagePreview?: string;
    link?: string;
  }
}

/**
 * Message implementation for routeguide.ResourceView
 */
export class ResourceView implements GrpcMessage {
  static id = 'routeguide.ResourceView';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new ResourceView();
    ResourceView.deserializeBinaryFromReader(instance, new BinaryReader(bytes));
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: ResourceView) {
    _instance.name = _instance.name || '';
    _instance.displayName = _instance.displayName || '';
    _instance.description = _instance.description || '';
    _instance.imageUrl = _instance.imageUrl || '';
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: ResourceView,
    _reader: BinaryReader
  ) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          _instance.name = _reader.readString();
          break;
        case 2:
          _instance.displayName = _reader.readString();
          break;
        case 3:
          _instance.description = _reader.readString();
          break;
        case 4:
          _instance.imageUrl = _reader.readString();
          break;
        default:
          _reader.skipField();
      }
    }

    ResourceView.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(
    _instance: ResourceView,
    _writer: BinaryWriter
  ) {
    if (_instance.name) {
      _writer.writeString(1, _instance.name);
    }
    if (_instance.displayName) {
      _writer.writeString(2, _instance.displayName);
    }
    if (_instance.description) {
      _writer.writeString(3, _instance.description);
    }
    if (_instance.imageUrl) {
      _writer.writeString(4, _instance.imageUrl);
    }
  }

  private _name?: string;
  private _displayName?: string;
  private _description?: string;
  private _imageUrl?: string;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of ResourceView to deeply clone from
   */
  constructor(_value?: RecursivePartial<ResourceView.AsObject>) {
    _value = _value || {};
    this.name = _value.name;
    this.displayName = _value.displayName;
    this.description = _value.description;
    this.imageUrl = _value.imageUrl;
    ResourceView.refineValues(this);
  }
  get name(): string | undefined {
    return this._name;
  }
  set name(value: string | undefined) {
    this._name = value;
  }
  get displayName(): string | undefined {
    return this._displayName;
  }
  set displayName(value: string | undefined) {
    this._displayName = value;
  }
  get description(): string | undefined {
    return this._description;
  }
  set description(value: string | undefined) {
    this._description = value;
  }
  get imageUrl(): string | undefined {
    return this._imageUrl;
  }
  set imageUrl(value: string | undefined) {
    this._imageUrl = value;
  }

  /**
   * Serialize message to binary data
   * @param instance message instance
   */
  serializeBinary() {
    const writer = new BinaryWriter();
    ResourceView.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): ResourceView.AsObject {
    return {
      name: this.name,
      displayName: this.displayName,
      description: this.description,
      imageUrl: this.imageUrl
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
  ): ResourceView.AsProtobufJSON {
    return {
      name: this.name,
      displayName: this.displayName,
      description: this.description,
      imageUrl: this.imageUrl
    };
  }
}
export module ResourceView {
  /**
   * Standard JavaScript object representation for ResourceView
   */
  export interface AsObject {
    name?: string;
    displayName?: string;
    description?: string;
    imageUrl?: string;
  }

  /**
   * Protobuf JSON representation for ResourceView
   */
  export interface AsProtobufJSON {
    name?: string;
    displayName?: string;
    description?: string;
    imageUrl?: string;
  }
}

/**
 * Message implementation for routeguide.Article
 */
export class Article implements GrpcMessage {
  static id = 'routeguide.Article';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new Article();
    Article.deserializeBinaryFromReader(instance, new BinaryReader(bytes));
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: Article) {
    _instance.name = _instance.name || '';
    _instance.subject = _instance.subject || '';
    _instance.content = _instance.content || '';
    _instance.authorId = _instance.authorId || '0';
    _instance.createTime = _instance.createTime || undefined;
    _instance.updateTime = _instance.updateTime || undefined;
    _instance.state = _instance.state || 0;
    _instance.tags = _instance.tags || [];
    _instance.viewCount = _instance.viewCount || '0';
    _instance.likeCount = _instance.likeCount || '0';
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: Article,
    _reader: BinaryReader
  ) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          _instance.name = _reader.readString();
          break;
        case 2:
          _instance.subject = _reader.readString();
          break;
        case 3:
          _instance.content = _reader.readString();
          break;
        case 4:
          _instance.authorId = _reader.readInt64String();
          break;
        case 5:
          _instance.createTime = new googleProtobuf000.Timestamp();
          _reader.readMessage(
            _instance.createTime,
            googleProtobuf000.Timestamp.deserializeBinaryFromReader
          );
          break;
        case 6:
          _instance.updateTime = new googleProtobuf000.Timestamp();
          _reader.readMessage(
            _instance.updateTime,
            googleProtobuf000.Timestamp.deserializeBinaryFromReader
          );
          break;
        case 7:
          _instance.state = _reader.readEnum();
          break;
        case 8:
          (_instance.tags = _instance.tags || []).push(_reader.readString());
          break;
        case 21:
          _instance.viewCount = _reader.readInt64String();
          break;
        case 22:
          _instance.likeCount = _reader.readInt64String();
          break;
        default:
          _reader.skipField();
      }
    }

    Article.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(_instance: Article, _writer: BinaryWriter) {
    if (_instance.name) {
      _writer.writeString(1, _instance.name);
    }
    if (_instance.subject) {
      _writer.writeString(2, _instance.subject);
    }
    if (_instance.content) {
      _writer.writeString(3, _instance.content);
    }
    if (_instance.authorId) {
      _writer.writeInt64String(4, _instance.authorId);
    }
    if (_instance.createTime) {
      _writer.writeMessage(
        5,
        _instance.createTime as any,
        googleProtobuf000.Timestamp.serializeBinaryToWriter
      );
    }
    if (_instance.updateTime) {
      _writer.writeMessage(
        6,
        _instance.updateTime as any,
        googleProtobuf000.Timestamp.serializeBinaryToWriter
      );
    }
    if (_instance.state) {
      _writer.writeEnum(7, _instance.state);
    }
    if (_instance.tags && _instance.tags.length) {
      _writer.writeRepeatedString(8, _instance.tags);
    }
    if (_instance.viewCount) {
      _writer.writeInt64String(21, _instance.viewCount);
    }
    if (_instance.likeCount) {
      _writer.writeInt64String(22, _instance.likeCount);
    }
  }

  private _name?: string;
  private _subject?: string;
  private _content?: string;
  private _authorId?: string;
  private _createTime?: googleProtobuf000.Timestamp;
  private _updateTime?: googleProtobuf000.Timestamp;
  private _state?: ResourceState;
  private _tags?: string[];
  private _viewCount?: string;
  private _likeCount?: string;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of Article to deeply clone from
   */
  constructor(_value?: RecursivePartial<Article.AsObject>) {
    _value = _value || {};
    this.name = _value.name;
    this.subject = _value.subject;
    this.content = _value.content;
    this.authorId = _value.authorId;
    this.createTime = _value.createTime
      ? new googleProtobuf000.Timestamp(_value.createTime)
      : undefined;
    this.updateTime = _value.updateTime
      ? new googleProtobuf000.Timestamp(_value.updateTime)
      : undefined;
    this.state = _value.state;
    this.tags = (_value.tags || []).slice();
    this.viewCount = _value.viewCount;
    this.likeCount = _value.likeCount;
    Article.refineValues(this);
  }
  get name(): string | undefined {
    return this._name;
  }
  set name(value: string | undefined) {
    this._name = value;
  }
  get subject(): string | undefined {
    return this._subject;
  }
  set subject(value: string | undefined) {
    this._subject = value;
  }
  get content(): string | undefined {
    return this._content;
  }
  set content(value: string | undefined) {
    this._content = value;
  }
  get authorId(): string | undefined {
    return this._authorId;
  }
  set authorId(value: string | undefined) {
    this._authorId = value;
  }
  get createTime(): googleProtobuf000.Timestamp | undefined {
    return this._createTime;
  }
  set createTime(value: googleProtobuf000.Timestamp | undefined) {
    this._createTime = value;
  }
  get updateTime(): googleProtobuf000.Timestamp | undefined {
    return this._updateTime;
  }
  set updateTime(value: googleProtobuf000.Timestamp | undefined) {
    this._updateTime = value;
  }
  get state(): ResourceState | undefined {
    return this._state;
  }
  set state(value: ResourceState | undefined) {
    this._state = value;
  }
  get tags(): string[] | undefined {
    return this._tags;
  }
  set tags(value: string[] | undefined) {
    this._tags = value;
  }
  get viewCount(): string | undefined {
    return this._viewCount;
  }
  set viewCount(value: string | undefined) {
    this._viewCount = value;
  }
  get likeCount(): string | undefined {
    return this._likeCount;
  }
  set likeCount(value: string | undefined) {
    this._likeCount = value;
  }

  /**
   * Serialize message to binary data
   * @param instance message instance
   */
  serializeBinary() {
    const writer = new BinaryWriter();
    Article.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): Article.AsObject {
    return {
      name: this.name,
      subject: this.subject,
      content: this.content,
      authorId: this.authorId,
      createTime: this.createTime ? this.createTime.toObject() : undefined,
      updateTime: this.updateTime ? this.updateTime.toObject() : undefined,
      state: this.state,
      tags: (this.tags || []).slice(),
      viewCount: this.viewCount,
      likeCount: this.likeCount
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
  ): Article.AsProtobufJSON {
    return {
      name: this.name,
      subject: this.subject,
      content: this.content,
      authorId: this.authorId,
      createTime: this.createTime
        ? this.createTime.toProtobufJSON(options)
        : null,
      updateTime: this.updateTime
        ? this.updateTime.toProtobufJSON(options)
        : null,
      state: ResourceState[this.state ?? 0],
      tags: (this.tags || []).slice(),
      viewCount: this.viewCount,
      likeCount: this.likeCount
    };
  }
}
export module Article {
  /**
   * Standard JavaScript object representation for Article
   */
  export interface AsObject {
    name?: string;
    subject?: string;
    content?: string;
    authorId?: string;
    createTime?: googleProtobuf000.Timestamp.AsObject;
    updateTime?: googleProtobuf000.Timestamp.AsObject;
    state?: ResourceState;
    tags?: string[];
    viewCount?: string;
    likeCount?: string;
  }

  /**
   * Protobuf JSON representation for Article
   */
  export interface AsProtobufJSON {
    name?: string;
    subject?: string;
    content?: string;
    authorId?: string;
    createTime?: googleProtobuf000.Timestamp.AsProtobufJSON | null;
    updateTime?: googleProtobuf000.Timestamp.AsProtobufJSON | null;
    state?: string;
    tags?: string[];
    viewCount?: string;
    likeCount?: string;
  }
}

/**
 * Message implementation for routeguide.File
 */
export class File implements GrpcMessage {
  static id = 'routeguide.File';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new File();
    File.deserializeBinaryFromReader(instance, new BinaryReader(bytes));
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: File) {
    _instance.filename = _instance.filename || '';
    _instance.ext = _instance.ext || '';
    _instance.server = _instance.server || 0;
    _instance.uri = _instance.uri || '';
    _instance.url = _instance.url || '';
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(_instance: File, _reader: BinaryReader) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          _instance.filename = _reader.readString();
          break;
        case 2:
          _instance.ext = _reader.readString();
          break;
        case 4:
          _instance.server = _reader.readEnum();
          break;
        case 3:
          _instance.uri = _reader.readString();
          break;
        case 5:
          _instance.url = _reader.readString();
          break;
        default:
          _reader.skipField();
      }
    }

    File.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(_instance: File, _writer: BinaryWriter) {
    if (_instance.filename) {
      _writer.writeString(1, _instance.filename);
    }
    if (_instance.ext) {
      _writer.writeString(2, _instance.ext);
    }
    if (_instance.server) {
      _writer.writeEnum(4, _instance.server);
    }
    if (_instance.uri) {
      _writer.writeString(3, _instance.uri);
    }
    if (_instance.url) {
      _writer.writeString(5, _instance.url);
    }
  }

  private _filename?: string;
  private _ext?: string;
  private _server?: File.Server;
  private _uri?: string;
  private _url?: string;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of File to deeply clone from
   */
  constructor(_value?: RecursivePartial<File.AsObject>) {
    _value = _value || {};
    this.filename = _value.filename;
    this.ext = _value.ext;
    this.server = _value.server;
    this.uri = _value.uri;
    this.url = _value.url;
    File.refineValues(this);
  }
  get filename(): string | undefined {
    return this._filename;
  }
  set filename(value: string | undefined) {
    this._filename = value;
  }
  get ext(): string | undefined {
    return this._ext;
  }
  set ext(value: string | undefined) {
    this._ext = value;
  }
  get server(): File.Server | undefined {
    return this._server;
  }
  set server(value: File.Server | undefined) {
    this._server = value;
  }
  get uri(): string | undefined {
    return this._uri;
  }
  set uri(value: string | undefined) {
    this._uri = value;
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
    File.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): File.AsObject {
    return {
      filename: this.filename,
      ext: this.ext,
      server: this.server,
      uri: this.uri,
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
  ): File.AsProtobufJSON {
    return {
      filename: this.filename,
      ext: this.ext,
      server: File.Server[this.server ?? 0],
      uri: this.uri,
      url: this.url
    };
  }
}
export module File {
  /**
   * Standard JavaScript object representation for File
   */
  export interface AsObject {
    filename?: string;
    ext?: string;
    server?: File.Server;
    uri?: string;
    url?: string;
  }

  /**
   * Protobuf JSON representation for File
   */
  export interface AsProtobufJSON {
    filename?: string;
    ext?: string;
    server?: string;
    uri?: string;
    url?: string;
  }
  export enum Server {
    SERVER_UNSPECIFIED = 0,
    GCS = 1,
    AWS_S3 = 2
  }
}

/**
 * Message implementation for routeguide.Subscription
 */
export class Subscription implements GrpcMessage {
  static id = 'routeguide.Subscription';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new Subscription();
    Subscription.deserializeBinaryFromReader(instance, new BinaryReader(bytes));
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: Subscription) {
    _instance.name = _instance.name || '';
    _instance.subscriberId = _instance.subscriberId || '0';
    _instance.createTime = _instance.createTime || undefined;
    _instance.updateTime = _instance.updateTime || undefined;
    _instance.type = _instance.type || 0;
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: Subscription,
    _reader: BinaryReader
  ) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          _instance.name = _reader.readString();
          break;
        case 2:
          _instance.subscriberId = _reader.readInt64String();
          break;
        case 3:
          _instance.createTime = new googleProtobuf000.Timestamp();
          _reader.readMessage(
            _instance.createTime,
            googleProtobuf000.Timestamp.deserializeBinaryFromReader
          );
          break;
        case 4:
          _instance.updateTime = new googleProtobuf000.Timestamp();
          _reader.readMessage(
            _instance.updateTime,
            googleProtobuf000.Timestamp.deserializeBinaryFromReader
          );
          break;
        case 5:
          _instance.type = _reader.readEnum();
          break;
        default:
          _reader.skipField();
      }
    }

    Subscription.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(
    _instance: Subscription,
    _writer: BinaryWriter
  ) {
    if (_instance.name) {
      _writer.writeString(1, _instance.name);
    }
    if (_instance.subscriberId) {
      _writer.writeInt64String(2, _instance.subscriberId);
    }
    if (_instance.createTime) {
      _writer.writeMessage(
        3,
        _instance.createTime as any,
        googleProtobuf000.Timestamp.serializeBinaryToWriter
      );
    }
    if (_instance.updateTime) {
      _writer.writeMessage(
        4,
        _instance.updateTime as any,
        googleProtobuf000.Timestamp.serializeBinaryToWriter
      );
    }
    if (_instance.type) {
      _writer.writeEnum(5, _instance.type);
    }
  }

  private _name?: string;
  private _subscriberId?: string;
  private _createTime?: googleProtobuf000.Timestamp;
  private _updateTime?: googleProtobuf000.Timestamp;
  private _type?: Subscription.SubscribeType;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of Subscription to deeply clone from
   */
  constructor(_value?: RecursivePartial<Subscription.AsObject>) {
    _value = _value || {};
    this.name = _value.name;
    this.subscriberId = _value.subscriberId;
    this.createTime = _value.createTime
      ? new googleProtobuf000.Timestamp(_value.createTime)
      : undefined;
    this.updateTime = _value.updateTime
      ? new googleProtobuf000.Timestamp(_value.updateTime)
      : undefined;
    this.type = _value.type;
    Subscription.refineValues(this);
  }
  get name(): string | undefined {
    return this._name;
  }
  set name(value: string | undefined) {
    this._name = value;
  }
  get subscriberId(): string | undefined {
    return this._subscriberId;
  }
  set subscriberId(value: string | undefined) {
    this._subscriberId = value;
  }
  get createTime(): googleProtobuf000.Timestamp | undefined {
    return this._createTime;
  }
  set createTime(value: googleProtobuf000.Timestamp | undefined) {
    this._createTime = value;
  }
  get updateTime(): googleProtobuf000.Timestamp | undefined {
    return this._updateTime;
  }
  set updateTime(value: googleProtobuf000.Timestamp | undefined) {
    this._updateTime = value;
  }
  get type(): Subscription.SubscribeType | undefined {
    return this._type;
  }
  set type(value: Subscription.SubscribeType | undefined) {
    this._type = value;
  }

  /**
   * Serialize message to binary data
   * @param instance message instance
   */
  serializeBinary() {
    const writer = new BinaryWriter();
    Subscription.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): Subscription.AsObject {
    return {
      name: this.name,
      subscriberId: this.subscriberId,
      createTime: this.createTime ? this.createTime.toObject() : undefined,
      updateTime: this.updateTime ? this.updateTime.toObject() : undefined,
      type: this.type
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
  ): Subscription.AsProtobufJSON {
    return {
      name: this.name,
      subscriberId: this.subscriberId,
      createTime: this.createTime
        ? this.createTime.toProtobufJSON(options)
        : null,
      updateTime: this.updateTime
        ? this.updateTime.toProtobufJSON(options)
        : null,
      type: Subscription.SubscribeType[this.type ?? 0]
    };
  }
}
export module Subscription {
  /**
   * Standard JavaScript object representation for Subscription
   */
  export interface AsObject {
    name?: string;
    subscriberId?: string;
    createTime?: googleProtobuf000.Timestamp.AsObject;
    updateTime?: googleProtobuf000.Timestamp.AsObject;
    type?: Subscription.SubscribeType;
  }

  /**
   * Protobuf JSON representation for Subscription
   */
  export interface AsProtobufJSON {
    name?: string;
    subscriberId?: string;
    createTime?: googleProtobuf000.Timestamp.AsProtobufJSON | null;
    updateTime?: googleProtobuf000.Timestamp.AsProtobufJSON | null;
    type?: string;
  }
  export enum SubscribeType {
    SUBSCRIBE_TYPE_UNSPECIFIED = 0,
    ALL = 1
  }
}

/**
 * Message implementation for routeguide.FieldMask
 */
export class FieldMask implements GrpcMessage {
  static id = 'routeguide.FieldMask';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new FieldMask();
    FieldMask.deserializeBinaryFromReader(instance, new BinaryReader(bytes));
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: FieldMask) {
    _instance.paths = _instance.paths || [];
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: FieldMask,
    _reader: BinaryReader
  ) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          (_instance.paths = _instance.paths || []).push(_reader.readString());
          break;
        default:
          _reader.skipField();
      }
    }

    FieldMask.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(_instance: FieldMask, _writer: BinaryWriter) {
    if (_instance.paths && _instance.paths.length) {
      _writer.writeRepeatedString(1, _instance.paths);
    }
  }

  private _paths?: string[];

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of FieldMask to deeply clone from
   */
  constructor(_value?: RecursivePartial<FieldMask.AsObject>) {
    _value = _value || {};
    this.paths = (_value.paths || []).slice();
    FieldMask.refineValues(this);
  }
  get paths(): string[] | undefined {
    return this._paths;
  }
  set paths(value: string[] | undefined) {
    this._paths = value;
  }

  /**
   * Serialize message to binary data
   * @param instance message instance
   */
  serializeBinary() {
    const writer = new BinaryWriter();
    FieldMask.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): FieldMask.AsObject {
    return {
      paths: (this.paths || []).slice()
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
  ): FieldMask.AsProtobufJSON {
    return {
      paths: (this.paths || []).slice()
    };
  }
}
export module FieldMask {
  /**
   * Standard JavaScript object representation for FieldMask
   */
  export interface AsObject {
    paths?: string[];
  }

  /**
   * Protobuf JSON representation for FieldMask
   */
  export interface AsProtobufJSON {
    paths?: string[];
  }
}
