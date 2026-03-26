// TODO: Implementar servicios académicos
// - Gestión de carreras
// - Gestión de materias
// - Gestión de inscripciones
// - Validación de correlatividades

export class AcademicService {
	async getCarreras() {
		// TODO: Implementar obtención de carreras
		return [];
	}

	async getMaterias(carreraId?: number) {
		// TODO: Implementar obtención de materias
		return [];
	}

	async getInscripciones(alumnoId: number) {
		// TODO: Implementar obtención de inscripciones
		return [];
	}

	async createInscripcion(alumnoId: number, comisionId: number) {
		// TODO: Implementar creación de inscripción
		// - Validar cupos
		// - Validar correlatividades
		// - Validar deuda
		return null;
	}
}
