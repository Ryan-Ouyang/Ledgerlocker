// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  TypedMap,
  Entity,
  Value,
  ValueKind,
  store,
  Address,
  Bytes,
  BigInt,
  BigDecimal
} from "@graphprotocol/graph-ts";

export class Listing extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save Listing entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save Listing entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("Listing", id.toString(), this);
  }

  static load(id: string): Listing | null {
    return store.get("Listing", id) as Listing | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get listingId(): BigInt {
    let value = this.get("listingId");
    return value.toBigInt();
  }

  set listingId(value: BigInt) {
    this.set("listingId", Value.fromBigInt(value));
  }

  get price(): BigInt | null {
    let value = this.get("price");
    if (value === null) {
      return null;
    } else {
      return value.toBigInt();
    }
  }

  set price(value: BigInt | null) {
    if (value === null) {
      this.unset("price");
    } else {
      this.set("price", Value.fromBigInt(value as BigInt));
    }
  }

  get booked(): boolean {
    let value = this.get("booked");
    return value.toBoolean();
  }

  set booked(value: boolean) {
    this.set("booked", Value.fromBoolean(value));
  }

  get renter(): string | null {
    let value = this.get("renter");
    if (value === null) {
      return null;
    } else {
      return value.toString();
    }
  }

  set renter(value: string | null) {
    if (value === null) {
      this.unset("renter");
    } else {
      this.set("renter", Value.fromString(value as string));
    }
  }

  get owner(): string | null {
    let value = this.get("owner");
    if (value === null) {
      return null;
    } else {
      return value.toString();
    }
  }

  set owner(value: string | null) {
    if (value === null) {
      this.unset("owner");
    } else {
      this.set("owner", Value.fromString(value as string));
    }
  }

  get eventType(): string {
    let value = this.get("eventType");
    return value.toString();
  }

  set eventType(value: string) {
    this.set("eventType", Value.fromString(value));
  }
}
