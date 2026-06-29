export const DEVICE_TYPE_OPTIONS = [
	{ label: 'RFID Reader', value: 'RFID_READER' },
	{ label: 'Face Recognition', value: 'FACE_RECOGNITION' },
	{ label: 'Fingerprint', value: 'FINGERPRINT' },
];

export const DIRECTION_OPTIONS = [
	{ label: 'In', value: 'IN' },
	{ label: 'Out', value: 'OUT' },
	{ label: 'Both', value: 'BOTH' },
	{ label: 'Toggle', value: 'TOGGLE' },
];

export const DOOR_STATUS_OPTIONS = [
	{ label: 'Online', value: 'ONLINE' },
	{ label: 'Offline', value: 'OFFLINE' },
	{ label: 'Maintenance', value: 'MAINTENANCE' },
	{ label: 'Disabled', value: 'DISABLED' },
];

export const findOption = (options: { label: string; value: string }[], value: unknown) =>
	options.find((opt) => String(opt.value) === String(value)) || null;

export const formatDoorLabel = (value: unknown, options: { label: string; value: string }[]) =>
	findOption(options, value)?.label || (value != null ? String(value) : '----');
