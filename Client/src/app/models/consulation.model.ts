export interface ConsultationSubmission {
	clientName: string
	email: string
	preferredArtist?: string | null
	style: string
	placement: string
	size: string
	description: string
	referenceImages: string[]
}

export interface ConsultationDisplay {
	id: number
	clientName: string
	email: string
	preferredArtist?: string | null
	style: string
	placement: string
	size: string
	description: string
	referenceImages: string[]
	createdAt: string
	selectedImageUrl?: string
}
