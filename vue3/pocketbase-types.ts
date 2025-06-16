/**
* This file was @generated using pocketbase-typegen
*/

import type PocketBase from 'pocketbase'
import type { RecordService } from 'pocketbase'

export enum Collections {
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

export enum ConfigKeyOptions {
	"allow-basic-users-upload" = "allow-basic-users-upload",
}
export type ConfigRecord<Tvalue = unknown> = {
	created?: IsoDateString
	id: string
	key: ConfigKeyOptions
	note?: string
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
	quoteFile?: RecordIdString
	quoteRoom?: RecordIdString
	room?: RecordIdString
	updated?: IsoDateString
}

export type RoomsRecord = {
	author: RecordIdString
	cover?: string
	coverHeight: number
	coverWidth: number
	created?: IsoDateString
	description?: string
	id: string
	playlist?: RecordIdString[]
	title: string
	updated?: IsoDateString
}

export enum UsersLevelOptions {
	"basic" = "basic",
	"premium" = "premium",
}
export type UsersRecord<Tinfo = unknown> = {
	avatar?: string
	created?: IsoDateString
	email?: string
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
export type ConfigResponse<Tvalue = unknown, Texpand = unknown> = Required<ConfigRecord<Tvalue>> & BaseSystemFields<Texpand>
export type FilesResponse<Texpand = unknown> = Required<FilesRecord> & BaseSystemFields<Texpand>
export type MessagesResponse<Texpand = unknown> = Required<MessagesRecord> & BaseSystemFields<Texpand>
export type RoomsResponse<Texpand = unknown> = Required<RoomsRecord> & BaseSystemFields<Texpand>
export type UsersResponse<Tinfo = unknown, Texpand = unknown> = Required<UsersRecord<Tinfo>> & AuthSystemFields<Texpand>

// Types containing all Records and Responses, useful for creating typing helper functions

export type CollectionRecords = {
	config: ConfigRecord
	files: FilesRecord
	messages: MessagesRecord
	rooms: RoomsRecord
	users: UsersRecord
}

export type CollectionResponses = {
	config: ConfigResponse
	files: FilesResponse
	messages: MessagesResponse
	rooms: RoomsResponse
	users: UsersResponse
}

// Type for usage with type asserted PocketBase instance
// https://github.com/pocketbase/js-sdk#specify-typescript-definitions

export type TypedPocketBase = PocketBase & {
	collection(idOrName: 'config'): RecordService<ConfigResponse>
	collection(idOrName: 'files'): RecordService<FilesResponse>
	collection(idOrName: 'messages'): RecordService<MessagesResponse>
	collection(idOrName: 'rooms'): RecordService<RoomsResponse>
	collection(idOrName: 'users'): RecordService<UsersResponse>
}
