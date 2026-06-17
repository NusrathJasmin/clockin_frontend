
export const parseSetPasswordParams = (search = window.location.search) => {
	const params = new URLSearchParams(search);
	let token = (params.get('token') || '').trim();
	let tenant = (params.get('tenant') || '').trim();

	if (token.includes('?tenant=')) {
		const [tokenPart, tenantPart] = token.split('?tenant=');
		token = tokenPart.trim();
		tenant = (tenantPart || tenant).trim();
	}

	return { token, tenant };
};
