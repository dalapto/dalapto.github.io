/** A file already saved in storage, as shown by FileUpload. */
interface StoredFile {
	url: string;
	name: string;
	storageFilename: string;
}

/** An image already saved in storage, as shown by ImageUpload. */
interface StoredImage {
	url: string;
	storageFilename: string;
}

/** An image, audio or video file already saved in storage, as shown by MediaUpload. */
interface StoredMedia {
	url: string;
	name: string;
	storageFilename: string;
}

/** One slot in an upload control: already stored, or waiting to be uploaded. */
type StorageSaveItem = {
	storageFilename?: string;
	pendingFile?: File;
};

export type { StorageSaveItem, StoredFile, StoredImage, StoredMedia };
