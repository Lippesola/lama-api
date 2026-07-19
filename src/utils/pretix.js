import pretix from '../config/pretix.js';

function baseUrl() {
	return `${pretix.apiUrl}/organizers/${pretix.organizer}/events/${pretix.event}`;
}

async function pretixFetch(path, options = {}) {
	const response = await fetch(baseUrl() + path, {
		...options,
		headers: {
			'Authorization': `Token ${pretix.apiToken}`,
			'Content-Type': 'application/json',
			...(options.headers || {}),
		},
	});
	if (!response.ok) {
		const body = await response.text().catch(() => '');
		throw new Error(`Pretix API error ${response.status} on ${path}: ${body}`);
	}
	if (response.status === 204) return null;
	return response.json();
}

export async function getPretixOrder(orderId) {
	return pretixFetch(`/orders/${orderId}/`, { method: 'GET' });
}

export async function getPretixOrdersPage(page = 1) {
	return pretixFetch(`/orders/?page=${page}`, { method: 'GET' });
}

async function fetchAllQuestions(page = 1, summarized = []) {
	const data = await pretixFetch(`/questions/?page=${page}`, { method: 'GET' });
	const combined = [...summarized, ...data.results];
	if (data.next) return fetchAllQuestions(page + 1, combined);
	return combined;
}

let questionsPromise = null;
// Liefert alle Pretix-Fragen (mit Optionen für Choice-Fragen), prozessweit gecached.
export function getPretixQuestions() {
	if (!questionsPromise) questionsPromise = fetchAllQuestions();
	return questionsPromise;
}

export async function patchPretixOrder(orderId, body) {
	return pretixFetch(`/orders/${orderId}/`, { method: 'PATCH', body: JSON.stringify(body) });
}

export async function patchPretixOrderPosition(positionPk, body) {
	return pretixFetch(`/orderpositions/${positionPk}/`, { method: 'PATCH', body: JSON.stringify(body) });
}
