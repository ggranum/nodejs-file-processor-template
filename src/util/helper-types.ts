/**
 * A marker interface to call out a type that is always a number, but is wrapped as a string
 */
export type NumberString = string;
export type PositiveIntegerString = string;

/**
 * Safer to avoid using the term 'Integer'.
 */
export type IntegerValue = number;
export type PositiveIntegerValue = number;

/**
 * 2017-09-03T09:46:07+00:00
 */
export type Iso8601Timestamp = string;

export type TimeZoneCode = string;

/**
 * 2017-09-03
 */
export type Iso8601Datestamp = string;

export type PostCode = string;

export type PresenceBasedBooleanString = string | undefined;

/**
 * Indicates an ID that is generated using #generatePushId()
 */
export type PushId = string;

export type MillisSinceEpoch = number;

export type DecimalMoney = number;
export type StringMoney = string;

export type Primitive = number | string | boolean | null;

