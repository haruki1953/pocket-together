/**
* This file was @generated using pocketbase-typegen
*/

import type PocketBase from 'pocketbase'
import type { RecordService } from 'pocketbase'

export enum Collections {
	Authorigins = "_authOrigins",
	Externalauths = "_externalAuths",
	Mfas = "_mfas",
	Otps = "_otps",
	Superusers = "_superusers",
	Config = "config",
	Files = "files",
	Messages = "messages",
	Rooms = "rooms",
	Users = "users",
}

// Alias types for improved usability
export type IsoDateString = string
export type RecordIdString = string
export type HTMLString = string

type ExpandType<T> = unknown extends T
	? T extends unknown
		? { expand?: unknown }
		: { expand: T }
	: { expand: T }

// System fields
export type BaseSystemFields<T = unknown> = {
	id: RecordIdString
	collectionId: string
	collectionName: Collections
} & ExpandType<T>

export type AuthSystemFields<T = unknown> = {
	email: string
	emailVisibility: boolean
	username: string
	verified: boolean
} & BaseSystemFields<T>

// Record types for each collection

export type AuthoriginsRecord = {
	collectionRef: string
	created?: IsoDateString
	fingerprint: string
	id: string
	recordRef: string
	updated?: IsoDateString
}

export type ExternalauthsRecord = {
	collectionRef: string
	created?: IsoDateString
	id: string
	provider: string
	providerId: string
	recordRef: string
	updated?: IsoDateString
}

export type MfasRecord = {
	collectionRef: string
	created?: IsoDateString
	id: string
	method: string
	recordRef: string
	updated?: IsoDateString
}

export type OtpsRecord = {
	collectionRef: string
	created?: IsoDateString
	id: string
	password: string
	recordRef: string
	sentTo?: string
	updated?: IsoDateString
}

export type SuperusersRecord = {
	created?: IsoDateString
	email: string
	emailVisibility?: boolean
	id: string
	password: string
	tokenKey: string
	updated?: IsoDateString
	verified?: boolean
}

export type ConfigRecord<Tvalue = unknown> = {
	created?: IsoDateString
	id: string
	key?: string
	updated?: IsoDateString
	value?: null | Tvalue
}

export type FilesRecord = {
	author: RecordIdString
	created?: IsoDateString
	description?: string
	file: string
	id: string
	size?: number
	title?: string
	updated?: IsoDateString
}

export type MessagesRecord = {
	author: RecordIdString
	content?: string
	created?: IsoDateString
	id: string
	isDeleted?: boolean
	quoteFile?: RecordIdString
	quoteRoom?: RecordIdString
	replyMessage?: RecordIdString
	room?: RecordIdString
	updated?: IsoDateString
}

export type RoomsRecord<Ttags = unknown> = {
	author: RecordIdString
	cover?: string
	coverHeight?: number
	coverWidth?: number
	created?: IsoDateString
	description?: string
	id: string
	join?: RecordIdString[]
	password?: string
	playlist?: RecordIdString[]
	tags?: null | Ttags
	title: string
	updated?: IsoDateString
}

export enum UsersLevelOptions {
	"basic" = "basic",
	"premium" = "premium",
}
export type UsersRecord<Tinfo = unknown> = {
	avatar?: string
	bio?: string
	created?: IsoDateString
	email: string
	emailVisibility?: boolean
	id: string
	info?: null | Tinfo
	level: UsersLevelOptions
	name?: string
	password: string
	tokenKey: string
	updated?: IsoDateString
	username: string
	verified?: boolean
}

// Response types include system fields and match responses from the PocketBase API
export type AuthoriginsResponse<Texpand = unknown> = Required<AuthoriginsRecord> & BaseSystemFields<Texpand>
export type ExternalauthsResponse<Texpand = unknown> = Required<ExternalauthsRecord> & BaseSystemFields<Texpand>
export type MfasResponse<Texpand = unknown> = Required<MfasRecord> & BaseSystemFields<Texpand>
export type OtpsResponse<Texpand = unknown> = Required<OtpsRecord> & BaseSystemFields<Texpand>
export type SuperusersResponse<Texpand = unknown> = Required<SuperusersRecord> & AuthSystemFields<Texpand>
export type ConfigResponse<Tvalue = unknown, Texpand = unknown> = Required<ConfigRecord<Tvalue>> & BaseSystemFields<Texpand>
export type FilesResponse<Texpand = unknown> = Required<FilesRecord> & BaseSystemFields<Texpand>
export type MessagesResponse<Texpand = unknown> = Required<MessagesRecord> & BaseSystemFields<Texpand>
export type RoomsResponse<Ttags = unknown, Texpand = unknown> = Required<RoomsRecord<Ttags>> & BaseSystemFields<Texpand>
export type UsersResponse<Tinfo = unknown, Texpand = unknown> = Required<UsersRecord<Tinfo>> & AuthSystemFields<Texpand>

// Types containing all Records and Responses, useful for creating typing helper functions

export type CollectionRecords = {
	_authOrigins: AuthoriginsRecord
	_externalAuths: ExternalauthsRecord
	_mfas: MfasRecord
	_otps: OtpsRecord
	_superusers: SuperusersRecord
	config: ConfigRecord
	files: FilesRecord
	messages: MessagesRecord
	rooms: RoomsRecord
	users: UsersRecord
}

export type CollectionResponses = {
	_authOrigins: AuthoriginsResponse
	_externalAuths: ExternalauthsResponse
	_mfas: MfasResponse
	_otps: OtpsResponse
	_superusers: SuperusersResponse
	config: ConfigResponse
	files: FilesResponse
	messages: MessagesResponse
	rooms: RoomsResponse
	users: UsersResponse
}

// Type for usage with type asserted PocketBase instance
// https://github.com/pocketbase/js-sdk#specify-typescript-definitions

export type TypedPocketBase = PocketBase & {
	collection(idOrName: '_authOrigins'): RecordService<AuthoriginsResponse>
	collection(idOrName: '_externalAuths'): RecordService<ExternalauthsResponse>
	collection(idOrName: '_mfas'): RecordService<MfasResponse>
	collection(idOrName: '_otps'): RecordService<OtpsResponse>
	collection(idOrName: '_superusers'): RecordService<SuperusersResponse>
	collection(idOrName: 'config'): RecordService<ConfigResponse>
	collection(idOrName: 'files'): RecordService<FilesResponse>
	collection(idOrName: 'messages'): RecordService<MessagesResponse>
	collection(idOrName: 'rooms'): RecordService<RoomsResponse>
	collection(idOrName: 'users'): RecordService<UsersResponse>
}
