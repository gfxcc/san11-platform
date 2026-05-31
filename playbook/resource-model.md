# Resource model

The backend treats each business object as one resource that can exist in three
representations:

![One resource, three representations](../resources/images/resource-model-three-representations.png)

## Three representations

### 1. Storage state

This is the shape optimized for persistence. For the newer resource model, rows
are addressed by `parent` and `resource_id`, and the resource body is stored as
structured JSON data.

Example:

```text
parent: categories/1
resource_id: 123
data: {
  "name": "categories/1/packages/123",
  "package_name": "...",
  "tags": [...],
  "create_time": "..."
}
```

The generic storage conversion lives in
[`base_db.py`](../back-end/src/handler/model/base/base_db.py).

### 2. In-memory resource model

This is the shape optimized for backend business logic. Handlers work with
Python model objects such as `ModelPackage`, `ModelThread`, `ModelBinary`, and
`ModelArticle`.

The model is more than a data bag. It carries typed fields, resource identity,
conversion metadata, and shared behavior from the base model classes.

Example:

```python
@InitModel(db_table='packages', proto_class=pb.Package)
@attrs.define
class ModelPackage(ModelBase):
    name: str = StrAttrib()
    package_name: str = StrAttrib()
    create_time: datetime.datetime = DatetimeAttrib(...)
    tags: ModelTag = Attrib(..., repeated=True)
```

See [`model_package.py`](../back-end/src/handler/model/model_package.py).

### 3. External API state

This is the shape optimized for the network and frontend contract. The external
form is a protobuf message such as `pb.Package`, `pb.Article`, or `pb.Thread`.
Those protobuf definitions also generate the TypeScript types used by Angular.

The generic protobuf conversion lives in
[`base_proto.py`](../back-end/src/handler/model/base/base_proto.py).

## How conversion works

Each field is declared once with helpers such as `StrAttrib`, `IntAttrib`,
`DatetimeAttrib`, `NestedAttrib`, or the lower-level `Attrib`.

That field metadata tells the base framework:

- whether the field exists in storage
- whether the field exists in protobuf
- which storage path or protobuf path to use
- which converter handles special values such as dates, tags, nested messages,
  or repeated fields

The important conversion methods are:

- `from_db()`: storage JSON to Python model
- `to_db()`: Python model to storage JSON
- `from_pb()`: protobuf message to Python model
- `to_pb()`: Python model to protobuf message

## Why this is useful

This pattern keeps each resource definition reusable across layers:

- Handlers stay focused on business rules instead of mapping fields by hand.
- Storage and protobuf conversion are consistent for every resource type.
- New resource types can plug into the same pipeline.
- Tests can target the shared conversion contract instead of duplicating setup
  for every handler.

In short: the model is the bridge between storage, backend logic, gRPC, and the
Angular UI.
