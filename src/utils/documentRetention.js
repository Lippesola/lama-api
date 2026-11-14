export const documentTypes = ['criminalRecord', 'selfCommitment', 'privacyCommitment', 'parentalConsent']

// userYear.status value for "activated" (= was part of the team that year)
export const ACTIVATED = 4

// Values below this are legacy/invalid entries (e.g. 2-digit years) and must not be touched automatically.
const MIN_VALID_YEAR = 2000

/**
 * A document handed in during year Y stays valid only as long as the user was
 * an activated team member in EVERY year between Y and the year being started.
 * Example: handed in 2025, active 2025 and 2026 -> still kept for 2027.
 *          handed in 2025, not active 2026       -> must be handed in again for 2027.
 *
 * @param {object|null} userDocument  row of UserDocument (or null)
 * @param {Set<number>} activeYears   years in which the user had status ACTIVATED
 * @param {number} newYear            the year that is about to start
 * @returns {{reset: string[], skipped: string[]}} document types to reset / legacy values left untouched
 */
export function evaluateDocuments(userDocument, activeYears, newYear) {
	const reset = []
	const skipped = []
	if (!userDocument) return { reset, skipped }
	for (const type of documentTypes) {
		const handedIn = userDocument[type]
		if (handedIn === null || handedIn === undefined) continue
		if (handedIn < MIN_VALID_YEAR) {
			skipped.push(type)
			continue
		}
		for (let year = handedIn + 1; year < newYear; year++) {
			if (!activeYears.has(year)) {
				reset.push(type)
				break
			}
		}
	}
	return { reset, skipped }
}
